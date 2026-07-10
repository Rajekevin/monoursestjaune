---
title: "SQL expliqué simplement"
description: "SELECT, JOIN, WHERE, GROUP BY : les briques de base du langage SQL expliquées avec des exemples concrets, pour comprendre comment interroger une base relationnelle."
date: 2026-07-10
category: "Bases de données"
difficulty: "Débutant"
tags: ["sql", "bases-de-donnees", "postgresql", "mysql"]
summary: "SQL est le langage universel pour interroger une base relationnelle. Avec une poignée de mots-clés — SELECT, WHERE, JOIN, GROUP BY — on peut exprimer des questions complexes sur les données sans jamais écrire de boucle."
bearMemory:
  - "SQL décrit **quoi** obtenir, pas **comment** l'obtenir : c'est le moteur qui choisit la stratégie d'exécution."
  - "L'ordre d'écriture (`SELECT ... FROM ... WHERE ... GROUP BY ...`) n'est pas l'ordre d'exécution réel : le moteur évalue `FROM`/`JOIN` puis `WHERE` avant `SELECT`."
  - "`WHERE` filtre les lignes avant regroupement, `HAVING` filtre les groupes après `GROUP BY` : ce sont deux étages différents."
interviewQuestions:
  - q: "Quelle différence entre DELETE et TRUNCATE ?"
    a: "DELETE est une commande DML : elle supprime les lignes une par une, peut être filtrée avec un WHERE, déclenche les triggers associés, et peut être annulée avec un ROLLBACK dans une transaction. TRUNCATE est une commande DDL : elle vide la table entière d'un coup, réinitialise le compteur d'auto-incrément, ne peut pas être filtrée, et n'est généralement pas journalisée ligne par ligne — ce qui la rend beaucoup plus rapide sur de gros volumes, mais moins flexible et parfois non annulable selon le moteur."
  - q: "Quelle différence entre WHERE et HAVING ?"
    a: "WHERE filtre les lignes individuelles avant tout regroupement — il ne peut pas porter sur le résultat d'une fonction d'agrégation comme COUNT ou SUM. HAVING filtre les groupes après l'exécution de GROUP BY, et peut donc porter sur des agrégats, par exemple ne garder que les clients ayant passé plus de 5 commandes."
---

## Le problème

Sans langage de requête, interroger une base reviendrait à écrire du code procédural pour parcourir les données une par une : ouvrir la table, boucler sur chaque ligne, vérifier une condition, accumuler un résultat. Ce code serait long, répétitif, et surtout figé sur une stratégie d'exécution précise — impossible pour le moteur d'optimiser quoi que ce soit puisque tout est déjà écrit pas à pas.

SQL (Structured Query Language) résout ce problème en changeant de paradigme : on décrit **le résultat voulu**, pas la façon de l'obtenir. Le moteur analyse la requête et choisit lui-même la meilleure stratégie (quel index utiliser, dans quel ordre joindre les tables) pour y arriver.

## L'idée générale

Une poignée de mots-clés couvrent l'essentiel des besoins :

- `SELECT` : quelles colonnes (ou quelles expressions) on veut récupérer.
- `FROM` : de quelle(s) table(s) on part.
- `JOIN` : comment combiner plusieurs tables via leurs clés.
- `WHERE` : quelles lignes garder, avant tout regroupement.
- `GROUP BY` : comment regrouper les lignes pour calculer des agrégats (`COUNT`, `SUM`, `AVG`...).
- `HAVING` : quels groupes garder, après le regroupement.
- `ORDER BY` / `LIMIT` : dans quel ordre trier et combien de résultats retourner.

Un point souvent mal compris : l'ordre dans lequel on **écrit** ces clauses n'est pas l'ordre dans lequel le moteur les **exécute**. Il évalue d'abord `FROM`/`JOIN`, puis `WHERE`, puis `GROUP BY`, puis `HAVING`, et seulement à la fin `SELECT` et `ORDER BY`. C'est pour ça que `WHERE` ne peut pas utiliser un alias défini dans `SELECT`, mais `ORDER BY` le peut.

