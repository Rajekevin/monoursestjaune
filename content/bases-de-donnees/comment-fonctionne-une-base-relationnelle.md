---
title: "Comment fonctionne une base relationnelle ?"
description: "Tables, lignes, clés primaires et étrangères, moteur de stockage : les bases d'une base de données relationnelle expliquées simplement, avec schéma et exemples SQL."
date: 2026-07-10
category: "Bases de données"
difficulty: "Débutant"
tags: ["sql", "bases-de-donnees", "postgresql", "mysql"]
summary: "Une base relationnelle range les données dans des tables reliées entre elles par des clés. Comprendre ce modèle — lignes, colonnes, clés primaires et étrangères — est le prérequis à tout le reste : requêtes, index, transactions."
bearMemory:
  - "Une **clé primaire** identifie une ligne de façon unique ; une **clé étrangère** pointe vers la clé primaire d'une autre table pour créer une relation."
  - "Le moteur de stockage (InnoDB, PostgreSQL storage engine...) gère physiquement les données sur disque — le SQL, lui, reste le même quelle que soit l'implémentation."
  - "Une relation, ce n'est pas un lien magique : c'est juste une colonne qui contient la valeur de la clé primaire d'une autre table."
interviewQuestions:
  - q: "Quelle différence entre une clé primaire et une clé étrangère ?"
    a: "La clé primaire identifie de façon unique chaque ligne d'une table — elle ne peut pas être nulle ni dupliquée. La clé étrangère est une colonne dans une table qui référence la clé primaire d'une autre table, pour matérialiser une relation entre les deux. Une table peut avoir plusieurs clés étrangères, mais une seule clé primaire."
  - q: "Pourquoi séparer les données en plusieurs tables plutôt que tout mettre dans une seule ?"
    a: "Pour éviter la duplication et les incohérences : si l'adresse d'un client est répétée sur chacune de ses commandes, la corriger implique de mettre à jour toutes les lignes. En séparant `clients` et `commandes` reliées par une clé étrangère, l'information n'existe qu'à un seul endroit. C'est le principe de base de la normalisation."
---

## Le problème

Imaginez que vous stockiez toutes les commandes d'une boutique en ligne dans un seul grand tableau Excel : une ligne par commande, avec le nom du client, son adresse, son email, le produit acheté, son prix, répétés à chaque ligne. Un client qui passe dix commandes voit son adresse recopiée dix fois. Le jour où il déménage, il faut corriger dix lignes — et si on en oublie une, la donnée devient incohérente.

Ce problème n'est pas seulement une question d'espace disque gaspillé. C'est un problème de **vérité unique** : quand une même information existe à plusieurs endroits, on ne sait plus laquelle est la bonne le jour où elles divergent.

## L'idée générale

Une base de données relationnelle organise les données en **tables**, chacune représentant un type d'entité (clients, commandes, produits...). Chaque table est composée de **lignes** (une ligne = une entité, ex. un client précis) et de **colonnes** (un attribut, ex. le nom, l'email).

Deux mécanismes rendent ce modèle cohérent :

- La **clé primaire** (`PRIMARY KEY`) : une colonne (ou combinaison de colonnes) qui identifie chaque ligne de façon unique et non ambiguë, le plus souvent un identifiant auto-incrémenté (`id`).
- La **clé étrangère** (`FOREIGN KEY`) : une colonne dans une table qui référence la clé primaire d'une autre table, créant ainsi une relation entre les deux — d'où le nom "relationnel".

En dessous de ce modèle logique, un **moteur de stockage** (InnoDB pour MySQL, le storage engine natif de PostgreSQL...) se charge de la mécanique physique : écrire les pages sur disque, gérer les index, garantir les verrous. Le développeur n'a en général pas besoin d'y penser au quotidien — il raisonne en tables et en relations, le moteur s'occupe du reste.

## Analogie du quotidien

Une base relationnelle fonctionne comme un système de classeurs dans une administration. Un classeur "Clients" contient une fiche par client, chacune avec un numéro de dossier unique. Un classeur "Commandes" contient une fiche par commande — mais au lieu de recopier toute la fiche du client sur chaque commande, on note simplement son numéro de dossier en référence.

Si le client déménage, on corrige une seule fiche dans le classeur "Clients" : toutes les commandes qui référencent son numéro de dossier restent valides et à jour automatiquement, sans qu'on ait besoin de rouvrir chaque fiche de commande.

## Diagramme

{{< mermaid >}}
erDiagram
    CLIENTS ||--o{ COMMANDES : passe
    COMMANDES ||--o{ LIGNES_COMMANDE : contient
    PRODUITS ||--o{ LIGNES_COMMANDE : référencé_par

    CLIENTS {
        int id PK
        string nom
        string email
    }
    COMMANDES {
        int id PK
        int client_id FK
        date date_commande
    }
    LIGNES_COMMANDE {
        int id PK
        int commande_id FK
        int produit_id FK
        int quantite
    }
    PRODUITS {
        int id PK
        string nom
        decimal prix
    }
{{< /mermaid >}}

## Exemple de code

```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE commandes (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES clients(id),
    date_commande DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Récupérer chaque commande avec le nom du client associé
SELECT c.id AS commande_id, cl.nom, c.date_commande
FROM commandes c
JOIN clients cl ON cl.id = c.client_id
ORDER BY c.date_commande DESC;
```

```php
// Exemple avec PDO en PHP : lecture d'une commande et de son client
$pdo = new PDO('pgsql:host=localhost;dbname=boutique', $user, $pass);

$stmt = $pdo->prepare(
    'SELECT c.id, cl.nom, c.date_commande
     FROM commandes c
     JOIN clients cl ON cl.id = c.client_id
     WHERE c.id = :id'
);
$stmt->execute(['id' => $commandeId]);
$commande = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Quand utiliser une base relationnelle ?

- Quand les données ont une **structure claire et stable** (clients, commandes, produits) avec des relations bien définies entre elles.
- Quand la **cohérence des données** est prioritaire : pas de doublons, pas de valeurs orphelines, intégrité garantie par le moteur lui-même.
- Quand vous avez besoin de requêtes complexes croisant plusieurs entités (jointures, agrégations, filtres combinés).
- Moins adapté quand la structure des données change constamment ou que le volume impose une distribution horizontale massive — des bases NoSQL peuvent alors être plus pertinentes (voir l'article dédié).

## Points importants

- Une clé primaire ne doit jamais être nulle ni dupliquée : c'est la garantie qu'on peut toujours identifier une ligne sans ambiguïté.
- Une clé étrangère peut être contrainte (`FOREIGN KEY ... REFERENCES`) pour empêcher la base d'accepter une commande liée à un client qui n'existe pas — c'est le moteur qui refuse l'insertion, pas le code applicatif.
- "Relationnel" ne veut pas dire "avec des relations compliquées" : ça veut simplement dire que les tables sont reliées entre elles par des clés, rien de plus.
- Le moteur de stockage (InnoDB, MyISAM, le moteur PostgreSQL...) influence les performances et les garanties (verrouillage, transactions) mais pas la façon d'écrire du SQL : ce détail reste en grande partie invisible pour le développeur applicatif.
