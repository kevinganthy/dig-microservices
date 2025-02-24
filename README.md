# Microservices

Architecture permettant de diviser une grosse application en plusieurs services plus petits et autonomes.

> Dans le même esprit qu'un refacto de code long et complexe en plusieurs fonctions plus petites et plus simples.

## Pourquoi ?

1. Améliorer la vitesse de mise en production de correctifs ou de nouvelles fonctionnalités
1. Augmenter la capacité d'évolution technologique ou fonctionnelle de l'application
1. Augmenter la fiabilité générale
1. Faciliter la maintenance ; chaque service est plus simple à comprendre et à maintenir, mais une application microservices est plus complexe à gérer dans son ensemble. Il faut un bon système de surveillance et de logs pour pouvoir identifier les problèmes.
1. Division du travail en équipes plus petites et autonomes ; attention à la synchronisation entre les équipes, il faut des interfaces claires et stables entre les services.

### Avantages

* Gestion de la complexité : décomposition en services plus petits et plus simples -> SRP et modulaire
* Flexibilité des technos : chaque service peut être écrit dans un langage ou une techno différente adaptée à son cas d'usage
* Déploiement indépendant : isolation des services -> déploiement plus rapide et moins risqué
* Résilience : tolérance aux pannes, isolation des services, redondance
* Evolutivité service par service, mise à l'échelle h/v, gain de performance potentiel...

### Inconvénients

* Complexité générale ; plus de services à gérer, plus de communication entre les services, plus de logs à centraliser...
* Communication réseau ; les interactions multiples peuvent surcharger le réseau et ralentir l'application
* Cohérence des données ; certaines données peuvent être dupliquées entre les services, il faut gérer la synchronisation
  * Exemple du mot de passe d'un utilisateur qui peut se trouver dans la bdd d'authentification et dans la bdd de clients
* Automatisation obligatoire ; monitoring, déploiements, tests, ... doivent être mis en place pour réduire la complexité
* Simplification du développement pure mais complexification de l'infrastructure
* Coût d'hébergement ; mutliplication de services à héberger, plus de ressources nécessaires

### Points d'attention

* Compétences DevOps obligatoires : "you build it, you run it"
* Plusieurs équipes de dev nécessaires, sinon il n'y a pas d'intérêt d'un tel découpage
* Compétences techniques variées nécessaires
* Charge supplémentaire en gestion humaine, planification et documentation
* Identifier et gérer les goulots d'étranglement (API Gateway, Authentification, ...)

## Découpage de l'architecture

> Exemple d'un e-commerce

### Services de base