## Analogie du quotidien

Écrire une requête SQL, c'est comme remplir une fiche de commande précise pour un traiteur, plutôt que d'aller vous-même en cuisine. Vous ne dites pas "prends la casserole, allume le feu, verse l'huile" (le comment) — vous dites "je veux une salade de fruits, sans banane, pour 4 personnes" (le quoi). C'est le chef (le moteur SQL) qui décide comment organiser sa cuisine pour vous livrer ce résultat le plus efficacement possible.

## Diagramme

{{< mermaid >}}
flowchart LR
    A["FROM / JOIN\n(quelles tables, comment liées)"] --> B["WHERE\n(quelles lignes garder)"]
    B --> C["GROUP BY\n(comment regrouper)"]
    C --> D["HAVING\n(quels groupes garder)"]
    D --> E["SELECT\n(quelles colonnes retourner)"]
    E --> F["ORDER BY / LIMIT\n(tri et pagination)"]
{{< /mermaid >}}

## Exemple de code

```sql
-- Nombre de commandes par client, uniquement les clients actifs,
-- avec au moins 3 commandes, triés du plus actif au moins actif
SELECT
    cl.nom,
    COUNT(c.id) AS nb_commandes
FROM clients cl
JOIN commandes c ON c.client_id = cl.id
WHERE cl.actif = true
GROUP BY cl.nom
HAVING COUNT(c.id) >= 3
ORDER BY nb_commandes DESC
LIMIT 10;

-- DELETE : supprime les commandes annulées, filtrable et journalisé
DELETE FROM commandes WHERE statut = 'annulee';

-- TRUNCATE : vide toute la table de logs, réinitialise l'id, plus rapide
TRUNCATE TABLE logs_acces;
```

```java
// Exemple avec JDBC : exécuter une requête paramétrée
String sql = """
    SELECT nom, COUNT(*) AS nb_commandes
    FROM clients cl JOIN commandes c ON c.client_id = cl.id
    WHERE cl.actif = ?
    GROUP BY nom
    HAVING COUNT(*) >= ?
    """;

try (PreparedStatement stmt = connection.prepareStatement(sql)) {
    stmt.setBoolean(1, true);
    stmt.setInt(2, 3);
    ResultSet rs = stmt.executeQuery();
    while (rs.next()) {
        System.out.println(rs.getString("nom") + " : " + rs.getInt("nb_commandes"));
    }
}
```

## Quand utiliser SQL ?

- Dès qu'on interroge une base relationnelle : c'est le langage standard, portable (avec quelques variations) entre PostgreSQL, MySQL, SQL Server, Oracle...
- Pour exprimer des agrégations et des croisements de données (statistiques, tableaux de bord) sans écrire de boucle applicative.
- Pour garantir l'intégrité des opérations d'écriture (`INSERT`, `UPDATE`, `DELETE`) directement au niveau de la base, avec les garanties transactionnelles du moteur.
- Moins adapté pour des traitements très itératifs ou procéduraux complexes — dans ce cas, on combine SQL avec du code applicatif ou des procédures stockées.

## Points importants

- Toujours utiliser des requêtes préparées (paramètres liés) plutôt que de concaténer des chaînes : c'est la première ligne de défense contre l'injection SQL.
- `DELETE` peut être ciblé et annulé (transaction), `TRUNCATE` est une opération lourde et généralement irréversible — ne jamais les confondre en production.
- `GROUP BY` sans agrégat n'a pas de sens : chaque colonne du `SELECT` doit soit être dans le `GROUP BY`, soit être enveloppée dans une fonction d'agrégation.
- Un `JOIN` mal indexé peut transformer une requête simple en scan complet de deux tables : comprendre les jointures va de pair avec comprendre les index (voir l'article dédié).
