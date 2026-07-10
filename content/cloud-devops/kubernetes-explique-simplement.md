---
title: "Kubernetes expliqué simplement"
description: "Kubernetes orchestre des conteneurs à grande échelle : il les déploie, les surveille, les redémarre et les répartit automatiquement. Explication, analogie, diagramme et manifeste YAML."
date: 2026-07-10
category: "Cloud & DevOps"
difficulty: "Avancé"
tags: ["kubernetes", "docker", "cloud", "scalabilite"]
summary: "Kubernetes est un orchestrateur de conteneurs : il décide où et comment exécuter des conteneurs Docker sur un ensemble de machines, les redémarre automatiquement en cas de panne, et ajuste leur nombre selon la charge."
bearMemory:
  - "Docker fait tourner un conteneur ; Kubernetes décide **où**, **combien** et **quand** faire tourner des conteneurs sur un cluster de machines, sans intervention humaine."
  - "L'unité de base de Kubernetes n'est pas le conteneur mais le **Pod** — un ou plusieurs conteneurs qui partagent le même réseau et le même cycle de vie."
  - "Kubernetes fonctionne en **boucle de réconciliation** : vous déclarez l'état désiré (3 réplicas), et le contrôleur agit en continu pour que l'état réel corresponde à cet état désiré."
interviewQuestions:
  - q: "Pourquoi a-t-on besoin de Kubernetes si on a déjà Docker ?"
    a: "Docker sait faire tourner un conteneur sur une machine, mais ne répond pas aux questions qui se posent à l'échelle d'une production réelle : que se passe-t-il si le conteneur crashe ? Comment répartir la charge entre plusieurs instances ? Comment déployer sur plusieurs machines sans SSH manuel ? Comment faire un rolling update sans coupure de service ? Kubernetes répond à ces questions en orchestrant automatiquement des conteneurs sur un cluster de machines, avec auto-guérison, scaling et déploiements progressifs."
  - q: "Quelle est la différence entre un Pod, un Deployment et un Service dans Kubernetes ?"
    a: "Le Pod est l'unité d'exécution la plus petite, un ou plusieurs conteneurs qui partagent le même réseau. Le Deployment décrit l'état désiré d'un ensemble de Pods identiques (combien de réplicas, quelle image) et gère leur cycle de vie, y compris les mises à jour progressives. Le Service donne une adresse réseau stable pour accéder à un ensemble de Pods, qui eux sont éphémères et changent d'adresse IP à chaque redémarrage."
  - q: "Comment Kubernetes gère-t-il la panne d'un conteneur ?"
    a: "Kubernetes surveille en continu l'état réel du cluster via des probes de santé (liveness et readiness). Si un Pod ne répond plus ou crashe, le contrôleur du Deployment le détecte et en recrée automatiquement un nouveau pour respecter le nombre de réplicas déclaré dans l'état désiré — c'est la boucle de réconciliation, le mécanisme central de Kubernetes."
---

## Le problème

Docker résout le problème de la portabilité d'une application : empaqueter un conteneur et le faire tourner de façon identique n'importe où. Mais en production réelle, une seule instance d'un conteneur sur une seule machine ne suffit presque jamais. Il faut plusieurs instances pour absorber la charge, réparties sur plusieurs machines pour survivre à la panne d'un serveur, avec un mécanisme pour rediriger le trafic vers les instances en bonne santé.

Gérer ça manuellement devient vite intenable : lancer des conteneurs à la main sur chaque machine, surveiller lesquels sont tombés, les relancer, ajuster leur nombre selon le trafic, déployer une nouvelle version sans interrompre le service — tout cela demande une automatisation que Docker seul ne fournit pas. C'est exactement le rôle de Kubernetes.

## L'idée générale

Kubernetes est un **orchestrateur de conteneurs** : un système qui gère l'exécution de conteneurs sur un ensemble de machines (un *cluster*), en automatisant leur déploiement, leur mise à l'échelle et leur résilience.

Le concept central est la **boucle de réconciliation** : vous décrivez l'état désiré du système (par exemple, "je veux 3 instances de mon API, avec cette image Docker"), et Kubernetes travaille en continu pour que l'état réel du cluster corresponde à cet état désiré — en recréant un Pod qui crashe, en répartissant la charge, en déplaçant des workloads d'une machine en panne vers une machine saine.

