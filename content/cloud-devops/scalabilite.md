---
title: "Scalabilité"
description: "La scalabilité, c'est la capacité d'un système à absorber une charge croissante. Scalabilité horizontale vs verticale, stateless vs stateful, et load balancing expliqués simplement."
date: 2026-07-10
category: "Cloud & DevOps"
difficulty: "Avancé"
tags: ["scalabilite", "cloud", "kubernetes", "infrastructure-as-code"]
summary: "La scalabilité est la capacité d'un système à absorber une charge croissante sans dégrader ses performances. Elle se joue sur deux axes — vertical et horizontal — et repose sur un principe clé : rendre les services sans état pour pouvoir en multiplier les instances."
bearMemory:
  - "Scalabilité verticale = une machine plus grosse (limite physique atteinte vite). Scalabilité horizontale = plus de machines identiques (théoriquement sans limite, mais demande un système **stateless**)."
  - "Un service **stateless** ne conserve aucune donnée de session en mémoire locale : n'importe quelle instance peut traiter n'importe quelle requête, ce qui rend la scalabilité horizontale possible."
  - "Le load balancer répartit le trafic entre les instances **et** doit surveiller leur santé : envoyer du trafic vers une instance en panne aggrave l'incident au lieu de le contourner."
interviewQuestions:
  - q: "Quelle différence entre scalabilité horizontale et scalabilité verticale ?"
    a: "La scalabilité verticale (scale up) consiste à augmenter la puissance d'une seule machine — plus de CPU, plus de RAM. C'est simple à mettre en place mais limité par le matériel disponible, et représente un point de défaillance unique. La scalabilité horizontale (scale out) consiste à ajouter davantage de machines identiques qui se partagent la charge. Elle n'a théoriquement pas de plafond et améliore la résilience, mais exige que l'application soit conçue pour tourner en plusieurs instances simultanées, notamment en étant stateless."
  - q: "Pourquoi le caractère stateless d'un service est-il si important pour la scalabilité horizontale ?"
    a: "Parce que si une instance stocke des données de session en mémoire locale (l'utilisateur X est connecté sur cette instance précise), le load balancer doit alors systématiquement router cet utilisateur vers la même instance, ce qui limite la répartition de charge et complique la gestion des pannes. Un service stateless externalise cet état (dans une base de données, un cache partagé comme Redis, ou un JWT côté client), ce qui permet à n'importe quelle instance de traiter n'importe quelle requête indifféremment — condition nécessaire à une scalabilité horizontale efficace."
  - q: "Comment optimiser une API pour qu'elle scale bien ?"
    a: "Plusieurs leviers complémentaires : rendre l'API stateless pour permettre la scalabilité horizontale, mettre en cache les données lues fréquemment et peu modifiées (avec Redis par exemple), utiliser un load balancer avec des health checks pour répartir le trafic entre instances saines, identifier et faire évoluer séparément le composant qui devient le goulot d'étranglement (souvent la base de données, via réplication en lecture ou sharding), et surveiller les métriques de charge pour scaler automatiquement avant la saturation plutôt qu'après."
---

## Le problème

Une application qui fonctionne parfaitement avec 100 utilisateurs simultanés peut s'effondrer à 10 000, non pas parce que le code est mal écrit, mais parce qu'aucun système n'absorbe une charge infinie avec des ressources fixes. La question n'est jamais "est-ce que ça va tenir la charge ?" mais "jusqu'à quel point, et que se passe-t-il ensuite ?"

Le piège classique est de répondre à ce problème en achetant une machine toujours plus grosse, jusqu'à atteindre une limite physique et budgétaire — le plus gros serveur du marché a un plafond, et il coûte de plus en plus cher à mesure qu'on s'en approche. L'autre piège est de multiplier les instances d'une application qui n'a pas été conçue pour ça, découvrant après coup que deux instances se marchent dessus parce qu'elles stockent chacune un état local incompatible avec l'autre.

## L'idée générale

La scalabilité est la capacité d'un système à absorber une charge croissante en ajoutant des ressources, sans dégradation disproportionnée des performances. Elle se joue sur deux axes :

- **Scalabilité verticale (scale up)** : augmenter la puissance d'une seule machine (plus de CPU, plus de RAM). Simple, mais plafonnée par le matériel disponible, et l'ensemble du système repose toujours sur un point de défaillance unique.
- **Scalabilité horizontale (scale out)** : ajouter davantage de machines identiques qui se partagent la charge, généralement derrière un **load balancer** qui répartit les requêtes entre elles. Cette approche est en théorie sans plafond, et améliore aussi la résilience (la panne d'une instance n'arrête pas le service), mais elle exige une contrainte de conception forte : l'application doit être **stateless**.

