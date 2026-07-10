---
title: "Réplication"
description: "Réplication maître-esclave et maître-maître, synchrone vs asynchrone : comment dupliquer une base de données pour la haute disponibilité et la scalabilité en lecture."
date: 2026-07-10
category: "Bases de données"
difficulty: "Avancé"
tags: ["bases-de-donnees", "postgresql", "mysql", "sql"]
summary: "La réplication duplique les données d'une base sur plusieurs serveurs, pour survivre à une panne et répartir la charge de lecture. Le choix entre réplication synchrone et asynchrone, et entre maître-esclave et maître-maître, détermine le compromis entre cohérence et disponibilité."
bearMemory:
  - "Réplication maître-esclave : un seul serveur accepte les écritures, plusieurs répliques servent les lectures — simple, mais le maître reste un point de défaillance unique pour l'écriture."
  - "Synchrone = cohérence forte mais latence d'écriture plus élevée ; asynchrone = écriture rapide mais risque de perte de données récentes en cas de panne du maître."
  - "La réplication scalabilise la lecture, pas l'écriture : toutes les répliques d'un maître-esclave restent limitées par la capacité d'écriture du maître unique."
interviewQuestions:
  - q: "Quelle différence entre réplication synchrone et asynchrone ?"
    a: "En réplication synchrone, le maître attend la confirmation qu'au moins une réplique a bien reçu et appliqué l'écriture avant de considérer la transaction validée — ça garantit qu'aucune donnée validée n'est perdue en cas de panne du maître, au prix d'une latence d'écriture plus élevée. En réplication asynchrone, le maître valide la transaction immédiatement sans attendre les répliques, ce qui est plus rapide mais crée un risque de perte des dernières écritures si le maître tombe avant que la réplique ait reçu la mise à jour."
  - q: "La réplication remplace-t-elle une sauvegarde (backup) ?"
    a: "Non. La réplication protège contre une panne matérielle en gardant une copie à jour sur un autre serveur, mais une erreur applicative (un DELETE ou UPDATE erroné) se propage aussi vers les répliques presque instantanément. Une sauvegarde, elle, capture un état à un instant T qu'on peut restaurer indépendamment des erreurs survenues après — les deux mécanismes sont complémentaires, pas interchangeables."
---

## Le problème

Une base de données qui tourne sur un seul serveur a deux limites structurelles. D'abord la **disponibilité** : si ce serveur tombe (panne matérielle, coupure réseau, maintenance), l'application entière devient indisponible jusqu'à sa remise en route. Ensuite la **scalabilité en lecture** : toutes les requêtes, qu'elles viennent de mille ou d'un million d'utilisateurs, sollicitent le même serveur unique, qui finit par saturer.

La réplication répond à ces deux problèmes en maintenant des copies synchronisées de la base sur plusieurs serveurs.

## L'idée générale

La réplication duplique les données d'un serveur **maître** (ou primaire) vers un ou plusieurs serveurs **répliques** (ou esclaves, secondaires). Deux axes structurent les choix de conception :

**Topologie** :
- **Maître-esclave** : un seul serveur accepte les écritures (le maître), les répliques ne servent que les lectures. Simple à raisonner, mais le maître reste un point de défaillance unique pour l'écriture.
- **Maître-maître** : plusieurs serveurs acceptent les écritures et se répliquent mutuellement. Plus résilient pour l'écriture, mais expose à des conflits si la même donnée est modifiée simultanément sur deux nœuds différents.

**Mode de synchronisation** :
- **Synchrone** : le maître attend la confirmation d'au moins une réplique avant de valider l'écriture — cohérence forte, latence plus élevée.
- **Asynchrone** : le maître valide immédiatement, la réplique se met à jour "un peu après" — écriture rapide, mais risque de perdre les toutes dernières écritures si le maître tombe avant d'avoir propagé les changements.

## Analogie du quotidien

La réplication fonctionne comme un secrétariat central avec des antennes régionales. Le secrétariat central (le maître) est le seul habilité à enregistrer officiellement un nouveau dossier. Les antennes régionales (les répliques) reçoivent une copie de chaque dossier pour pouvoir répondre aux demandes de consultation locales, sans que chaque citoyen n'ait à se déplacer jusqu'au siège central pour une simple lecture.

