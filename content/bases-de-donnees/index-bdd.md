---
title: "Index BDD"
description: "Comment un index accélère une requête grâce à une structure B-Tree, et pourquoi il a un coût en écriture. Explication, diagramme et exemples SQL."
date: 2026-07-10
category: "Bases de données"
difficulty: "Intermédiaire"
tags: ["sql", "index", "bases-de-donnees", "postgresql"]
summary: "Un index permet au moteur de retrouver des lignes sans parcourir toute la table, au prix d'un espace disque et d'un coût supplémentaire à chaque écriture. Comprendre ce compromis est essentiel pour optimiser des requêtes en entretien comme en production."
bearMemory:
  - "Un index accélère la **lecture** mais ralentit **l'écriture** : chaque `INSERT`/`UPDATE`/`DELETE` doit aussi mettre à jour l'index."
  - "La structure la plus courante est le **B-Tree** : un arbre équilibré et trié qui permet de trouver une ligne en quelques comparaisons plutôt qu'en scannant toute la table."
  - "Un index sur une colonne peu sélective (ex. un booléen) apporte souvent peu de gain : le moteur préfère parfois un scan complet plutôt que de suivre l'index."
interviewQuestions:
  - q: "Pourquoi un index accélère une requête ?"
    a: "Sans index, le moteur doit parcourir toutes les lignes de la table pour trouver celles qui correspondent au filtre — un scan complet, en O(n). Un index B-Tree maintient une structure arborescente triée sur la colonne indexée : le moteur peut alors localiser les lignes recherchées en descendant l'arbre par comparaisons successives, en O(log n), au lieu de tout parcourir. C'est la différence entre chercher un mot dans un dictionnaire trié et le chercher dans une liste dans le désordre."
  - q: "Pourquoi ne pas indexer toutes les colonnes d'une table ?"
    a: "Chaque index occupe de l'espace disque et doit être mis à jour à chaque écriture (INSERT, UPDATE, DELETE), ce qui ralentit ces opérations. Indexer toutes les colonnes maximiserait la vitesse de lecture mais dégraderait fortement les écritures et gonflerait le stockage — il faut choisir les index selon les requêtes réellement exécutées, pas par précaution systématique."
---

## Le problème

Sans index, retrouver une ligne précise dans une table oblige le moteur à faire un **scan complet** : lire ligne par ligne, du début à la fin, en comparant chaque valeur au critère recherché. Sur une table de 100 lignes, ce n'est pas un problème. Sur une table de 50 millions de lignes, une requête qui devrait répondre en quelques millisecondes peut prendre plusieurs secondes, voire minutes.

Le problème grossit avec les données : plus la table grandit, plus le coût d'un scan complet augmente linéairement. Une application qui semblait rapide en développement (peu de données) peut devenir inutilisable en production (des millions de lignes) si personne n'a pensé aux index.

## L'idée générale

Un index est une **structure de données auxiliaire**, maintenue à part de la table, qui permet de retrouver rapidement les lignes correspondant à une valeur sans les parcourir toutes. La structure la plus répandue est le **B-Tree** (arbre équilibré) : les valeurs indexées y sont organisées de façon triée et hiérarchique, ce qui permet de localiser une valeur en un petit nombre de comparaisons, plutôt qu'en parcourant chaque ligne.

Ce gain a un coût. À chaque `INSERT`, `UPDATE` ou `DELETE`, le moteur doit non seulement modifier la table, mais aussi **mettre à jour chaque index concerné** pour qu'il reste cohérent. Plus une table a d'index, plus les écritures sont lentes — c'est un compromis lecture/écriture, pas un gain gratuit.

## Analogie du quotidien

Un index, c'est comme l'index alphabétique à la fin d'un livre technique. Sans lui, pour trouver toutes les pages qui parlent de "transactions", il faudrait feuilleter le livre entier page par page. Avec l'index, on va directement à la lettre T, on trouve "transactions, p. 42, 108, 203" et on saute directement aux bonnes pages.

Mais cet index n'existe pas par magie : quelqu'un doit le maintenir à jour. Si l'auteur ajoute un chapitre au milieu du livre, il doit aussi mettre à jour l'index pour que les numéros de page restent corrects. C'est exactement le coût qu'un moteur de base de données paie à chaque écriture sur une table indexée.

## Diagramme

{{< mermaid >}}
flowchart TD
    Root["Racine\n(id 1-1000000)"]
    Root --> N1["Nœud\nid 1-300000"]
    Root --> N2["Nœud\nid 300001-700000"]
    Root --> N3["Nœud\nid 700001-1000000"]
    N1 --> L1["Feuille\nid 1-100000 → pointeurs vers lignes"]
    N1 --> L2["Feuille\nid 100001-300000 → pointeurs vers lignes"]
    N2 --> L3["Feuille\nid 300001-500000 → pointeurs vers lignes"]
    N3 --> L4["Feuille\nid 700001-850000 → pointeurs vers lignes"]
{{< /mermaid >}}

## Exemple de code

```sql
-- Sans index : recherche par email = scan complet sur des millions de lignes
SELECT * FROM utilisateurs WHERE email = 'kevin@example.com';

-- Créer un index sur la colonne fréquemment filtrée
CREATE INDEX idx_utilisateurs_email ON utilisateurs (email);

-- La même requête peut désormais utiliser l'index au lieu du scan complet

-- Vérifier si le moteur utilise bien l'index
EXPLAIN ANALYZE
SELECT * FROM utilisateurs WHERE email = 'kevin@example.com';

-- Index composite : utile si les requêtes filtrent sur plusieurs colonnes ensemble
CREATE INDEX idx_commandes_client_date ON commandes (client_id, date_commande);
```

```php
// L'index est transparent côté code applicatif : la requête ne change pas,
// seul le temps de réponse change radicalement selon qu'il existe ou non.
$stmt = $pdo->prepare('SELECT * FROM utilisateurs WHERE email = :email');
$stmt->execute(['email' => $email]);
$utilisateur = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Quand utiliser un index ?

- Sur les colonnes fréquemment utilisées dans un `WHERE`, un `JOIN`, ou un `ORDER BY` — surtout sur de grandes tables.
- Sur les clés étrangères : la plupart des moteurs n'indexent pas automatiquement les colonnes `FOREIGN KEY`, ce qui peut rendre les jointures lentes si on l'oublie.
- Sur les colonnes **sélectives** (beaucoup de valeurs distinctes, comme un email) : un index sur une colonne peu sélective (comme un booléen `actif`) apporte souvent peu de gain.
- À éviter sur les tables à très forte fréquence d'écriture et peu lues, où le coût de maintenance de l'index dépasse le bénéfice en lecture.

## Points importants

- Un index accélère la lecture mais ralentit l'écriture — ce n'est jamais un gain sans contrepartie, c'est un arbitrage à faire consciemment.
- `EXPLAIN` (ou `EXPLAIN ANALYZE`) permet de vérifier si le moteur utilise réellement un index plutôt que de le supposer.
- Un index composite (sur plusieurs colonnes) est efficace surtout si les colonnes sont utilisées dans le même ordre dans les requêtes — l'ordre des colonnes dans l'index compte.
- La clé primaire crée presque toujours un index automatiquement (souvent unique) : pas besoin de le recréer manuellement dans la plupart des moteurs.
