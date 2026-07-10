---
title: "IaaS, PaaS, SaaS"
description: "IaaS, PaaS et SaaS sont trois niveaux d'abstraction du cloud, qui définissent ce que le fournisseur gère et ce qui reste à votre charge. Explication, analogie et diagramme."
date: 2026-07-10
category: "Cloud & DevOps"
difficulty: "Débutant"
tags: ["cloud", "aws", "infrastructure-as-code", "devops"]
summary: "IaaS, PaaS et SaaS sont trois façons de consommer le cloud, qui se distinguent par la part de la stack technique gérée par le fournisseur. Plus on monte dans l'abstraction, moins on a de contrôle — mais moins on a aussi à maintenir."
bearMemory:
  - "IaaS = vous gérez tout à partir de l'OS (serveurs virtuels). PaaS = vous gérez seulement le code (le fournisseur gère l'OS, le runtime, la scalabilité). SaaS = vous n'installez rien, vous utilisez juste le produit."
  - "Plus on monte dans l'abstraction (IaaS → PaaS → SaaS), moins on a de **contrôle**, mais moins on a aussi de **responsabilité opérationnelle**."
  - "Le choix n'est pas binaire : une même entreprise combine souvent les trois — du SaaS pour la messagerie, du PaaS pour héberger son API, du IaaS pour un besoin très spécifique."
interviewQuestions:
  - q: "Peux-tu donner un exemple concret pour chaque modèle IaaS, PaaS, SaaS ?"
    a: "IaaS : une instance AWS EC2 ou une machine virtuelle Azure, où vous installez vous-même l'OS et tout le reste. PaaS : Heroku, Render ou AWS Elastic Beanstalk, où vous poussez votre code et la plateforme gère le serveur, le déploiement et le scaling. SaaS : Gmail, Salesforce ou Slack, où vous utilisez directement un logiciel fini sans rien installer ni maintenir."
  - q: "Pourquoi une équipe choisirait-elle IaaS plutôt que PaaS si PaaS est plus simple ?"
    a: "Pour le contrôle. Le PaaS impose des contraintes (versions de runtime supportées, configuration réseau limitée, dépendances système parfois impossibles à installer). Une équipe avec des besoins spécifiques — une configuration réseau particulière, une stack logicielle non standard, des exigences de conformité précises — préfère souvent l'IaaS malgré la charge opérationnelle supplémentaire, car elle garde la main sur chaque couche."
  - q: "Kubernetes, c'est du IaaS ou du PaaS ?"
    a: "Ça se situe entre les deux, et c'est une bonne question piège en entretien. Un cluster Kubernetes managé (comme EKS ou GKE) est fourni comme un service, ce qui se rapproche du PaaS pour l'orchestration. Mais vous continuez à gérer vous-même les conteneurs, leur configuration et leur déploiement, ce qui garde une bonne part de responsabilité côté IaaS. On parle parfois de CaaS (Container as a Service) pour désigner ce niveau intermédiaire."
---

## Le problème

Toutes les entreprises n'ont pas besoin du même niveau de contrôle sur leur infrastructure. Une startup qui veut mettre en ligne une API le plus vite possible n'a pas envie de configurer un système d'exploitation, un pare-feu et un load balancer à la main. À l'inverse, une entreprise avec des contraintes réglementaires strictes ou une architecture réseau très spécifique a besoin de maîtriser chaque couche, jusqu'au système d'exploitation.

Sans vocabulaire commun pour désigner ces différents niveaux d'abstraction, les discussions entre équipes techniques et décideurs deviennent confuses : "on migre vers le cloud" ne veut rien dire tant qu'on n'a pas précisé *quel type* de cloud, et donc *qui* est responsable de quoi.

## L'idée générale

IaaS, PaaS et SaaS désignent trois niveaux d'abstraction dans la consommation du cloud, qui se distinguent par la frontière entre ce que **le fournisseur gère** et ce que **vous gérez**.

- **IaaS (Infrastructure as a Service)** : le fournisseur donne accès à des ressources brutes — machines virtuelles, stockage, réseau. Vous installez et configurez tout, à partir du système d'exploitation. Exemples : AWS EC2, Azure Virtual Machines, Google Compute Engine.
- **PaaS (Platform as a Service)** : le fournisseur gère le système d'exploitation, le runtime et l'infrastructure de déploiement. Vous vous concentrez sur votre code applicatif. Exemples : Heroku, AWS Elastic Beanstalk, Render, Vercel.
- **SaaS (Software as a Service)** : le fournisseur gère tout, y compris l'application elle-même. Vous utilisez le logiciel fini via un navigateur ou une API. Exemples : Gmail, Salesforce, Notion.