En mode synchrone, le secrétariat central attend la confirmation qu'au moins une antenne a bien reçu le dossier avant de le considérer comme officiellement enregistré — plus lent, mais aucune antenne ne se retrouve jamais en décalage avec un dossier qui a été confirmé. En mode asynchrone, le secrétariat central enregistre puis transmet la copie "quand il peut" — plus rapide au guichet, mais si un incendie détruit le siège central juste après un enregistrement non encore transmis, ce dossier est perdu pour de bon.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant App as Application
    participant M as Maître
    participant R1 as Réplique 1
    participant R2 as Réplique 2

    App->>M: INSERT INTO commandes (...)
    alt Réplication synchrone
        M->>R1: Propager l'écriture
        R1-->>M: Confirmation reçue
        M-->>App: Écriture validée (COMMIT)
        M-->>R2: Propager l'écriture (asynchrone en complément)
    else Réplication asynchrone
        M-->>App: Écriture validée (COMMIT) immédiatement
        M-->>R1: Propager l'écriture (un peu après)
        M-->>R2: Propager l'écriture (un peu après)
    end

    App->>R1: SELECT * FROM commandes (lecture répartie)
    R1-->>App: Résultat
{{< /mermaid >}}

## Exemple de code

```sql
-- Sur le maître PostgreSQL : autoriser un slot de réplication pour une réplique
SELECT * FROM pg_create_physical_replication_slot('replica_1');

-- Vérifier l'état de la réplication depuis le maître
SELECT client_addr, state, sync_state
FROM pg_stat_replication;

-- Côté réplique, une requête en lecture seule fonctionne normalement
SELECT id, nom FROM clients WHERE actif = true;

-- Une tentative d'écriture sur une réplique en lecture seule échoue explicitement
INSERT INTO clients (nom) VALUES ('Nouveau client');
-- ERROR: cannot execute INSERT in a read-only transaction
```

```java
// Exemple applicatif : router les écritures vers le maître, les lectures vers une réplique
DataSource masterDataSource = DataSourceFactory.forHost("db-master.internal");
DataSource replicaDataSource = DataSourceFactory.forHost("db-replica.internal");

public void creerCommande(Commande commande) {
    try (Connection conn = masterDataSource.getConnection()) {
        // toutes les écritures passent par le maître
        // ...
    }
}

public List<Commande> listerCommandes(int clientId) {
    try (Connection conn = replicaDataSource.getConnection()) {
        // les lectures peuvent être réparties sur les répliques
        // ...
    }
}
```

## Quand utiliser la réplication ?

- Pour la **haute disponibilité** : en cas de panne du maître, une réplique peut être promue rapidement pour reprendre le service (bascule ou "failover").
- Pour la **scalabilité en lecture** : répartir les requêtes `SELECT` sur plusieurs répliques quand elles dominent largement le trafic par rapport aux écritures.
- Pour isoler des charges de travail spécifiques : exécuter des rapports lourds ou des exports sur une réplique dédiée, sans ralentir le trafic transactionnel sur le maître.
- Moins utile — voire risquée sans réflexion — pour scalabiliser les **écritures** : la réplication maître-esclave classique ne résout pas ce problème ; il faut alors envisager du sharding ou une topologie multi-maître avec gestion de conflits.

## Points importants

- La réplication n'est pas une sauvegarde : une erreur applicative (suppression accidentelle) se propage aux répliques presque aussi vite qu'aux données originales.
- La réplication asynchrone introduit un délai (*replication lag*) : une lecture juste après une écriture sur une réplique peut encore renvoyer l'ancienne valeur — un point de vigilance classique pour des flux du type "créer puis relire immédiatement".
- Le maître-maître résout la disponibilité en écriture, mais impose une stratégie de résolution de conflits (dernier écrivain gagne, résolution applicative, ou usage d'identifiants distribués) qui ajoute une réelle complexité.
- En entretien, savoir expliquer le compromis cohérence/latence entre synchrone et asynchrone est souvent plus valorisé que de connaître par cœur la configuration exacte d'un moteur précis.
