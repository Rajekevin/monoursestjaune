---
title: "Docker expliqué simplement"
description: "Docker permet d'empaqueter une application avec toutes ses dépendances dans un conteneur portable et reproductible. Explication, analogie, diagramme et exemple de Dockerfile."
date: 2026-07-10
category: "Cloud & DevOps"
difficulty: "Intermédiaire"
tags: ["docker", "cloud", "devops", "ci-cd"]
summary: "Docker empaquette une application avec toutes ses dépendances dans un conteneur : un environnement isolé, portable et identique du poste du développeur à la production. Fini le \"ça marche sur ma machine\"."
bearMemory:
  - "Une **image** est un modèle figé (comme une classe) ; un **conteneur** est une instance en cours d'exécution de cette image (comme un objet)."
  - "Un conteneur n'est pas une machine virtuelle : il partage le noyau de l'OS hôte, ce qui le rend beaucoup plus léger et rapide à démarrer qu'une VM."
  - "Chaque instruction d'un Dockerfile crée une **couche (layer)** mise en cache : l'ordre des instructions impacte directement la vitesse des rebuilds."
interviewQuestions:
  - q: "Peux-tu m'expliquer Docker en une phrase ?"
    a: "Docker permet d'empaqueter une application avec toutes ses dépendances (bibliothèques, variables d'environnement, configuration système) dans une unité portable appelée conteneur, garantissant qu'elle s'exécute de façon identique sur n'importe quelle machine qui a Docker installé."
  - q: "Quelle est la différence entre un conteneur et une machine virtuelle ?"
    a: "Une VM virtualise le matériel et embarque son propre système d'exploitation complet, ce qui la rend lourde (plusieurs gigaoctets, démarrage en minutes). Un conteneur virtualise seulement l'espace utilisateur et partage le noyau de la machine hôte : il est beaucoup plus léger (quelques dizaines de mégaoctets), démarre en une seconde, mais offre une isolation moins forte qu'une VM."
  - q: "Quelle est la différence entre une image et un conteneur Docker ?"
    a: "Une image est un modèle en lecture seule, constitué de couches empilées, qui décrit le système de fichiers et la configuration d'une application. Un conteneur est une instance en cours d'exécution de cette image, avec une couche en écriture ajoutée par-dessus. On peut lancer plusieurs conteneurs identiques à partir d'une seule et même image, comme on instancie plusieurs objets à partir d'une même classe."
---

## Le problème

"Ça marche sur ma machine" est sans doute la phrase la plus redoutée en développement logiciel. Un développeur teste son application en local avec la version 18 de Node.js, une certaine version d'une bibliothèque système, une configuration précise — et tout fonctionne. Une fois déployée en production, sur une machine avec une version différente de Node.js ou une dépendance système manquante, l'application plante, ou pire, se comporte différemment sans erreur visible.

Avant les conteneurs, la solution consistait à documenter méticuleusement chaque dépendance et chaque étape d'installation — un processus fragile, jamais totalement à jour, et impossible à automatiser fiablement. Recréer un environnement identique en production, en CI, ou sur la machine d'un nouveau collègue, prenait des heures et échouait souvent sur un détail oublié.

## L'idée générale

Docker résout ce problème en empaquetant une application avec **tout ce dont elle a besoin pour fonctionner** — code, runtime, bibliothèques système, variables de configuration — dans une unité autonome appelée **conteneur**. Ce conteneur s'exécute de façon identique sur n'importe quelle machine dotée du moteur Docker, qu'il s'agisse du poste du développeur, d'un serveur CI ou d'une machine de production.

Deux concepts sont centraux :

- **L'image** : un modèle figé et versionné, construit à partir d'un fichier de description (`Dockerfile`), qui contient tout le système de fichiers nécessaire à l'application.
- **Le conteneur** : une instance en cours d'exécution de cette image, isolée du reste du système grâce aux fonctionnalités du noyau Linux (namespaces, cgroups).

