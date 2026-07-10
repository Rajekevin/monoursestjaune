---
title: "Qu'est-ce que le Cloud ?"
description: "Le cloud computing remplace l'achat de serveurs physiques par la location de ressources informatiques à la demande, facturées à l'usage. Explication, analogie et diagramme."
date: 2026-07-10
category: "Cloud & DevOps"
difficulty: "Débutant"
tags: ["cloud", "aws", "infrastructure-as-code", "scalabilite"]
summary: "Le cloud computing, c'est louer de la puissance de calcul, du stockage et des services réseau à la demande plutôt que d'acheter et de gérer ses propres serveurs. On passe d'un investissement fixe à une dépense variable, ajustable en quelques clics."
bearMemory:
  - "Le cloud, ce n'est pas juste \"le serveur de quelqu'un d'autre\" : c'est surtout l'**élasticité** — la capacité d'ajuster les ressources à la demande, automatiquement."
  - "On passe d'un modèle **CAPEX** (achat de matériel, coût fixe amorti sur des années) à un modèle **OPEX** (paiement à l'usage, coût variable)."
  - "Les trois grands fournisseurs (AWS, Azure, GCP) vendent la même idée de base : des ressources informatiques accessibles via une API, facturées à la seconde ou à la minute."
interviewQuestions:
  - q: "Qu'est-ce que le cloud computing, en une phrase ?"
    a: "C'est la mise à disposition de ressources informatiques (calcul, stockage, réseau, bases de données) via Internet, à la demande, et facturées à l'usage plutôt qu'achetées comme du matériel physique. La bascule fondamentale est de transformer un coût fixe en coût variable."
  - q: "Quelle est la différence entre scalabilité verticale et élasticité cloud ?"
    a: "La scalabilité verticale consiste à augmenter la puissance d'une seule machine (plus de RAM, plus de CPU). L'élasticité cloud va plus loin : elle permet d'ajouter ou de retirer des ressources automatiquement selon la charge réelle, souvent en ajoutant des machines plutôt qu'en grossissant une seule (scalabilité horizontale). C'est cette automatisation qui distingue vraiment le cloud d'un simple hébergement dédié."
  - q: "Pourquoi une entreprise choisirait-elle le cloud plutôt que ses propres serveurs (on-premise) ?"
    a: "Pour éviter d'immobiliser du capital dans du matériel qui se déprécie et qu'il faut maintenir, remplacer, sécuriser physiquement. Le cloud permet de démarrer petit, de payer uniquement ce qui est consommé, et d'absorber des pics de trafic sans avoir surdimensionné l'infrastructure à l'avance. La contrepartie est une dépendance au fournisseur et des coûts qui peuvent devenir élevés à grande échelle si l'usage n'est pas maîtrisé."
---

## Le problème

Avant le cloud, faire tourner une application signifiait acheter des serveurs physiques : les commander, attendre leur livraison (parfois plusieurs semaines), les installer dans un datacenter, les configurer, les maintenir, prévoir leur remplacement tous les quelques années. Il fallait aussi dimensionner cette infrastructure pour le pic de trafic le plus élevé imaginable — un serveur pour Noël qui reste à 5 % d'utilisation le reste de l'année, payé et entretenu quand même.

Ce modèle pose deux problèmes symétriques. Sous-dimensionner, et le site s'effondre au premier pic de trafic. Sur-dimensionner, et l'entreprise paie pour du matériel qui reste inutilisé la majeure partie du temps. Dans les deux cas, l'investissement est fait à l'avance, avant même de savoir si le produit va rencontrer son public.

## L'idée générale

Le cloud computing consiste à louer des ressources informatiques — machines virtuelles, stockage, bases de données, réseau — chez un fournisseur (AWS, Azure, Google Cloud, OVH...) plutôt que de les posséder. Ces ressources sont accessibles via une API ou une console web, provisionnées en quelques minutes, et facturées à l'usage réel : à la seconde de calcul, au gigaoctet stocké, au gigaoctet transféré.

