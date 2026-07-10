---
title: "Normalisation"
description: "1NF, 2NF, 3NF expliquées simplement : comment transformer une table dénormalisée pleine de doublons en un modèle relationnel propre, étape par étape."
date: 2026-07-10
category: "Bases de données"
difficulty: "Intermédiaire"
tags: ["sql", "bases-de-donnees", "postgresql", "mysql"]
summary: "La normalisation est un ensemble de règles progressives (1NF, 2NF, 3NF) qui éliminent la duplication de données dans une base relationnelle. Elle transforme une table fourre-tout en plusieurs tables cohérentes, reliées par des clés."
bearMemory:
  - "1NF : chaque cellule contient une seule valeur atomique, pas de liste ni de colonnes répétées."
  - "2NF : chaque colonne dépend de la clé primaire **entière**, pas d'une partie seulement (pertinent surtout avec une clé composite)."
  - "3NF : chaque colonne dépend **uniquement** de la clé primaire, jamais d'une autre colonne non-clé (pas de dépendance transitive)."
interviewQuestions:
  - q: "Pourquoi normaliser une base de données ?"
    a: "Pour éliminer la duplication de données et les anomalies qui en découlent : une même information répétée à plusieurs endroits peut devenir incohérente si on oublie de la mettre à jour partout. Normaliser signifie décomposer une table en plusieurs tables plus petites, chacune responsable d'une seule chose, reliées par des clés étrangères, de sorte que chaque donnée n'existe qu'à un seul endroit."
  - q: "La normalisation a-t-elle un inconvénient ?"
    a: "Oui : plus une base est normalisée, plus les requêtes doivent multiplier les jointures pour reconstituer l'information complète, ce qui a un coût en performance. C'est pourquoi certains systèmes, notamment pour la lecture intensive (reporting, cache), acceptent une dénormalisation partielle et contrôlée en échange de requêtes plus simples et plus rapides."
---

## Le problème

Prenons une table unique qui stocke des commandes avec toutes les informations à plat :

| commande_id | client_nom | client_email | produit_nom | produit_prix | quantite |
|---|---|---|---|---|---|
| 1 | Dupont | dupont@mail.fr | Clavier | 49.90 | 2 |
| 2 | Dupont | dupont@mail.fr | Souris | 19.90 | 1 |

L'email du client "Dupont" est répété à chaque commande. Si Dupont change d'adresse email, il faut mettre à jour toutes ses lignes de commandes — en oublier une seule laisse la base dans un état incohérent, avec deux emails différents pour la même personne. C'est ce qu'on appelle une **anomalie de mise à jour**. Il existe aussi des anomalies d'insertion (impossible d'enregistrer un produit qui n'a encore jamais été commandé) et de suppression (supprimer la seule commande d'un client fait disparaître ses coordonnées).

## L'idée générale

La normalisation est une suite de règles progressives, appelées **formes normales**, qui structurent une base pour éliminer ces anomalies :

- **1NF (première forme normale)** : chaque cellule contient une valeur atomique unique — pas de liste de valeurs dans une même colonne, pas de colonnes répétées (`produit1`, `produit2`, `produit3`...).
- **2NF (deuxième forme normale)** : en plus de 1NF, chaque colonne non-clé dépend de la **clé primaire entière**, pas d'une seule partie d'une clé composite. Ne s'applique concrètement que si la clé primaire est composée de plusieurs colonnes.
- **3NF (troisième forme normale)** : en plus de 2NF, chaque colonne non-clé dépend **uniquement** de la clé primaire, jamais d'une autre colonne non-clé (pas de "dépendance transitive"). Dans l'exemple ci-dessus, `client_email` dépend de `client_nom`, pas directement de `commande_id` — c'est une violation de 3NF.

En pratique, atteindre la 3NF suffit pour la grande majorité des applications métier : au-delà (4NF, 5NF, BCNF), les cas sont plus rares et plus académiques.

## Analogie du quotidien

Normaliser une base, c'est comme trier des papiers administratifs mélangés dans une seule pile. Au lieu de garder une feuille par événement où l'on recopie à chaque fois son nom, son adresse et sa date de naissance, on crée un dossier "identité" unique avec ces informations, et chaque feuille d'événement se contente d'y faire référence par un numéro de dossier.

Si vous déménagez, vous ne corrigez qu'un seul document — le dossier "identité" — au lieu de rouvrir chaque feuille d'événement pour y changer l'adresse. Chaque information vit à un seul endroit, référencée partout où elle est utile.

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
-- Table dénormalisée initiale (viole 1NF et 3NF)
CREATE TABLE commandes_denormalisees (
    commande_id INT,
    client_nom VARCHAR(100),
    client_email VARCHAR(150),
    produit_nom VARCHAR(100),
    produit_prix DECIMAL(10,2),
    quantite INT
);

-- Après normalisation (3NF) : chaque information n'existe qu'à un seul endroit
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE produits (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prix DECIMAL(10,2) NOT NULL
);

CREATE TABLE commandes (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES clients(id),
    date_commande DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE lignes_commande (
    commande_id INT NOT NULL REFERENCES commandes(id),
    produit_id INT NOT NULL REFERENCES produits(id),
    quantite INT NOT NULL CHECK (quantite > 0),
    PRIMARY KEY (commande_id, produit_id)
);

-- Reconstituer l'information complète nécessite désormais des jointures
SELECT cl.nom, p.nom AS produit, lc.quantite, p.prix
FROM lignes_commande lc
JOIN commandes c ON c.id = lc.commande_id
JOIN clients cl ON cl.id = c.client_id
JOIN produits p ON p.id = lc.produit_id
WHERE c.id = 1;
```

## Quand utiliser la normalisation ?

- Sur les systèmes transactionnels (OLTP) où les écritures fréquentes doivent rester cohérentes : e-commerce, gestion de comptes, réservation.
- Quand la même information (nom, email, prix) est susceptible d'être répétée dans plusieurs lignes ou tables.
- Moins prioritaire sur les systèmes orientés lecture intensive (reporting, data warehouse), où une dénormalisation contrôlée peut réduire le nombre de jointures et accélérer les requêtes de lecture, au prix d'une gestion plus rigoureuse de la cohérence.
- À doser selon le contexte : la 3NF est un bon objectif par défaut, pas un dogme absolu à appliquer aveuglément partout.

## Points importants

- Chaque forme normale suppose que la précédente est déjà respectée : impossible d'être en 3NF sans être en 2NF, impossible d'être en 2NF sans être en 1NF.
- La normalisation réduit la duplication mais augmente le nombre de jointures nécessaires pour reconstituer une vue complète — c'est un compromis, pas un gain sans contrepartie.
- Une dépendance transitive (colonne A qui dépend de colonne B, qui dépend de la clé primaire) est le piège le plus fréquent qui empêche d'atteindre la 3NF.
- En entretien, on attend souvent qu'un candidat sache repérer une table dénormalisée à l'œil et proposer spontanément un découpage en tables reliées par des clés.