Contrairement à une machine virtuelle, un conteneur ne virtualise pas de matériel ni de système d'exploitation complet : il partage le noyau de la machine hôte et n'isole que l'espace utilisateur. C'est ce qui le rend nettement plus léger et rapide à démarrer qu'une VM.

## Analogie du quotidien

Docker, c'est comme un conteneur de fret maritime. Avant la conteneurisation du transport, chaque cargaison (des sacs de café, des machines, des meubles) était chargée et déchargée manuellement, avec un arrimage différent selon le bateau, le camion ou le train utilisé — lent, coûteux, et source d'erreurs. Le conteneur standardisé a changé la donne : peu importe ce qu'il contient à l'intérieur, sa forme extérieure est toujours la même, et n'importe quel bateau, camion ou grue conçu pour manipuler des conteneurs sait le charger, le transporter et le décharger sans adaptation.

De la même façon, un conteneur Docker a une interface standard : peu importe ce qu'il y a à l'intérieur (une API Node.js, un service Python, une base de données), n'importe quelle machine avec Docker installé sait l'exécuter de la même manière.

## Diagramme

{{< mermaid >}}
flowchart TD
    subgraph Hote["Machine hôte (un seul OS, un seul noyau)"]
        Docker[Moteur Docker]
        subgraph C1["Conteneur API"]
            App1[Code + dépendances Node.js]
        end
        subgraph C2["Conteneur Base de données"]
            App2[PostgreSQL + config]
        end
        subgraph C3["Conteneur Worker"]
            App3[Script Python + libs]
        end
        Docker --> C1
        Docker --> C2
        Docker --> C3
    end

    Image[(Image Docker versionnée)] -->|docker run| C1
{{< /mermaid >}}

## Exemple de code

```dockerfile
# Dockerfile — image d'une API Node.js

# Étape 1 : build, avec toutes les dépendances de développement
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : image finale, allégée, sans les outils de build
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
USER node

CMD ["node", "dist/index.js"]
```

```bash
# Construire l'image, puis lancer un conteneur à partir de celle-ci
docker build -t mon-api:1.0 .
docker run -d -p 3000:3000 --name mon-api-container mon-api:1.0

# Inspecter les logs du conteneur en cours d'exécution
docker logs -f mon-api-container
```

```yaml
# docker-compose.yml — orchestrer l'API et sa base de données ensemble
version: "3.9"
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

## Quand utiliser Docker ?

- Pour garantir qu'une application se comporte de façon identique entre le poste du développeur, l'environnement de CI et la production.
- Pour isoler les dépendances de plusieurs services qui tournent sur la même machine, sans conflit de versions.
- Comme brique de base avant d'aller vers l'orchestration (Kubernetes) quand une application est composée de plusieurs services à faire coopérer.
- Moins pertinent pour une application monolithique simple sans contrainte de portabilité, où la charge d'apprentissage et de maintenance des images peut ne pas se justifier immédiatement — même si l'usage s'est largement généralisé, y compris pour de petits projets.

## Points importants

- Chaque instruction du Dockerfile crée une couche mise en cache : placer les instructions qui changent le moins souvent (installation des dépendances) avant celles qui changent souvent (copie du code source) accélère nettement les rebuilds.
- Un build multi-étapes (`multi-stage build`, comme dans l'exemple ci-dessus) permet de garder l'image finale légère en excluant les outils utilisés uniquement pendant la compilation.
- Un conteneur est éphémère par nature : toute donnée écrite à l'intérieur disparaît à sa suppression, sauf si elle est stockée dans un volume monté depuis l'extérieur.
- Docker seul suffit pour un service unique ; dès que plusieurs conteneurs doivent être orchestrés, redémarrés automatiquement ou répartis sur plusieurs machines, c'est le rôle de Kubernetes ou d'un orchestrateur équivalent.
