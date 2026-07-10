---
title: "Cache Redis"
description: "Cache-aside, TTL, invalidation de cache et structures de données Redis courantes : comment utiliser Redis pour soulager une base de données sous forte charge."
date: 2026-07-10
category: "Bases de données"
difficulty: "Intermédiaire"
tags: ["redis", "nosql", "bases-de-donnees", "php"]
summary: "Redis est une base clé-valeur en mémoire, utilisée principalement comme cache devant une base relationnelle. Le pattern cache-aside, un TTL bien choisi et une stratégie d'invalidation claire sont les trois piliers d'un cache Redis fiable."
bearMemory:
  - "Le pattern le plus courant est le **cache-aside** : l'application lit d'abord le cache, et ne va en base que si la donnée est absente (cache miss), pour la remettre ensuite en cache."
  - "Un TTL (Time To Live) évite qu'une donnée périmée reste indéfiniment en cache — c'est un filet de sécurité, pas une stratégie d'invalidation à elle seule."
  - "Invalider explicitement le cache à l'écriture (`DEL` la clé après un `UPDATE`) est plus fiable que d'attendre l'expiration du TTL pour refléter un changement immédiatement."
interviewQuestions:
  - q: "Que se passe-t-il si le cache et la base de données divergent ?"
    a: "C'est le risque principal du cache-aside : entre le moment où une donnée est modifiée en base et le moment où le cache est invalidé, une lecture peut renvoyer une valeur périmée. On limite ce risque en invalidant le cache immédiatement après chaque écriture (plutôt que de compter uniquement sur le TTL), et en acceptant qu'un TTL raisonnable serve de filet de sécurité pour les cas où l'invalidation explicite serait manquée."
  - q: "Pourquoi ne pas mettre un TTL infini sur toutes les clés en cache ?"
    a: "Sans TTL, une clé jamais invalidée explicitement (bug applicatif, oubli) resterait périmée indéfiniment en mémoire, et la mémoire de Redis se remplirait progressivement de données obsolètes. Un TTL raisonnable garantit qu'une donnée finit toujours par être rafraîchie, même en cas d'échec de l'invalidation explicite, au prix d'un cache miss occasionnel."
---

## Le problème

Une base de données relationnelle bien indexée reste plus lente qu'un accès en mémoire, surtout quand la même requête est exécutée des milliers de fois par seconde pour la même donnée peu volatile : le profil d'un utilisateur connecté, la liste des catégories d'un site, le classement d'un jeu. Recalculer ou relire cette information à chaque requête sollicite inutilement la base et peut la faire saturer sous forte charge, alors que la donnée n'a probablement pas changé depuis la dernière lecture.

## L'idée générale

Redis est une base **clé-valeur en mémoire**, extrêmement rapide, utilisée le plus souvent comme couche de cache devant une base relationnelle. Le pattern le plus répandu est le **cache-aside** (ou "lazy loading") :

1. L'application cherche d'abord la donnée dans Redis.
2. Si elle est présente (**cache hit**), elle est retournée directement, sans toucher la base.
3. Si elle est absente (**cache miss**), l'application va la chercher en base, puis la stocke dans Redis avant de la retourner, pour que la prochaine lecture soit un hit.

Deux mécanismes gardent le cache cohérent avec la source de vérité (la base) :

- Le **TTL** (Time To Live) : chaque clé expire automatiquement après une durée définie, garantissant qu'une donnée périmée ne reste jamais indéfiniment en cache.
- L'**invalidation explicite** : à chaque écriture en base, on supprime (ou on met à jour) la clé correspondante dans Redis, pour refléter le changement immédiatement plutôt que d'attendre l'expiration du TTL.

## Analogie du quotidien

Redis fonctionne comme un pense-bête collé sur votre bureau plutôt que d'aller rouvrir un classeur dans une armoire au fond du couloir. La première fois qu'on a besoin d'une information, on va la chercher dans l'armoire (la base), et on la note sur un post-it collé au bureau pour ne plus avoir à s'y déplacer la prochaine fois.

