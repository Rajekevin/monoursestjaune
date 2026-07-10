---
title: "Transactions ACID"
description: "Atomicité, Cohérence, Isolation, Durabilité : les quatre garanties ACID expliquées avec un exemple de virement bancaire, diagramme de séquence et code SQL."
date: 2026-07-10
category: "Bases de données"
difficulty: "Intermédiaire"
tags: ["sql", "transactions", "acid", "bases-de-donnees"]
summary: "Une transaction regroupe plusieurs opérations en un bloc tout-ou-rien. Les propriétés ACID — Atomicité, Cohérence, Isolation, Durabilité — garantissent qu'elle ne laisse jamais la base dans un état incohérent, même en cas de panne ou d'accès concurrent."
bearMemory:
  - "ACID = **A**tomicité (tout ou rien), **C**ohérence (les règles restent respectées), **I**solation (les transactions ne se marchent pas dessus), **D**urabilité (une fois validé, c'est définitif)."
  - "Une transaction se termine toujours par un `COMMIT` (on valide) ou un `ROLLBACK` (on annule tout) — jamais un état intermédiaire persistant."
  - "Le cas d'école : un virement bancaire. Débiter un compte sans créditer l'autre est un état incohérent que ACID interdit."
interviewQuestions:
  - q: "Que se passe-t-il si le serveur plante juste après un COMMIT ?"
    a: "Grâce à la Durabilité (le D d'ACID), les données validées par un COMMIT sont garanties persistées, généralement via un journal des transactions (write-ahead log) écrit sur disque avant même que la transaction soit confirmée au client. Même si le serveur redémarre juste après, les changements validés sont retrouvés au redémarrage — rien n'est perdu."
  - q: "Quelle différence entre Atomicité et Isolation ?"
    a: "L'Atomicité concerne une seule transaction : soit toutes ses opérations réussissent, soit aucune n'est appliquée — pas d'état intermédiaire. L'Isolation concerne plusieurs transactions concurrentes : elle garantit qu'une transaction en cours ne voit pas les effets partiels d'une autre transaction non encore validée. L'une protège la cohérence interne d'une transaction, l'autre protège les transactions les unes des autres."
---

## Le problème

Imaginez un virement bancaire de 100 euros entre deux comptes : débiter le compte A, puis créditer le compte B. Ce sont deux opérations distinctes. Si le serveur plante juste après le débit et avant le crédit — panne électrique, crash applicatif, coupure réseau — le compte A a perdu 100 euros qui n'existent plus nulle part. La base est dans un état incohérent, et personne ne s'en aperçoit avant qu'un client ne s'en plaigne.

Ce problème existe dès qu'une opération métier nécessite **plusieurs écritures liées**. Sans garantie particulière, chaque écriture est indépendante et vulnérable à toute interruption entre les deux.

## L'idée générale

Une transaction regroupe plusieurs opérations en un seul bloc **tout ou rien**. Les propriétés ACID définissent les garanties que ce bloc doit respecter :

- **Atomicité** : soit toutes les opérations de la transaction réussissent, soit aucune n'est appliquée. Pas de virement à moitié fait.
- **Cohérence** : la transaction fait passer la base d'un état valide à un autre état valide, en respectant toutes les contraintes (clés étrangères, contraintes `CHECK`, unicité...).
- **Isolation** : les transactions concurrentes ne voient pas les états intermédiaires les unes des autres — le niveau exact de cette garantie dépend du niveau d'isolation choisi (voir l'article dédié).
- **Durabilité** : une fois la transaction validée (`COMMIT`), les changements survivent à toute panne — ils sont écrits de façon persistante, généralement via un journal des transactions.

## Analogie du quotidien