Un service **stateless** ne conserve aucune donnée propre à un utilisateur en mémoire locale entre deux requêtes — cet état est externalisé dans une base de données partagée, un cache distribué (Redis), ou transporté par le client lui-même (JWT). C'est cette externalisation qui permet à n'importe quelle instance de traiter n'importe quelle requête, condition indispensable pour répartir efficacement la charge. À l'inverse, un service **stateful** (une base de données, par exemple) ne peut pas être dupliqué aussi simplement : il exige des mécanismes spécifiques (réplication, sharding) pour scaler horizontalement sans perdre la cohérence des données.

## Analogie du quotidien

La scalabilité, c'est comme gérer l'affluence dans un restaurant. La scalabilité verticale, c'est agrandir la cuisine et embaucher un chef encore plus rapide — efficace jusqu'à un certain point, mais une seule cuisine reste une seule cuisine, avec un plafond physique de plats qu'elle peut produire par heure. La scalabilité horizontale, c'est ouvrir plusieurs restaurants identiques en ville, avec un système de réservation central qui répartit les clients vers le restaurant le moins occupé — ce système de réservation, c'est le load balancer.

Pour que ça fonctionne, chaque restaurant doit pouvoir servir n'importe quel client de la même façon, sans dépendre d'un souvenir propre à un restaurant précis ("le serveur du restaurant 2 se souvient de votre commande habituelle, mais pas ceux des autres restaurants") — c'est l'équivalent du *stateless* : aucune information critique ne doit être coincée dans un seul endroit pour que le système fonctionne.

## Diagramme

{{< mermaid >}}
flowchart TD
    Client[Client] --> LB[Load Balancer]
    LB -->|health check OK| I1[Instance API 1 — stateless]
    LB -->|health check OK| I2[Instance API 2 — stateless]
    LB -.health check échoué, exclue du routage.-> I3[Instance API 3 — en panne]

    I1 --> Cache[(Cache partagé Redis)]
    I2 --> Cache
    I1 --> DB[(Base de données)]
    I2 --> DB

    DB --> Replica[(Réplique en lecture)]
{{< /mermaid >}}

## Exemple de code

```yaml
# hpa.yaml — Horizontal Pod Autoscaler Kubernetes :
# scale horizontal automatique selon la charge CPU
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mon-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: mon-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 65
```

```javascript
// Exemple d'API stateless : aucun état de session en mémoire locale.
// L'état utilisateur vit dans le token, pas dans le processus.
app.get("/api/panier", authenticateJWT, async (req, res) => {
  // req.user vient du JWT décodé, pas d'une session stockée localement
  const panier = await redisClient.get(`panier:${req.user.id}`);
  res.json(JSON.parse(panier ?? "[]"));
});

// N'importe quelle instance de cette API peut traiter cette requête :
// rien n'est stocké en mémoire locale du processus Node.js.
```

## Quand se soucier de scalabilité ?

- Dès la conception d'un service destiné à grandir : rendre une API stateless dès le départ coûte peu, alors que retirer un état local accumulé après coup demande souvent une réécriture douloureuse.
- Quand le trafic devient imprévisible ou saisonnier : la scalabilité horizontale automatique absorbe les pics sans surdimensionner en permanence.
- La scalabilité verticale reste une solution valable et plus simple pour des charges modérées et prévisibles, ou comme premier palier avant d'investir dans une architecture horizontale plus complexe.
- Pour une base de données, la question se pose différemment : la scalabilité horizontale (sharding, réplication) est nettement plus complexe à mettre en œuvre que pour un service stateless, et n'est justifiée que lorsque la scalabilité verticale atteint clairement ses limites.

## Points importants

- Scaler horizontalement un composant stateful sans réflexion (une base de données, par exemple) peut introduire des incohérences de données bien plus graves que le problème de performance qu'on cherchait à résoudre.
- Le goulot d'étranglement d'un système se déplace : scaler l'API ne sert à rien si la base de données derrière elle sature avant — la scalabilité se pense pour l'ensemble de la chaîne, pas composant par composant isolément.
- Un load balancer doit inclure des *health checks* : router du trafic vers une instance déjà en panne aggrave l'incident au lieu de le contourner.
- La mise en cache (Redis, CDN) est souvent le levier de scalabilité le plus rentable : elle réduit la charge réelle sur les composants les plus coûteux à scaler, avant même de devoir ajouter des instances supplémentaires.
