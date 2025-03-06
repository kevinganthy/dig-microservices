# Architecture complète

![Architecture microservices complète](./µservices-resilient.drawio.png)

## Goulot d'étranglement

L'API Gateway est un point de défaillance car il **reçoit toutes les requêtes clients**. Il est donc important de le rendre **redondant** et de le **mettre à l'échelle** en cas de surcharge.

* L'ajout d'un **load balancer** devant l'API Gateway permettra de **distribuer la charge** entre plusieurs instances.
* La mise en place d'un **cache** permettra de réduire la charge sur les services en aval et de répondre plus rapidement aux clients (donc d'en traiter plus).

Dans le cas d'un e-commerce, on peut imaginer que la majorité des requêtes sont faites par des clients connectés, donc les services d'authentification et RBAC seront très sollicités. Il faudra également les mettre à l'échelle en conséquence.

## Cohérence des données

### Mot de passe utilisateur

Par nature les informations client sont gérer par le service `clients` et sont stockées dans sa base de données dédiée `Users`.

Pour des questions de performances et d'isolation, les identifiants utilisateurs (email et pwd) sont dupliqués dans la bdd `credentials`, elle même liée au service d'authentification.

Dans le cas d'une modification de mot de passe par le client, il faut que **cette information soit propagée** au service d'authentification. Il s'agit ici d'une **communication point à point**. Elle n'a pas besoin d'être synchrone car l'utilisateur physique n'a pas besoin de voir le changement immédiatement. Elle doit cependant être fiable et garantie.

RabbitMQ est une des solutions possibles pour ce type de **communication asynchrone**. Il stocke les messages dans une file d'attente et les envoie au service destinataire dès qu'il est disponible, et les supprime qu'après une consommation validée.

### Prix d'un produit

Par nature les informations produit sont gérées par le service `produits` et sont stockées dans sa base de données dédiée.

Les services `listes d'envies` et `panier` stockent des références vers les produits avec quelques informations supplémentaires dont le prix.

Dans le cas d'une modification du prix d'un produit par une administrateur, il faut que cette information soit **propagée à plusieurs services**. Il s'agit ici d'une **communication one-to-many**, un émetteur pour plusieurs récepteurs. Elle n'a pas besoin d'être synchrone car ce sont les clients qui ont besoin de cette information et non l'administrateur.

Kafka est une des solutions possibles et est préconisée pour ce type de **communication asynchrone en publication/abonnement**. Il est conçu pour gérer des flux de données à haut débit et à faible latence. Il stocke les messages dans des topics et les envoie à tous les services abonnés dès qu'ils sont disponibles.

### Déclencheur externe

Les services externes de paiement (Stripe par exemple) utilisent des webhooks pour notifier de l'état d'une transaction.

Le service `paiement` est en charge de **recevoir** ces notifications puis de les **transmettre** au service `commandes` pour mettre à jour l'état de la commande. Ici il est préférable d'utiliser une **communication synchrone** afin de retourner un **potentiel message d'erreur** au service externe.

La communication pourrait utiliser un endpoint REST ou GraphQL. Le choix du protocole **gRPC** est également possible pour une communication plus rapide et plus fiable.

## Conclusion

Une architecture microservices dans les règles de l'art implique un grand nombre de points complexes, choisis en fonction des besoins de l'application et des contraintes techniques. Sa mise en place doit être réfléchie, planifiée et justifiée. Elle ne doit pas être utilisée comme un simple effet de mode ou pour résoudre des problèmes de performance ou de scalabilité qui n'existent pas.

Dans la vraie vie, elle est peu utilisée dans les petites structures ou pour des applications simples. Elle est plutôt réservée aux applications complexes, à fort trafic et à forte évolutivité comme les réseaux sociaux, les e-commerces, les banques, les assurances, les plateformes de streaming, ...

---

⬅️ [Concepts](./concepts.md) - [Architecture simplifiée](./cas-simplifie.md) ➡️