Une transaction, c'est comme signer un contrat de vente immobilière chez le notaire. Le vendeur ne remet pas les clés avant d'avoir reçu l'argent, et l'acheteur ne paie pas avant d'avoir la garantie de recevoir les clés. Les deux actions — payer et transférer la propriété — sont liées : soit elles ont lieu ensemble, au même instant juridique (la signature), soit la vente n'a pas lieu du tout.

Il n'existe pas d'état intermédiaire où l'acheteur a payé mais où le bien n'est pas encore transféré : le notaire (l'équivalent du moteur transactionnel) garantit que tout se valide d'un bloc, ou que rien ne se passe si un élément manque.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant App as Application
    participant DB as Base de données
    App->>DB: BEGIN TRANSACTION
    App->>DB: UPDATE comptes SET solde = solde - 100 WHERE id = 'A'
    DB-->>App: OK
    App->>DB: UPDATE comptes SET solde = solde + 100 WHERE id = 'B'
    alt Les deux opérations réussissent
        DB-->>App: OK
        App->>DB: COMMIT
        DB-->>App: Transaction validée et durable
    else Une erreur survient (contrainte violée, panne...)
        DB-->>App: Erreur
        App->>DB: ROLLBACK
        DB-->>App: Aucune modification appliquée
    end
{{< /mermaid >}}

## Exemple de code

```sql
BEGIN;

UPDATE comptes SET solde = solde - 100 WHERE id = 'A';
UPDATE comptes SET solde = solde + 100 WHERE id = 'B';

-- Si le solde du compte A devient négatif, une contrainte CHECK
-- peut faire échouer la transaction et déclencher un ROLLBACK automatique
COMMIT;
```

```java
// Exemple avec JDBC : transaction explicite autour d'un virement
Connection conn = dataSource.getConnection();
try {
    conn.setAutoCommit(false);

    try (PreparedStatement debit = conn.prepareStatement(
            "UPDATE comptes SET solde = solde - ? WHERE id = ?")) {
        debit.setBigDecimal(1, montant);
        debit.setString(2, compteA);
        debit.executeUpdate();
    }

    try (PreparedStatement credit = conn.prepareStatement(
            "UPDATE comptes SET solde = solde + ? WHERE id = ?")) {
        credit.setBigDecimal(1, montant);
        credit.setString(2, compteB);
        credit.executeUpdate();
    }

    conn.commit();
} catch (SQLException e) {
    conn.rollback(); // annule tout : le compte A n'a jamais réellement perdu son argent
    throw e;
} finally {
    conn.setAutoCommit(true);
    conn.close();
}
```

## Quand utiliser une transaction ?

- Dès qu'une opération métier nécessite **plusieurs écritures liées** qui doivent réussir ou échouer ensemble (virement, création de commande avec décrément de stock, inscription avec création de profil).
- Pour garantir qu'une contrainte métier n'est jamais violée temporairement, même en cas d'erreur applicative en plein milieu du traitement.
- Moins pertinent pour une écriture unique et isolée, où l'atomicité est déjà garantie nativement par le moteur sans bloc `BEGIN`/`COMMIT` explicite.
- À manier avec précaution sur des transactions longues : elles retiennent des verrous et peuvent bloquer d'autres opérations concurrentes.

## Points importants

- Une transaction non terminée par `COMMIT` ou `ROLLBACK` explicite reste ouverte et retient des ressources — toujours s'assurer qu'elle se termine, y compris en cas d'exception (bloc `finally`).
- La Durabilité repose généralement sur un journal des transactions (write-ahead log) : les changements sont écrits dans ce journal avant d'être appliqués aux fichiers de données, ce qui permet de rejouer les transactions validées après un crash.
- ACID décrit des garanties, pas une implémentation unique : chaque moteur (PostgreSQL, MySQL/InnoDB...) les respecte avec ses propres mécanismes internes.
- Isolation et Atomicité sont souvent confondues : l'Atomicité protège une transaction en elle-même, l'Isolation protège les transactions les unes des autres (détaillé dans l'article sur l'isolation transactionnelle).
