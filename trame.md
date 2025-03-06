# Proposition de trame

Basée sur le code présent dans ce repo. Le thème de l'application peut être modifié sans problème.

## Jour 1 : Introduction et Produit

**Objectifs** : Comprendre ce qu'est une architecture microservices dans les grandes lignes et réaliser un premier service métier.

* Théorie sur les microservices suivant le détail présenté dans [introduction.md](./docs/introduction.md), ne pas trop détailler le schéma, il donne une vue d'ensemble pour le moment.
* Remise en jambe sur les bases de NodeJS et Express sans Typescript.
* Connexion à PostgreSQL avec Sequelize (déjà maîtrisé, servira de révision et de comparaison avec Prisma vu plus tard).
* Mise en avant des avantages des microservices :
  * Pouvoir utiliser des technos différentes pour chaque service
  * Pas d'authentification à gérer pour le moment
  * SRP
* Appuyer sur le build de l'image docker nécessaire à chaque fois que package.json est modifié.
* Finir sur la présentation de la version pédagogique et simplifiée, comme présentée dans [cas-simplifie.md](./docs/cas-simplifie.md).

**Challenge** : Implémenter les routes du service produit (`GET /`, `POST /`, `PUT /:id`) et le faire fonctionner avec docker compose.

## Jour 2 : Panier

**Objectifs** : Découvrir Typescript et réaliser un second service métier isolé.

* Correction du service product.
* Introduction à Typescript et ses avantages. Découverte des types simples et de la configuration d'un projet node avec Typescript.
* (Re?)Découverte de Mongoose pour se connecter à MongoDB.
* Mise en avant des avantages des microservices :
  * La base de données est adaptée au service (données préparées, performance, indépendance du service produit)
  * Stack différente de produit, aucun impact dans le projet global

**Challenge** : Implémenter les routes du service panier (`GET /clients/:id`, `PUT /clients/:id/products/:product_id`) et l'intégrer dans le compose.

> Le passage du `client_id` est important car d'après le cahier des charges, un utilisateur ne pourra voir que son panier, mais un admin pourra voir le panier de n'importe quel utilisateur. Ce filtrage sera implémenté plus tard.

## Jour 3 : Gateway

**Objectifs** : Comprendre le rôle de l'API Gateway et réaliser un point d'entrée pour les services.

* Correction du service cart.
* Aborder graduellement les différents concepts et parties importantes de l'architecture, pour finir par la vue d'ensemble comme présentée dans [concetps.md](./docs/concepts.md).
* Découverte des proxies pour rediriger les requêtes vers les services appropriés.
* Utilisation plus avancée de Typescript avec l'implémentation des proxies.
* Suppression de l'exposition des ports des services produits et panier, toutes les requêtes client passeront par l'API Gateway.
* Ouverture théorique au déploiement avec les images docker et une orchestration docker swarm.

> Un retour sur le cas normal sera fait en fin de saison pour remettre à plat les connaissances et faire les liens entre la pratique vue sur les 2 semaines et la théorie vue le premier jour.

**Challenge** : Implémenter les routes de l'API Gateway hors authentification et l'intégrer dans le compose.

## Jour 4 : Authentification

**Objectifs** : Se remémorer l'authentification JWT et découvrir Prisma.

* Correction détaillée de l'API Gateway.
* Introduction à Prisma et ses avantages par rapport à Sequelize, notamment à cause de TS.
  * :warning: Impact sur le Dockerfile
* Mise en place d'une démo de l'ORM pour lire des données.
* Utilisation des interfaces avec TS pour créer des services aux modèles afin de respecter le principe d'inversion de dépendance.
* Rappel sur la façon officielle de gérer l'authentification avec un service dédié, même si nous nous servirons de l'API Gateway pour simplifier l'apprentissage.

**Challenge** : Implémenter une route d'authentification et un middleware de validation pour les autres routes dans l'API Gateway.

## Jour 5

Journée asynchrone.

## Jour 6 : RBAC

**Objectifs** : Découvrir une façon de gérer les permissions d'une application avec des rôles.

* Correction de l'authentification.
* Présenter les avantages et inconvénients d'une matrice de permissions.
  * Détailler la structure de la table contenant la matrice.
* (Re?)Découverte des Regex et explication de leur utilisation pour les routes.
  * Démo de regex101 pour tester les expressions.
  * Démo de test de regex dans le code en fonction de l'url demandée.
* Expliquer comment transférer des informations aux autres services via les headers dans les proxies (userid pour filtrage du panier).
* Même rappel que pour l'auth, l'API Gateway gérera les permissions pour simplifier.

**Challenge** : Implémenter un middleware pour les permissions dans l'API Gateway. Gérer l'autorisation aussi au niveau du service panier en fonction du user et de son rôle.

## Jour 7 : Mise en cache

**Objectifs** : Comprendre la mise en cache.

* Correction détaillée du RBAC. Prendre le temps de tester tous les cas de figure.
* Théorie sur les goulots d'étranglements, résilience et tolérance aux pannes de cette architecture [(cas-normal.md)](./docs/cas-normal.md).
* Mise en cache
  * Avantages et inconvénients, cas d'usages...
  * Introduction à Redis
  * Démonstration de son utilisation et du stockage clé/valeur

**Challenge** : Mettre en cache la matrice de permissions dans l'API Gateway.

## Jour 8 : Communication asynchrone

**Objectifs** : Comprendre la communication inter-service et l'application d'une communication asynchrone.

* Correction de la mise en cache.
* Théorie sur la cohérence des données entre les bdd.
* Introduction à la communication asynchrone
  * Sync vs Async
  * Avantages et inconvénients, cas d'usages...
  * Différence entre point à point et one-to-many
  * Citer les solutions adaptées (RabbitMQ, Kafka) mais préciser qu'on utilisera Redis dans notre cas, bien qu'il ne soit pas aussi efficace.
  * Démonstration de publish et subscribe avec Redis.
* Retour sur le schéma d'architecture complet pour finaliser la saison.

**Challenge** : Ajouter un système de publication via Redis lors de la modification d'un produit au niveau du service produit et de souscription au niveau du service panier pour mettre à jour les prix.

## Jour 9 Secu

**Objectifs** : Comprendre la sécurisation et la surveillance d'une architecture microservices.

* Correction
* Sécurité
  * Vulnérabilités
  * Sécurisation des communications : CORS
  * ...
* Ouverture théorique à la surveillance et au monitoring

**Challenge Pair-prog l'après-midi** : Créer le service `Liste d'envies` qui a une spécification proche de celle du panier.

## Jour 10

Journée asynchrone.