Trois caractéristiques distinguent vraiment le cloud d'un simple hébergement dédié :

- **Le libre-service à la demande** : on crée une machine virtuelle sans appeler personne, via une simple requête API.
- **L'élasticité** : les ressources peuvent grossir ou rétrécir automatiquement selon la charge, en quelques minutes plutôt qu'en quelques semaines.
- **La facturation à l'usage** : on paie ce qu'on consomme, pas une capacité réservée à l'avance "au cas où".

Le cloud ne change pas la nature du travail (il faut toujours du calcul, du stockage, du réseau) : il change le modèle économique et la vitesse de provisionnement de ces ressources.

## Analogie du quotidien

Le cloud, c'est comme la différence entre acheter une voiture et prendre un service d'autopartage. Acheter une voiture (le serveur physique) demande un investissement important à l'avance, l'entretien est à votre charge, et la voiture reste immobilisée dans un parking la majorité du temps. Avec l'autopartage (le cloud), vous réservez une voiture uniquement quand vous en avez besoin, vous ne payez que le temps d'utilisation, et vous pouvez réserver un utilitaire un jour et une petite citadine le lendemain selon vos besoins réels.

Le trajet est le même dans les deux cas — se déplacer d'un point A à un point B — mais la flexibilité et la structure de coût changent radicalement.

## Diagramme

{{< mermaid >}}
flowchart LR
    subgraph Avant["Avant le cloud"]
        A1[Achat de serveurs] --> A2[Installation datacenter]
        A2 --> A3[Dimensionné pour le pic]
        A3 --> A4[Coût fixe, sous-utilisé]
    end

    subgraph Apres["Avec le cloud"]
        B1[Requête API] --> B2[Ressource provisionnée en minutes]
        B2 --> B3[Ajustement automatique à la charge]
        B3 --> B4[Facturation à l'usage réel]
    end
{{< /mermaid >}}

## Exemple de code

Provisionner une machine virtuelle sur AWS via l'interface en ligne de commande illustre bien le libre-service à la demande : une seule commande, pas de bon de commande ni de livraison physique.

```bash
# Créer une instance EC2 (machine virtuelle) à la demande
aws ec2 run-instances \
  --image-id ami-0c94855ba95c71c99 \
  --instance-type t3.micro \
  --count 1 \
  --key-name ma-cle-ssh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=serveur-web-01}]'

# Arrêter (et donc ne plus payer le calcul) dès qu'elle n'est plus utile
aws ec2 stop-instances --instance-ids i-0abcd1234efgh5678
```

La ressource existe en quelques secondes, et sa facturation s'arrête dès qu'elle est stoppée — impossible avec un serveur physique acheté.

## Quand utiliser le cloud ?

- Quand la charge de l'application est difficile à prévoir à l'avance (startup, lancement produit, pics saisonniers).
- Quand l'entreprise veut limiter l'investissement initial et transformer un coût fixe en coût variable.
- Quand l'équipe veut déployer rapidement dans plusieurs régions géographiques sans construire de datacenter localement.
- Le cloud est moins pertinent pour une charge parfaitement stable et prévisible sur le long terme, où un serveur dédié ou on-premise peut revenir moins cher à volume constant.

## Points importants

- Le cloud n'élimine pas la responsabilité de l'ingénieur : il déplace la question de "comment acheter du matériel" vers "comment dimensionner et sécuriser des ressources à la demande".
- Trois grands modèles de service existent au-dessus de cette infrastructure de base : IaaS, PaaS et SaaS, qui déterminent la part de responsabilité laissée au fournisseur (voir l'article dédié).
- Un piège classique est le coût "silencieux" du cloud : des ressources oubliées mais jamais éteintes continuent à être facturées, contrairement à un serveur physique qu'on voit physiquement tourner.
- La bascule vers le cloud est aussi culturelle : elle pousse vers l'automatisation (Infrastructure as Code, CI/CD) parce que les ressources sont éphémères et recréées à la volée plutôt que configurées à la main une fois pour toutes.
