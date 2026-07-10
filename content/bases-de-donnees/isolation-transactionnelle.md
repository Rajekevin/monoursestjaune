---
title: "Isolation transactionnelle"
description: "Les quatre niveaux d'isolation SQL standard (Read Uncommitted, Read Committed, Repeatable Read, Serializable) et les anomalies qu'ils préviennent : dirty read, non-repeatable read, phantom read."
date: 2026-07-10
category: "Bases de données"
difficulty: "Avancé"
tags: ["sql", "transactions", "acid", "postgresql", "bases-de-donnees"]
summary: "Plusieurs transactions peuvent s'exécuter en même temps sur les mêmes données. Le niveau d'isolation choisi détermine ce qu'une transaction a le droit de voir des autres transactions en cours — un arbitrage entre cohérence stricte et performance."
bearMemory:
  - "Plus le niveau d'isolation monte (Read Uncommitted → Serializable), plus les garanties augmentent, mais plus le coût en verrous et en performance augmente aussi."
  - "Dirty read = lire une donnée non validée ; non-repeatable read = relire une donnée modifiée entre-temps ; phantom read = revoir un `SELECT` avec des lignes en plus."
  - "Read Committed est le niveau par défaut de la plupart des moteurs (PostgreSQL, Oracle, SQL Server) — pas Serializable, trop coûteux pour un usage général."
interviewQuestions:
  - q: "Quelle différence entre un non-repeatable read et un phantom read ?"
    a: "Un non-repeatable read survient quand une transaction relit la même ligne deux fois et obtient une valeur différente, parce qu'une autre transaction l'a modifiée et validée entre les deux lectures. Un phantom read survient quand une transaction ré-exécute le même SELECT avec critère (ex. WHERE statut = 'en_cours') et obtient un ensemble de lignes différent, parce qu'une autre transaction a inséré ou supprimé des lignes correspondant au critère entre-temps. Le premier porte sur une ligne existante qui change, le second sur l'apparition ou la disparition de lignes entières."
  - q: "Pourquoi ne pas toujours utiliser le niveau Serializable par défaut ?"
    a: "Serializable offre les garanties les plus fortes — le résultat est équivalent à une exécution strictement séquentielle des transactions — mais au prix de verrous plus larges et plus fréquents, ce qui augmente les blocages et les échecs de transaction à réessayer sous forte concurrence. Pour la majorité des cas d'usage, Read Committed offre un bon compromis entre cohérence et performance, ce qui explique qu'il soit le niveau par défaut de la plupart des moteurs."
---

## Le problème

Deux transactions peuvent s'exécuter en même temps sur les mêmes données : un utilisateur qui consulte le solde de son compte pendant qu'un virement est en cours de traitement, deux clients qui tentent de réserver la dernière place d'un événement au même instant. Sans règle claire, une transaction pourrait lire des données que l'autre est en train de modifier — et potentiellement s'annuler ensuite — menant à des décisions prises sur des informations qui n'ont jamais réellement existé.

Le SQL standard définit quatre **niveaux d'isolation** pour arbitrer ce compromis entre cohérence stricte et performance : plus l'isolation est forte, plus les garanties sont solides, mais plus le coût en verrous et en contention augmente.

## L'idée générale

Trois anomalies classiques peuvent survenir quand des transactions concurrentes ne sont pas suffisamment isolées :

- **Dirty read** (lecture sale) : lire une donnée modifiée par une autre transaction **non encore validée** — si cette transaction fait un `ROLLBACK`, la donnée lue n'a jamais réellement existé.
- **Non-repeatable read** (lecture non répétable) : relire la même ligne deux fois dans la même transaction et obtenir des valeurs différentes, parce qu'une autre transaction l'a modifiée et validée entre-temps.
- **Phantom read** (lecture fantôme) : ré-exécuter la même requête avec critère et obtenir un ensemble de lignes différent, parce que d'autres lignes correspondant au critère ont été insérées ou supprimées entre-temps.

Les quatre niveaux d'isolation standard SQL, du plus permissif au plus strict :

| Niveau | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| Read Uncommitted | Possible | Possible | Possible |
| Read Committed | Empêché | Possible | Possible |
| Repeatable Read | Empêché | Empêché | Possible (souvent atténué en pratique) |
| Serializable | Empêché | Empêché | Empêché |

