---
title: "SQL vs NoSQL"
description: "Quand choisir une base relationnelle plutôt qu'une base NoSQL, et inversement. Panorama des types de bases NoSQL : document, clé-valeur, colonne, graphe."
date: 2026-07-10
category: "Bases de données"
difficulty: "Débutant"
tags: ["sql", "nosql", "bases-de-donnees", "postgresql"]
summary: "SQL et NoSQL ne s'opposent pas frontalement : ce sont deux familles d'outils avec des compromis différents entre cohérence, flexibilité de schéma et scalabilité. Le bon choix dépend de la forme des données et des contraintes de charge, pas d'une mode technique."
bearMemory:
  - "NoSQL ne veut pas dire 'sans SQL' à tout prix, mais 'Not Only SQL' : ce sont des bases pensées pour des modèles de données différents du relationnel."
  - "Quatre grandes familles NoSQL : document (MongoDB), clé-valeur (Redis), colonne (Cassandra), graphe (Neo4j) — chacune optimisée pour un pattern d'accès différent."
  - "Le relationnel excelle sur la cohérence et les relations complexes ; le NoSQL excelle souvent sur la scalabilité horizontale et un schéma flexible."
interviewQuestions:
  - q: "Dans quel cas choisirais-tu une base NoSQL plutôt que relationnelle ?"
    a: "Quand le schéma des données est très variable ou évolue souvent (documents hétérogènes), quand le volume et le débit imposent une distribution horizontale sur de nombreux serveurs, ou quand le pattern d'accès est très simple et prévisible (clé-valeur pour du cache). Le NoSQL est aussi pertinent quand les données n'ont pas besoin de relations complexes entre elles et que la cohérence stricte immédiate n'est pas critique."
  - q: "Une base NoSQL garantit-elle les propriétés ACID ?"
    a: "Cela dépend fortement du produit et du périmètre : beaucoup de bases NoSQL sacrifient une partie des garanties ACID (souvent la cohérence forte ou l'isolation) au profit de la disponibilité et de la scalabilité, selon le théorème CAP. Certaines, comme MongoDB depuis ses versions récentes, offrent des transactions ACID mais généralement avec des limites de performance ou de périmètre par rapport à un moteur relationnel dédié."
---

## Le problème

Une équipe démarre un projet avec une base relationnelle par habitude, puis se heurte à un schéma qui change sans arrêt (chaque type de produit a des attributs différents), ou à un volume de données qui dépasse ce qu'un seul serveur relationnel peut absorber. À l'inverse, une équipe qui choisit une base NoSQL par effet de mode se retrouve parfois à réimplémenter des jointures et des contraintes d'intégrité à la main, dans le code applicatif, alors qu'un moteur relationnel les aurait gérées nativement.

Le vrai problème n'est pas "SQL ou NoSQL" comme un choix idéologique, mais de comprendre **quel modèle de données et quelle charge** votre application impose, pour choisir l'outil qui y répond le mieux.

## L'idée générale

Les bases **relationnelles (SQL)** structurent les données en tables avec un schéma strict, des relations explicites via des clés, et des garanties transactionnelles fortes (ACID). Elles excellent quand les données ont une structure stable et des relations complexes à interroger.

Les bases **NoSQL** (Not Only SQL) regroupent plusieurs familles, chacune optimisée pour un usage différent :

- **Document** (MongoDB, CouchDB) : stocke des documents JSON/BSON flexibles, adaptés à des structures hétérogènes ou imbriquées (catalogue produits avec attributs variables).
- **Clé-valeur** (Redis, DynamoDB) : associe une clé à une valeur, extrêmement rapide pour des accès simples (cache, sessions, compteurs).
- **Colonne** (Cassandra, HBase) : optimisée pour écrire et lire de très gros volumes distribués sur de nombreux serveurs (séries temporelles, logs).
- **Graphe** (Neo4j) : modélise explicitement des relations complexes entre entités (réseaux sociaux, recommandations, détection de fraude).

La plupart des bases NoSQL sacrifient une partie de la cohérence stricte ou des relations natives au profit de la flexibilité de schéma et de la scalabilité horizontale (distribuer les données sur plusieurs serveurs).

## Analogie du quotidien