Quelques objets clés composent ce modèle :

- **Pod** : l'unité d'exécution la plus petite, un ou plusieurs conteneurs partageant réseau et stockage.
- **Deployment** : décrit combien de réplicas d'un Pod doivent tourner, et gère les mises à jour progressives (*rolling updates*).
- **Service** : une adresse réseau stable pour accéder à un ensemble de Pods, qui eux sont éphémères et changent d'IP à chaque redémarrage.
- **Node** : une machine (physique ou virtuelle) du cluster, sur laquelle des Pods sont planifiés.

## Analogie du quotidien

Kubernetes, c'est comme le régulateur d'une flotte de taxis dans une grande ville. Chaque taxi (un Pod) part du dépôt et roule en autonomie, mais le régulateur central décide combien de taxis doivent être en service selon l'heure de la journée, redirige immédiatement un client vers un autre taxi si le sien tombe en panne, et envoie automatiquement un taxi de remplacement pour maintenir le nombre de véhicules actifs prévu.

Le client (une requête utilisateur) n'appelle jamais un taxi précis par son numéro de plaque : il appelle un numéro central (le Service) qui le met en relation avec n'importe quel taxi disponible. Peu importe lequel des taxis répond, tant que le service est assuré.

## Diagramme

{{< mermaid >}}
flowchart TD
    Client[Client / Utilisateur] --> Svc[Service : adresse stable]
    Svc --> P1[Pod 1 : conteneur API]
    Svc --> P2[Pod 2 : conteneur API]
    Svc --> P3[Pod 3 : conteneur API]

    Dep[Deployment : état désiré = 3 réplicas] -.surveille et recrée.-> P1
    Dep -.surveille et recrée.-> P2
    Dep -.surveille et recrée.-> P3

    subgraph Node1["Node A"]
        P1
        P2
    end
    subgraph Node2["Node B"]
        P3
    end

    P2 x--x Panne[Pod tombe en panne]
    Panne -.détecté par la boucle de réconciliation.-> Dep
{{< /mermaid >}}

## Exemple de code

```yaml
# deployment.yaml — décrit l'état désiré : 3 réplicas de l'API
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-api
  labels:
    app: mon-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mon-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    metadata:
      labels:
        app: mon-api
    spec:
      containers:
        - name: api
          image: monregistre/mon-api:1.4.0
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 15
---
# service.yaml — une adresse réseau stable vers les Pods du Deployment
apiVersion: v1
kind: Service
metadata:
  name: mon-api-service
spec:
  selector:
    app: mon-api
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

```bash
# Appliquer la configuration déclarative au cluster
kubectl apply -f deployment.yaml -f service.yaml

# Observer la boucle de réconciliation en action
kubectl get pods --watch
kubectl scale deployment mon-api --replicas=5
```

## Quand utiliser Kubernetes ?

- Quand une application est composée de plusieurs services conteneurisés qui doivent être déployés, mis à l'échelle et surveillés ensemble.
- Quand la disponibilité est critique et qu'il faut une résilience automatique aux pannes de conteneurs ou de machines.
- Quand les déploiements doivent se faire sans interruption de service (rolling updates, rollback automatique en cas d'échec).
- À éviter pour une application simple à un seul service avec un trafic stable et prévisible : la complexité opérationnelle de Kubernetes (cluster à maintenir, courbe d'apprentissage) dépasse largement le bénéfice tant qu'un simple PaaS ou quelques conteneurs Docker suffisent.

## Points importants

- Kubernetes ne remplace pas Docker : il orchestre des conteneurs, que ceux-ci soient construits avec Docker ou un autre moteur compatible (containerd, par exemple).
- Le nombre de Pods n'est pas fixe : le Horizontal Pod Autoscaler peut ajuster automatiquement le nombre de réplicas selon des métriques comme l'utilisation CPU.
- Les Pods sont éphémères et interchangeables par nature : aucune donnée persistante ne doit dépendre d'un Pod précis, d'où l'usage de volumes externes (PersistentVolume) pour tout état à conserver.
- Les fournisseurs cloud proposent des offres Kubernetes managées (EKS sur AWS, GKE sur Google Cloud, AKS sur Azure) qui déchargent l'équipe de la gestion du plan de contrôle, réduisant une bonne partie de la complexité opérationnelle initiale.