* API Gateway : point d'entrée de l'application, routage des requêtes vers les services appropriés
* Maillage
  * Service discovery : permet de connaître les adresses des services à contacter pour la communication interne
    * Server side : Les services s'enregistrent auprès d'un serveur de découverte servant de routeur aux requêtes (équivalent d'un facteur)
    * Client side : Les services demandent où se trouve un autre service au SD pour ensuite envoyer lui même la requête (équivalent d'un annuaire)
  * Broker de messages : communication point à point asynchrone
  * Evénements : communication one-to-many asynchrone
* Surveillance : logs, CPU, mémoire, latence, ... pour chaque service et émission d'alertes en cas de problème

### Services métier

* Single responsibility principle : chaque service a une responsabilité unique
  * Authentification
  * RBAC
  * Clients
  * Produits
  * Panier
  * Commandes
  * Facturation
  * Paiements
  * Liste d'envies
  * Livraison
  * Recherche
  * Suggestions
  * ...
* Base**s** de données dédiées à chaque service en fonction du cas d'usage :
  * SQL (PostgreSQL, MySQL, SQLite, ...)
  * NoSQL (MongoDB, Cassandra, ...)
* Communication synchrone avec les autres services
  * Endpoints REST ou GraphQL
  * Webhooks
  * gRPC

## Architecture complète

![Architecture microservices complète](./docs/µservices.drawio.png)

### Goulot d'étranglement

L'API Gateway est un point unique de défaillance car toutes les requêtes clients passent par lui. Il est donc important de le rendre redondant et de le mettre à l'échelle en cas de surcharge.

* L'ajout d'un load balancer devant l'API Gateway permettra de distribuer la charge entre plusieurs instances.
* La mise en place d'un cache permettra de réduire la charge sur les services en aval et de répondre plus rapidement aux clients (donc d'en traiter plus).

Dans le cas d'un e-commerce, on peut imaginer que la majorité des requêtes sont faites par des clients connectés, donc les services d'authentification et RBAC seront très sollicités. Il faudra donc les mettre à l'échelle en conséquence.

### Cohérence des données

#### Mot de passe utilisateur

Par nature les informations client sont gérer par le service `clients` et sont stockées dans sa base de données dédiée `Users`.

Pour des questions de performances et d'isolation, les identifiants utilisateurs (email et pwd) sont dupliqués dans la bdd `credentials`, elle même liée au service d'authentification.

Dans le cas d'une modification de mot de passe par le client, il faut que cette information soit propagée au service d'authentification. Il s'agit ici d'une communication point à point. Elle n'a pas besoin d'être synchrone car l'utilisateur physique n'a pas besoin de voir le changement immédiatement. Elle doit cependant être fiable et garantie.

RabbitMQ est une des solutions possibles pour ce type de communication asynchrone. Il stocke les messages dans une file d'attente et les envoie au service destinataire dès qu'il est disponible, et les supprime qu'après une consommation validée.

#### Prix d'un produit

Par nature les informations produit sont gérées par le service `produits` et sont stockées dans sa base de données dédiée.

Les services `listes d'envies` et `panier` stockent des références vers les produits avec quelques informations supplémentaires dont le prix.

Dans le cas d'une modification du prix d'un produit par une administrateur, il faut que cette information soit propagée à plusieurs services. Il s'agit ici d'une communication one-to-many, un émetteur pour plusieurs récepteurs. Elle n'a pas besoin d'être synchrone car ce sont les clients qui ont besoin de cette information et non l'administrateur.

Kafka est une des solutions possibles et est préconisée pour ce type de communication asynchrone en publication/abonnement. Il est conçu pour gérer des flux de données à haut débit et à faible latence. Il stocke les messages dans des topics et les envoie à tous les services abonnés dès qu'ils sont disponibles.

#### Déclencheur externe

Les services externes de paiement (Stripe par exemple) utilisent des webhooks pour notifier de l'état d'une transaction.

Le service `paiement` est en charge de recevoir ces notifications puis de les transmettre au service `commandes` pour mettre à jour l'état de la commande. Ici il est préférable d'utiliser une communication synchrone afin de retourner un potentiel message d'erreur au service externe.

La communication pourrait utiliser un endpoint REST ou GraphQL. Le choix du protocole gRPC est également possible pour une communication plus rapide et plus fiable.

### Conclusion

Une architecture microservices dans les règles de l'art implique un grand nombre de points complexes, choisis en fonction des besoins de l'application et des contraintes techniques. Sa mise en place doit être réfléchie, planifiée et justifiée. Elle ne doit pas être utilisée comme un simple effet de mode ou pour résoudre des problèmes de performance ou de scalabilité qui n'existent pas.

Dans la vraie vie, elle est peu utilisée dans les petites structures ou pour des applications simples. Elle est plutôt réservée aux applications complexes, à fort trafic et à forte évolutivité comme les réseaux sociaux, les e-commerces, les banques, les assurances, les plateformes de streaming, ...

## Architecture simplifiée

![Architecture microservices simplifiée](./docs/µservices-simplified.drawio.png)

L'architecture appliqué epndant ce cours sera simplifiée, tout en gardant la logique et les principes fondamenteaux des microservices.

* L'`API Gateway` se chargera également de gérer l'authentification et le RBAC
* Les services métiers seront réduits à 2 :
  * `Produits`
  * `Paniers`
* `Redis` servira à la fois de cache et de service de communication asynchrone
* Le service discovery est supprimé et les addresses des services sont codées en dur dans l'API Gateway. `Produits` et `Panier` ne communiquent pas directement entre eux.
* Les données du panier seront stockées en `noSQL` avec une redondance des informations produits
* La mise en production ne sera pas vu, mais l'environnement de développement sera Dockerisé
* La surveillance des services n'est pas abordée
