---
title: "Infrastructure as Code"
description: "L'Infrastructure as Code décrit l'infrastructure cloud dans des fichiers versionnés plutôt que via des clics manuels, rendant les déploiements reproductibles et auditables. Explication, analogie, diagramme et exemple Terraform."
date: 2026-07-10
category: "Cloud & DevOps"
difficulty: "Intermédiaire"
tags: ["infrastructure-as-code", "cloud", "devops", "aws"]
summary: "L'Infrastructure as Code consiste à décrire l'infrastructure cloud (serveurs, réseaux, bases de données) dans des fichiers de configuration versionnés, plutôt que de la configurer manuellement via une console. L'infrastructure devient reproductible, relisable et testable comme du code applicatif."
bearMemory:
  - "IaC déclaratif : on décrit **l'état voulu**, pas les étapes pour l'atteindre — l'outil calcule lui-même le chemin (contrairement à un script impératif)."
  - "**Idempotence** : appliquer plusieurs fois la même configuration IaC produit toujours le même résultat, sans effet de bord ni doublon."
  - "L'infrastructure configurée à la main directement dans la console cloud s'appelle du **ClickOps** — c'est justement ce que l'IaC cherche à éliminer, car non reproductible et non versionné."
interviewQuestions:
  - q: "Quelle est la différence entre une approche déclarative et une approche impérative en Infrastructure as Code ?"
    a: "Une approche impérative décrit la séquence d'étapes à exécuter pour arriver à un résultat (crée ce serveur, puis attache ce disque, puis configure ce réseau) — comme un script shell classique. Une approche déclarative décrit uniquement l'état final voulu (je veux un serveur avec tel disque et tel réseau), et laisse l'outil déterminer lui-même les actions nécessaires pour atteindre cet état, y compris la détection des changements à appliquer sur un état déjà existant. Terraform et Kubernetes sont déclaratifs ; un script Bash qui appelle l'API AWS étape par étape est impératif."
  - q: "Pourquoi l'idempotence est-elle si importante en Infrastructure as Code ?"
    a: "Parce qu'un pipeline peut être exécuté plusieurs fois, volontairement (rejouer un déploiement après un souci réseau) ou par erreur. Sans idempotence, relancer un script de provisioning impératif pourrait créer un deuxième serveur identique, dupliquer une base de données, ou casser une ressource déjà configurée. Un outil IaC idempotent compare l'état désiré à l'état réel et n'applique que les changements nécessaires, ce qui rend les réexécutions sûres et prévisibles."
  - q: "Quels sont les risques ou limites de l'Infrastructure as Code ?"
    a: "Le principal risque est le drift : quand quelqu'un modifie manuellement une ressource dans la console cloud sans passer par l'IaC, l'état réel diverge de l'état décrit dans le code, et la prochaine application peut annuler ce changement de façon inattendue. Il y a aussi un coût d'apprentissage réel, et un risque non négligeable si une erreur dans le code IaC est appliquée automatiquement à grande échelle — une mauvaise règle peut supprimer des ressources de production en quelques secondes sur tout un environnement."
---

## Le problème

Configurer une infrastructure cloud à la main — cliquer dans une console pour créer un serveur, un réseau, une base de données — fonctionne pour un premier test, mais devient vite ingérable. Rien n'est documenté nulle part sauf dans la mémoire de la personne qui a fait les clics. Reproduire exactement le même environnement pour la pré-production, ou après un incident qui a détruit des ressources, devient un exercice hasardeux basé sur des souvenirs approximatifs et de la documentation jamais à jour.

Ce mode de fonctionnement (parfois appelé "ClickOps") pose aussi un problème de traçabilité : impossible de savoir qui a changé quoi, quand, et pourquoi, ni de faire relire une modification d'infrastructure avant qu'elle ne soit appliquée — contrairement à du code applicatif, passé systématiquement en revue avant d'être fusionné.

## L'idée générale

L'Infrastructure as Code (IaC) consiste à décrire l'infrastructure — serveurs, réseaux, bases de données, permissions — dans des fichiers de configuration texte, versionnés dans un dépôt Git comme n'importe quel code applicatif. Un outil IaC (Terraform, Pulumi, AWS CloudFormation) lit ces fichiers et provisionne les ressources correspondantes chez le fournisseur cloud.