Choisir entre SQL et NoSQL, c'est comme choisir entre un classeur administratif et une boîte à archives libres. Le classeur (SQL) impose une structure : chaque document a sa place précise, dans un ordre défini, avec des références croisées fiables — parfait pour des dossiers officiels où la cohérence compte. La boîte à archives (NoSQL) accepte n'importe quel format de document, s'organise plus librement, et peut être dupliquée facilement dans plusieurs entrepôts pour être accessible partout rapidement — parfait pour du stockage massif et hétérogène où la rigidité du classeur deviendrait un obstacle.

Aucun des deux n'est "meilleur" dans l'absolu : le classeur est inadapté pour stocker des objets de formes très variées, la boîte à archives est inadaptée pour retrouver instantanément un dossier précis avec des règles strictes de cohérence.

## Diagramme

{{< mermaid >}}
flowchart TD
    Q{"Structure des données\nstable et relationnelle ?"}
    Q -->|Oui| Q2{"Cohérence forte\nrequise (ACID) ?"}
    Q -->|Non, schéma flexible| Doc["Base Document\n(MongoDB, CouchDB)"]
    Q2 -->|Oui| SQL["Base relationnelle\n(PostgreSQL, MySQL)"]
    Q2 -->|Non, accès simple\net très rapide| KV["Clé-valeur\n(Redis, DynamoDB)"]
    Q -->|Non, volumes massifs\ndistribués| Col["Colonne\n(Cassandra, HBase)"]
    Q -->|Non, relations\ntrès complexes| Graph["Graphe\n(Neo4j)"]
{{< /mermaid >}}

## Exemple de code

```sql
-- Modèle relationnel : structure fixe, jointure pour relier les entités
SELECT cl.nom, c.date_commande
FROM clients cl
JOIN commandes c ON c.client_id = cl.id
WHERE cl.id = 42;
```

```javascript
// Modèle document (MongoDB) : structure flexible, données imbriquées dans un seul document
db.commandes.find({ clientId: 42 });

// Chaque document peut avoir une structure légèrement différente sans migration de schéma
db.produits.insertOne({
  nom: "Clavier mécanique",
  attributs: { switchType: "brown", retroeclairage: true }
});
db.produits.insertOne({
  nom: "Livre",
  attributs: { auteur: "Victor Hugo", pages: 400 }
});
```

```php
// Exemple clé-valeur avec Redis : accès direct par clé, sans schéma ni jointure
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);
$redis->set('session:42', json_encode(['userId' => 42, 'role' => 'admin']), 3600);
$session = json_decode($redis->get('session:42'), true);
```

## Quand choisir SQL plutôt que NoSQL (et inversement) ?

- Choisir **SQL** quand les données ont une structure stable, des relations complexes à interroger, et que la cohérence transactionnelle est prioritaire (finance, gestion de commandes, comptabilité).
- Choisir **NoSQL document** quand le schéma varie beaucoup d'une entité à l'autre ou évolue fréquemment sans vouloir gérer de migrations lourdes.
- Choisir **NoSQL clé-valeur** pour du cache, des sessions, des compteurs : accès très rapides, structure minimale.
- Choisir **NoSQL colonne ou graphe** pour des besoins spécifiques : très gros volumes distribués, ou relations complexes au cœur du produit (recommandations, réseaux).
- Dans de nombreux systèmes réels, les deux coexistent : une base relationnelle pour le cœur métier, une base NoSQL en complément pour le cache ou un besoin précis.

## Points importants

- NoSQL n'est pas "plus moderne" ou "plus rapide" par nature : c'est un compromis différent, pas une évolution universelle du relationnel.
- Beaucoup de bases NoSQL ont ajouté des garanties transactionnelles ou du typage au fil du temps, et beaucoup de bases relationnelles ont ajouté du support JSON flexible — la frontière est moins nette qu'il y a dix ans.
- Le théorème CAP (Cohérence, Disponibilité, tolérance au Partitionnement) explique pourquoi les bases distribuées doivent souvent sacrifier une garantie pour privilégier les deux autres — c'est une clé de lecture utile pour comparer les moteurs NoSQL entre eux.
- Le bon réflexe en entretien : ne jamais répondre "SQL" ou "NoSQL" sans expliquer le compromis qui justifie le choix pour le cas précis posé.