Une image classique aide à retenir la répartition des responsabilités : dans un tableau où chaque ligne est une couche technique (application, données, runtime, middleware, OS, virtualisation, serveur, stockage, réseau), le nombre de lignes gérées "par vous" diminue à mesure qu'on avance de IaaS vers SaaS.

## Analogie du quotidien

C'est comme se loger. Le IaaS, c'est louer un terrain nu : vous devez construire la maison, l'électricité, la plomberie, tout vous-même — mais vous avez une liberté totale sur l'architecture. Le PaaS, c'est louer un appartement meublé : les fondations, la structure et les équipements de base sont déjà là, vous n'avez qu'à emménager et vivre votre vie, avec quelques contraintes sur ce que vous pouvez modifier (pas question d'abattre un mur porteur). Le SaaS, c'est réserver une chambre d'hôtel : vous n'avez rien à gérer, ni le ménage ni la maintenance, vous utilisez le service tel quel, avec très peu de personnalisation possible.

## Diagramme

{{< mermaid >}}
flowchart TB
    subgraph IaaS["IaaS — vous gérez tout à partir de l'OS"]
        direction LR
        I1[Application] --- I2[Données] --- I3[Runtime] --- I4[OS]
        I5[Réseau / Stockage / Serveurs : fournisseur]
    end
    subgraph PaaS["PaaS — vous gérez le code applicatif"]
        direction LR
        P1[Application] --- P2[Données]
        P3[Runtime / OS / Réseau / Serveurs : fournisseur]
    end
    subgraph SaaS["SaaS — vous utilisez le produit fini"]
        direction LR
        S1[Tout est géré par le fournisseur]
    end

    IaaS --> PaaS --> SaaS
{{< /mermaid >}}

## Exemple de code

Le même objectif — déployer une API Node.js — illustre bien la différence de responsabilité entre IaaS et PaaS.

```bash
# --- IaaS : vous configurez tout, à partir de zéro, sur une VM louée ---
sudo apt update && sudo apt install -y nodejs npm nginx
git clone https://github.com/moncompte/mon-api.git
cd mon-api && npm install
# Configuration manuelle de nginx en reverse proxy, du service systemd,
# des certificats TLS, du firewall...
sudo systemctl enable --now mon-api
```

```yaml
# --- PaaS : vous décrivez juste votre besoin, la plateforme fait le reste ---
# app.yaml (exemple simplifié pour un PaaS type Elastic Beanstalk / Render)
name: mon-api
runtime: nodejs20
build:
  command: npm install
start:
  command: npm start
instances:
  min: 1
  max: 5   # le PaaS gère lui-même le scaling automatique
```

## Quand utiliser IaaS, PaaS ou SaaS ?

- **IaaS** : quand vous avez des besoins précis de configuration réseau, de conformité, ou une stack technique non standard qu'aucune plateforme ne supporte nativement.
- **PaaS** : quand l'objectif est de livrer vite un produit sans réinventer l'infrastructure de déploiement, et que les contraintes du PaaS (runtimes supportés, scaling automatique standard) sont acceptables.
- **SaaS** : quand le besoin est générique (messagerie, CRM, suivi de projet) et qu'il n'y a aucune valeur ajoutée à développer sa propre solution.
- Une même entreprise combine généralement les trois selon le besoin : impossible de tout faire en SaaS quand on développe un produit sur-mesure, et rarement pertinent de tout faire en IaaS quand des solutions PaaS ou SaaS existent déjà pour des besoins standards.

## Points importants

- La frontière entre les modèles n'est pas toujours nette : Kubernetes managé, par exemple, se situe entre IaaS et PaaS, parfois appelé CaaS (Container as a Service).
- Monter en abstraction (vers le PaaS ou le SaaS) réduit la charge opérationnelle mais augmente la dépendance au fournisseur (vendor lock-in) : migrer hors d'un PaaS propriétaire peut être coûteux.
- Le choix du modèle a un impact direct sur le profil de l'équipe nécessaire : plus on descend vers IaaS, plus il faut des compétences systèmes et réseau en interne.
- En entretien, ce sujet est souvent utilisé pour vérifier que le candidat comprend que "le cloud" n'est pas un bloc monolithique, mais un ensemble de niveaux de responsabilité partagée entre client et fournisseur.