Deux propriétés distinguent une bonne approche IaC :

- **Déclarative plutôt qu'impérative** : on décrit l'état final voulu ("je veux 3 serveurs derrière un load balancer"), pas la séquence d'étapes pour y arriver. L'outil compare cet état désiré à l'état réel du cloud et calcule lui-même les changements à appliquer.
- **Idempotente** : appliquer la même configuration plusieurs fois de suite produit toujours le même résultat, sans dupliquer de ressources ni provoquer d'effets de bord.

Ces deux propriétés rendent l'infrastructure reproductible à l'identique (recréer un environnement de test conforme à la production en quelques minutes), relisable (une pull request sur un fichier Terraform se revoit comme du code), et auditable (l'historique Git devient l'historique de l'infrastructure).

## Analogie du quotidien

L'Infrastructure as Code, c'est comme la différence entre construire un meuble à partir d'un plan IKEA versus improviser en atelier sans aucune notice. Sans plan, chaque meuble construit à la main varie légèrement, et si le premier casse, personne ne se souvient exactement comment le reproduire à l'identique. Avec un plan écrit et numéroté, n'importe qui peut reconstruire exactement le même meuble, vérifier le plan avant de commencer le montage, et corriger une erreur dans le plan une fois pour toutes plutôt que de la refaire à chaque nouvelle construction.

Le plan IKEA, c'est le fichier Terraform : une description déclarative du résultat voulu, que n'importe qui peut suivre pour obtenir un résultat identique et reproductible.

## Diagramme

{{< mermaid >}}
flowchart LR
    Dev[Développeur] -->|écrit| Code[Fichiers .tf versionnés dans Git]
    Code -->|pull request relue| Merge[Merge sur main]
    Merge -->|déclenche| Plan[terraform plan : calcule les changements]
    Plan -->|revue des changements| Apply[terraform apply]
    Apply -->|provisionne| Cloud[(Infrastructure cloud réelle)]
    Cloud -.compare état réel vs désiré à chaque run.-> Plan
{{< /mermaid >}}

## Exemple de code

```hcl
# main.tf — provisionne un serveur web et son groupe de sécurité sur AWS

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-west-3"
}

resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Autorise HTTP et HTTPS entrants"

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami             = "ami-0c94855ba95c71c99"
  instance_type   = "t3.micro"
  security_groups = [aws_security_group.web.name]

  tags = {
    Name = "serveur-web-01"
  }
}

output "adresse_ip_publique" {
  value = aws_instance.web.public_ip
}
```

```bash
# Prévisualiser les changements avant de les appliquer (idempotent)
terraform plan

# Appliquer réellement les changements calculés
terraform apply

# Rejouer la même commande ne recrée rien si l'état n'a pas changé
terraform apply   # → "No changes. Infrastructure is up-to-date."
```

## Quand utiliser l'Infrastructure as Code ?

- Dès qu'une infrastructure doit être reproduite à l'identique dans plusieurs environnements (développement, staging, production).
- Quand la traçabilité et la revue des changements d'infrastructure sont importantes, en particulier en équipe.
- Quand l'infrastructure évolue fréquemment et que la configuration manuelle devient une source d'erreurs ou d'oublis.
- Moins critique pour une expérimentation ponctuelle et jetable, où la vitesse de mise en place prime sur la reproductibilité — mais même dans ce cas, l'habitude de l'IaC évite les mauvaises surprises si l'expérimentation devient permanente.

## Points importants

- Le principal risque de l'IaC est le *drift* : une modification manuelle faite en dehors du code (directement dans la console) désynchronise l'état réel de l'état décrit, et peut être écrasée sans prévenir à la prochaine application.
- L'état (*state*) de Terraform, qui mémorise la correspondance entre le code et les ressources réelles, doit lui-même être stocké et partagé de façon sécurisée (souvent dans un bucket distant avec verrouillage), jamais laissé uniquement en local.
- L'IaC ne se limite pas à Terraform : Kubernetes avec ses manifestes YAML est également une forme d'Infrastructure as Code, déclarative par nature.
- Une erreur dans du code IaC peut avoir un impact bien plus large et rapide qu'une erreur de clic manuel isolée : une revue de code rigoureuse sur les changements d'infrastructure est donc au moins aussi importante que sur le code applicatif.