Le post-it a toutefois une date de péremption griffonnée dessus (le TTL) : passé ce délai, on le jette et on retourne vérifier l'armoire, au cas où l'information aurait changé. Et si on met soi-même à jour le dossier dans l'armoire, le réflexe est de jeter immédiatement le post-it obsolète plutôt que d'attendre qu'il expire tout seul.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant App as Application
    participant Cache as Redis
    participant DB as Base de données

    App->>Cache: GET user:42
    alt Cache hit
        Cache-->>App: Donnée trouvée
    else Cache miss
        Cache-->>App: (vide)
        App->>DB: SELECT * FROM users WHERE id = 42
        DB-->>App: Donnée
        App->>Cache: SET user:42 (valeur) EX 300
    end

    Note over App,DB: Plus tard, à l'écriture
    App->>DB: UPDATE users SET nom = 'Kevin' WHERE id = 42
    App->>Cache: DEL user:42
{{< /mermaid >}}

## Exemple de code

```sql
-- La source de vérité reste la base relationnelle
SELECT id, nom, email FROM users WHERE id = 42;
```

```php
// Pattern cache-aside en PHP avec l'extension Redis
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

function getUser(int $id, Redis $redis, PDO $pdo): array
{
    $cacheKey = "user:{$id}";
    $cached = $redis->get($cacheKey);

    if ($cached !== false) {
        return json_decode($cached, true); // cache hit
    }

    // cache miss : on va chercher la donnée en base
    $stmt = $pdo->prepare('SELECT id, nom, email FROM users WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $redis->setex($cacheKey, 300, json_encode($user)); // TTL de 5 minutes

    return $user;
}

function updateUserNom(int $id, string $nom, Redis $redis, PDO $pdo): void
{
    $stmt = $pdo->prepare('UPDATE users SET nom = :nom WHERE id = :id');
    $stmt->execute(['nom' => $nom, 'id' => $id]);

    $redis->del("user:{$id}"); // invalidation immédiate du cache
}
```

```
# Quelques structures de données Redis courantes
SET session:42 "..."          # chaîne simple : session, compteur, cache d'objet sérialisé
EXPIRE session:42 3600         # TTL sur n'importe quelle clé
HSET user:42 nom "Kevin" role "admin"   # hash : objet structuré (équivalent d'une ligne)
LPUSH notifications:42 "Nouveau message"  # liste : file d'événements récents
SADD tags:article:7 "sql" "redis"         # set : appartenance sans doublon
ZADD classement 1500 "joueur:42"          # sorted set : classement trié par score
```

## Quand utiliser Redis en cache ?

- Sur des données lues très fréquemment et modifiées relativement rarement (profils, configuration, catalogue).
- Pour soulager une base de données sous forte charge en lecture, sans devoir la faire grossir ou la répliquer immédiatement.
- Pour des besoins allant au-delà du simple cache : sessions utilisateur, compteurs en temps réel, files d'attente légères, classements (sorted sets).
- Moins adapté comme source de vérité unique pour des données critiques nécessitant des garanties transactionnelles fortes et une persistance stricte comparable à un moteur relationnel — Redis reste avant tout une couche de vitesse, pas un remplacement de la base principale.

## Points importants

- Le cache-aside n'élimine pas totalement le risque d'incohérence temporaire : entre l'écriture en base et l'invalidation du cache, une lecture concurrente peut voir une donnée périmée pendant une fenêtre très courte.
- Toujours définir un TTL, même généreux, comme filet de sécurité en complément de l'invalidation explicite : ça évite qu'un oubli d'invalidation ne laisse une donnée obsolète indéfiniment.
- Redis persiste optionnellement sur disque (RDB, AOF), mais son cas d'usage principal reste la vitesse en mémoire : ne pas s'appuyer dessus comme unique copie durable d'une donnée critique.
- Le choix de la structure de données (string, hash, list, set, sorted set) influence directement les opérations possibles et la performance — un hash est souvent préférable à une string JSON quand on doit lire ou modifier un seul champ sans recharger tout l'objet.
