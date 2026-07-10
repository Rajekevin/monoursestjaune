---
title: "CI/CD"
description: "L'intégration continue et le déploiement continu automatisent les tests, la validation et la mise en production du code à chaque changement. Explication, analogie, diagramme et pipeline GitHub Actions."
date: 2026-07-10
category: "Cloud & DevOps"
difficulty: "Intermédiaire"
tags: ["ci-cd", "devops", "docker", "cloud"]
summary: "CI/CD désigne l'automatisation du chemin entre un commit de code et sa mise en production : compilation, tests, validation, puis déploiement, exécutés automatiquement à chaque changement plutôt qu'à la main."
bearMemory:
  - "Intégration continue (CI) = automatiser build + tests à chaque commit. Déploiement continu (CD) = automatiser aussi la mise en production, sans intervention humaine."
  - "**Livraison continue** (continuous delivery) diffère du **déploiement continu** (continuous deployment) par une seule étape : une validation manuelle avant la mise en production, ou son absence totale."
  - "Un pipeline CI/CD doit échouer vite et clairement (*fail fast*) : plus une erreur est détectée tôt dans le pipeline, moins elle coûte cher à corriger."
interviewQuestions:
  - q: "Quelle différence entre intégration continue, livraison continue et déploiement continu ?"
    a: "L'intégration continue (CI) automatise la compilation et les tests à chaque commit poussé, pour détecter les régressions au plus tôt. La livraison continue (continuous delivery) va plus loin : le code est automatiquement préparé pour être déployé en production, mais la mise en ligne elle-même reste déclenchée manuellement. Le déploiement continu (continuous deployment) automatise cette dernière étape aussi : chaque commit qui passe les tests est déployé en production sans intervention humaine."
  - q: "Pourquoi l'intégration continue est-elle importante en équipe ?"
    a: "Parce qu'elle détecte les conflits et les régressions immédiatement après un commit, plutôt que des jours ou des semaines plus tard quand plusieurs branches divergentes doivent être fusionnées. Plus l'intervalle entre l'écriture du code et la détection d'un problème est court, moins la correction coûte cher — un bug détecté en CI se corrige en minutes, le même bug détecté en production peut coûter des heures d'investigation et impacter des utilisateurs réels."
  - q: "Comment sécuriser un pipeline de déploiement continu pour éviter de casser la production ?"
    a: "Plusieurs mécanismes se combinent : une suite de tests automatisés suffisamment complète pour attraper les régressions avant le déploiement, des déploiements progressifs (canary release, blue-green deployment) qui limitent l'impact d'un problème à une fraction du trafic, des health checks automatiques après déploiement, et un rollback automatique si les métriques se dégradent. L'objectif est de rendre l'échec d'un déploiement rare et surtout peu coûteux à corriger."
---

## Le problème

Sans automatisation, mettre du code en production suit un rituel manuel et fragile : un développeur récupère les changements, lance les tests à la main (ou les oublie), compile le projet, se connecte au serveur et copie les fichiers, redémarre le service, et croise les doigts. Chaque étape oubliée ou mal exécutée est une source potentielle de bug en production. Et plus l'équipe grandit, plus ce rituel devient un goulot d'étranglement : une seule personne qui sait "comment on déploie" devient un point de défaillance critique.

Le second problème est la détection tardive des régressions. Si les tests ne sont exécutés qu'une fois par semaine, ou seulement avant une mise en production, un bug introduit le lundi peut n'être découvert que le vendredi — après avoir été mélangé au travail de plusieurs autres développeurs, rendant sa cause beaucoup plus difficile à isoler.

## L'idée générale

CI/CD désigne l'automatisation du chemin entre l'écriture du code et sa mise en production, découpée en plusieurs pratiques complémentaires :

- **Continuous Integration (intégration continue)** : à chaque commit poussé, un pipeline automatisé compile le projet et exécute les tests. L'objectif est de détecter une régression immédiatement, pas plus tard.
- **Continuous Delivery (livraison continue)** : le pipeline va plus loin et prépare automatiquement un artefact prêt à être déployé (image Docker, package versionné), mais le déclenchement final vers la production reste une décision humaine.
- **Continuous Deployment (déploiement continu)** : dernière étape de l'automatisation — chaque changement qui passe l'intégralité du pipeline est déployé en production sans validation manuelle.