## Analogie du quotidien

L'isolation transactionnelle, c'est comme consulter un document partagé pendant qu'un collègue le modifie. Au niveau le plus permissif (Read Uncommitted), vous voyez ses modifications en direct, même celles qu'il n'a pas encore enregistrées — et s'il annule son brouillon, vous avez lu des informations qui n'ont jamais existé officiellement. Au niveau Read Committed, vous ne voyez que ses versions déjà enregistrées, mais si vous rouvrez le document cinq minutes plus tard, il a peut-être changé entre-temps. Au niveau Serializable, c'est comme si vous aviez emprunté le document en exclusivité : personne d'autre ne peut le modifier tant que vous travaillez dessus, garantissant que ce que vous voyez au début et à la fin de votre lecture reste parfaitement cohérent.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant T1 as Transaction 1
    participant DB as Base de données
    participant T2 as Transaction 2

    T1->>DB: BEGIN
    T1->>DB: SELECT solde FROM comptes WHERE id = 'A' (lit 100€)
    T2->>DB: BEGIN
    T2->>DB: UPDATE comptes SET solde = 50 WHERE id = 'A'
    T2->>DB: COMMIT
    T1->>DB: SELECT solde FROM comptes WHERE id = 'A' (relit)
    Note over T1,DB: Read Committed : relit 50€ (non-repeatable read)<br/>Repeatable Read / Serializable : relit toujours 100€
    T1->>DB: COMMIT
{{< /mermaid >}}

## Exemple de code

```sql
-- Définir le niveau d'isolation pour une transaction en PostgreSQL
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT solde FROM comptes WHERE id = 'A'; -- lit 100€

-- (une autre transaction modifie et valide la ligne ici)

SELECT solde FROM comptes WHERE id = 'A'; -- relit toujours 100€ grâce à Repeatable Read

COMMIT;

-- Niveau Serializable : la transaction échoue explicitement en cas de conflit sérialisable
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- ... opérations ...
COMMIT; -- peut lever une erreur "could not serialize access", à réessayer côté application
```

```java
// Définir le niveau d'isolation via JDBC
Connection conn = dataSource.getConnection();
conn.setTransactionIsolation(Connection.TRANSACTION_REPEATABLE_READ);
conn.setAutoCommit(false);

try {
    // ... opérations métier ...
    conn.commit();
} catch (SQLException e) {
    conn.rollback();
    // En Serializable, prévoir une logique de retry sur les erreurs de sérialisation
    throw e;
}
```

## Quand utiliser chaque niveau d'isolation ?

- **Read Uncommitted** : quasiment jamais en production sur des données critiques ; utile tout au plus pour des rapports approximatifs tolérant l'incohérence, sur des moteurs qui l'implémentent réellement (MySQL le fait, PostgreSQL le traite comme Read Committed).
- **Read Committed** : le bon défaut pour la majorité des applications — évite les lectures sales à un coût de performance raisonnable.
- **Repeatable Read** : quand une transaction doit lire plusieurs fois les mêmes données et exige qu'elles ne changent pas en cours de route (calculs financiers, rapports cohérents).
- **Serializable** : pour les opérations les plus sensibles (réservation de stock limité, transferts financiers à fort enjeu), où même un phantom read est inacceptable — au prix d'une gestion de conflits à réessayer côté application.

## Points importants

- Le niveau d'isolation par défaut varie selon le moteur : Read Committed pour PostgreSQL, Oracle et SQL Server ; Repeatable Read pour MySQL/InnoDB.
- Une isolation plus stricte n'élimine pas la nécessité de gérer les erreurs : à Serializable, le moteur peut faire échouer une transaction en conflit plutôt que de la bloquer indéfiniment — l'application doit prévoir une logique de nouvelle tentative.
- L'isolation ne remplace pas les contraintes métier : un `SELECT ... FOR UPDATE` verrouille explicitement des lignes pour éviter des écritures concurrentes, complémentaire au niveau d'isolation choisi.
- Comprendre ces niveaux est une question classique d'entretien technique senior, car elle révèle si le candidat sait raisonner sur la concurrence, pas seulement sur des requêtes isolées.
