# Concepts principaux de l'architecture microservices

## Indépendance et isolation

Fonctionnement presque autonome, continue de fonctionner même si un autre service est en panne.

Exécution dans des runtimes isolés et potentiellement différents (docker, VMs, cloud providers). Archi distribuée.

## Single Responsibility Principle

## Stacks différentes

Langages, frameworks, bases de données...

## Point d'entrée unique

Masquer la complexité de l'architecture au client.

## Commuinications entre services

API REST, gRPC, GraphQL...

(async vu plus tard)

## Service discovery

Fonctionnement sans connaissance préalable des services, 2 types différents :

- Client-side : le client connaît les services et les interroge directement (annuaire)
- Server-side : le client interroge un service qui connaît les autres services (facteur)

## Vue d'ensemble

![Architecture microservices complète](./µservices-resilient.drawio.png)

---

⬅️ [Introduction](./introduction.md) - [Cas normal](./cas-normal.md) ➡️