Un pipeline CI/CD typique enchaîne plusieurs étapes séquentielles : récupération du code, installation des dépendances, analyse statique (linting), tests unitaires, tests d'intégration, build de l'artefact, puis déploiement. Chaque étape doit pouvoir faire échouer le pipeline pour empêcher qu'un code défaillant progresse plus loin dans la chaîne.

## Analogie du quotidien

Le CI/CD, c'est comme une chaîne de contrôle qualité dans une usine automobile. Sans contrôle continu, on assemble toutes les pièces d'une voiture et on ne teste qu'à la toute fin, en espérant que tout fonctionne — si un défaut est détecté sur le moteur, il faut potentiellement démonter toute la carrosserie déjà assemblée pour y accéder, un coût énorme.

Avec un contrôle qualité continu, chaque pièce est vérifiée dès qu'elle est montée : le moteur est testé avant que la carrosserie ne soit posée dessus, les freins sont vérifiés avant que les roues ne soient recouvertes. Un défaut est détecté au plus tôt, là où il coûte le moins cher à corriger — exactement le principe du *fail fast* en CI/CD.

## Diagramme

{{< mermaid >}}
flowchart LR
    Commit[Commit poussé] --> Lint[Analyse statique]
    Lint -->|OK| Test[Tests unitaires + intégration]
    Lint -->|échec| Fail1[Pipeline stoppé]
    Test -->|OK| Build[Build de l'image Docker]
    Test -->|échec| Fail2[Pipeline stoppé]
    Build --> Registry[Publication sur le registre d'images]
    Registry --> Staging[Déploiement en staging]
    Staging --> Approve{Validation manuelle ?}
    Approve -->|Livraison continue| Manuel[Déclenchement manuel en production]
    Approve -->|Déploiement continu| Auto[Déploiement automatique en production]
{{< /mermaid >}}

## Exemple de code

```yaml
# .github/workflows/ci-cd.yml — pipeline GitHub Actions
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Installer Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Installer les dépendances
        run: npm ci

      - name: Analyse statique
        run: npm run lint

      - name: Tests unitaires
        run: npm test -- --coverage

  build-and-deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Connexion au registre d'images
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build et publication de l'image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/monorg/mon-api:${{ github.sha }}

      - name: Déployer sur le cluster de production
        run: |
          kubectl set image deployment/mon-api \
            api=ghcr.io/monorg/mon-api:${{ github.sha }} \
            --record
```

## Quand utiliser le CI/CD ?

- Dès qu'une équipe compte plus d'une personne : la détection immédiate des conflits et des régressions justifie à elle seule l'investissement initial.
- Quand la fréquence de mise en production doit augmenter sans augmenter le risque associé à chaque déploiement.
- Le déploiement continu complet (sans validation manuelle) convient bien aux équipes avec une couverture de tests solide et des mécanismes de rollback automatisés ; à l'inverse, la livraison continue avec validation manuelle reste préférable pour des systèmes critiques où une supervision humaine finale est requise (santé, finance réglementée, par exemple).

## Points importants

- Un pipeline CI/CD n'a de valeur que si les tests qu'il exécute sont fiables et suffisamment complets : automatiser un pipeline qui ne teste presque rien donne une fausse impression de sécurité.
- La vitesse du pipeline compte autant que sa fiabilité : un pipeline qui prend 45 minutes décourage les commits fréquents et ralentit toute l'équipe — la parallélisation des étapes indépendantes (lint et tests en parallèle, par exemple) est une optimisation courante.
- Les secrets (identifiants de déploiement, clés d'API) ne doivent jamais être en clair dans le pipeline : les plateformes CI/CD fournissent un stockage de secrets dédié, chiffré et injecté au runtime.
- Le CI/CD est indissociable de l'Infrastructure as Code : décrire l'infrastructure cible dans des fichiers versionnés permet au pipeline de déployer de façon reproductible, sans configuration manuelle du serveur cible.
