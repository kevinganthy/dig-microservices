# Architecture simplifiée

![Architecture microservices simplifiée](./µservices-simplified.drawio.png)

L'architecture appliquée pendant ce cours sera simplifiée, tout en gardant la logique et les principes fondamenteaux des microservices.

- L'`API Gateway` se chargera également de gérer l'authentification et le RBAC
- Les services métiers seront réduits à 2 :
  - `Produit`
  - `Panier`
- `Redis` servira à la fois de cache et de service de communication asynchrone
- Le service discovery est supprimé et les addresses des services sont codées en dur dans l'API Gateway. `Produit` et `Panier` ne communiquent pas directement entre eux.
- Les données du panier seront stockées en `noSQL` avec une redondance des informations produits
- La mise en production ne sera pas vu, mais l'environnement de développement sera Dockerisé
- La surveillance des services n'est pas abordée

## Détails

### Infrastructure

Créer une infrastructure avec docker et docker compose représentant le schéma d'architecture simplifié. Utiliser des templates de projets NodeJS temporairement.

- API Gateway : node:22-alpine
- Produit : node:22-alpine
- Panier : node:22-alpine
- Redis : redis:latest
- DB API Gateway : postgres:latest
- DB product : postgres:latest
- DB cart : mongo:latest

Mettre en place le seeding des bases de données avec au moins :

- 2 rôles : admin et user
- 2 utilisateurs :
  - <admin@oclock.io> / `admin`
  - <user@oclock.io> / `user`
- 5 produits
  - nom
  - prix
  - description
  - en stock
- 1 panier avec 2 produits

Ajouter les volumes, networks, healthchecks et dépendances nécessaires.

### Produit

Créer une application NodeJS pour le service produit nommé `product` avec JavaScript, Express et Sequelize.

Implémenter les routes sans gérer l'authentification, qui sera gérée par l'API Gateway :

- `GET /` : Récupère la liste des produits
- `POST /` : Crée un produit
- `PUT /:id` : Modifie un produit

### Panier

Créer une application NodeJS pour le service panier nommé `cart` avec Typescript, Express et Mongoose.

Implémenter les routes sans gérer l'authentification, qui sera gérée par l'API Gateway :

- `GET /clients/:id` : Récupère le panier d'un utilisateur
- `PUT /clients/:id/products/:product_id` : Ajoute ou modifie un produit dans le panier d'un utilisateur. Crée le panier si besoin. Supprime le produit si quantité finale à 0.

### API Gateway

Créer une application NodeJS pour l'API Gateway nommé `api-gateway` avec Typescript, Express et Sequelize.

Implémenter les routes sans se préoccuper de l'authentification pour le moment :

- `GET` `/products` : redirection vers service `product`
- `POST` `/products` : redirection vers service `product`
- `PUT` `/products/:id` : redirection vers service `product`
- `GET` `/carts/clients/:id` : redirection vers service `cart`
- `PUT` `/carts/clients/:id/products/:product_id` : redirection vers service `cart`

### Authentification

Ajouter l'authentification à l'API Gateway.

- Implémenter la route `/auth` qui authentifie un utilisateur et renvoie un token JWT stockant le `userId` et le `roleId`.
- Créer un middleware qui vérifie le token JWT et ajoute les informations dans `req.currentUser`.
- Appliquer le middleware pour toutes les routes sauf `/auth`.

### RBAC

L'API Gateway est en charge de gérer le RBAC. Les règles d'accès sont les suivantes :

| Endpoint | Role | GET | POST | PUT | DELETE |
|----------|------|-----|------|-----|--------|
| /auth | public | | ✅ | | |
| /products | admin | ✅ | ✅ | ✅ | |
|  | user | ✅ | | | |
| /carts/clients/:id | admin | ✅ | | | |
|  | user | 👤 | | | |
| /carts/clients/:id/products/:product_id | admin | | | ✅ | |
|  | user | | | 👤 | |

✅ autorisé 👤 autorisé sur les données appartenant à l'utilisateur authentifié

#### Stocker les règles

Une table `matrix` stockera les règles d'accès comme ceci :

```sql
CREATE TABLE matrix (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL,
    route VARCHAR(255) NOT NULL,
    r VARCHAR(255) NOT NULL,
    w VARCHAR(255) NOT NULL,
    u VARCHAR(255) NOT NULL,
    d VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO 
    matrix (role_id, route, r, w, u, d) 
VALUES 
    (1, '^/products$', 'yes', 'yes', 'yes', 'no'),
    (1, '^/carts/clients/\d+$', 'yes', 'no', 'no', 'no'),
    (1, '^/carts/clients/\d+/products/\d+$', 'yes', 'yes', 'yes', 'yes'),
    (2, '^/carts/clients/\d+$', 'self', 'no', 'no', 'no'),
    (2, '^/carts/clients/\d+/products/\d+$', 'no', 'no', 'self', 'no');
```

#### Déterminer les droits

Une fonction `isAllowed` sera en charge de récupérer les règles dans la table `matrix` et de déterminer, en fonction de la route et du rôle, si l'utilisateur a le droit d'accéder à la ressource. En base de données, les routes sont des expressions régulière. La fonction retournera `yes`, `no` ou `self`.

#### Propager les informations aux services

`self` sera utilisé pour les routes panier, où l'utilisateur doit être le propriétaire pour y accéder. Le service `cart` sera en charge de déterminer si l'utilisateur est bien le propriétaire du panier.

Dans ce cas, il faudra faire transiter le `userId` dans le header de la requête faite par le proxy :

```js
const cartsProxy = createProxyMiddleware({
  target: SERVICES.CART,
  on: {
    proxyReq: (proxyReq: any, req: Request, res: Response) => {
      if ( res.locals.status === "self" ) {
        proxyReq.setHeader("x-user-id", req.currentUser!.userId.toString());
      }
    }
  }
});
```

Dernière étape, dans le service `cart`, si un `userId` est présent dans le `header`, vérifier que l'utilisateur est bien le propriétaire du panier avant d'exécuter l'action.

### Redis

#### Mise en cache

Ajouter un cache Redis pour stocker la matrice RBAC au niveau de l'API Gateway. Suivre le process suivant :

- Lire le cache
- Si les données **ne sont pas** présentes
  - Extraire les données de la table `matrix`
  - Stocker dans le cache
- Utiliser les données pour le RBAC

#### Publication de modification

Ajouter un système de publication via Redis lors de la modification d'un produit au niveau du service `product`.

Déclencher la publication **uniquement** quand le produit est modifié. Utiliser la clé `product:updated` pour la publication.

#### Abonnement

Ajouter un système d'abonnement via Redis lors de la modification d'un prix de produit pour mettre à jour les paniers au niveau du service `cart`.

---

⬅️ [Cas normal](./cas-normal.md)
