---
title: "Optimiser les performances PHP"
description: "OPcache, requêtes N+1, profiling : comment identifier et corriger les vrais goulots d'étranglement d'une application PHP, sans deviner."
date: 2026-07-30
category: "Sécurité & Performance"
difficulty: "Intermédiaire"
tags: ["performance", "php", "opcache", "profiling", "sql"]
summary: "La majorité des lenteurs d'une application PHP viennent de quelques causes récurrentes : OPcache mal configuré, requêtes N+1 invisibles derrière un ORM, ou optimisation menée sans mesure préalable. Profiler avant d'optimiser évite de perdre du temps sur un problème qui n'existe pas."
bearMemory:
  - "OPcache met en cache le **bytecode compilé** des fichiers PHP, pas le résultat des requêtes ou des calculs : il évite de re-parser et re-compiler le même code à chaque requête HTTP."
  - "Le problème N+1 est presque toujours **invisible dans le code**, visible uniquement dans les logs SQL ou un profiler : une boucle propre en apparence peut cacher des centaines de requêtes."
  - "Ne jamais optimiser sans avoir mesuré d'abord : l'intuition sur *où* se trouve le goulot d'étranglement est fausse plus souvent qu'on ne le pense."
interviewQuestions:
  - q: "Qu'est-ce qu'OPcache et pourquoi améliore-t-il les performances ?"
    a: "OPcache est une extension PHP qui met en cache en mémoire le bytecode déjà compilé de chaque script PHP. Sans lui, PHP relit, analyse et recompile le fichier source à chaque requête HTTP, même si le code n'a pas changé depuis la requête précédente. Avec OPcache activé, ce travail de compilation n'est fait qu'une fois, ce qui réduit sensiblement le temps de traitement de chaque requête, en particulier sur des applications avec beaucoup de fichiers ou un framework lourd."
  - q: "Qu'est-ce que le problème N+1 et comment le détecter ?"
    a: "C'est une situation où une requête initiale récupère N enregistrements, puis une requête supplémentaire est exécutée pour chacun d'eux afin de charger une donnée liée — soit N+1 requêtes au total au lieu d'une ou deux. Il se détecte en activant le logging des requêtes SQL (ou un outil comme le Symfony Profiler, Laravel Debugbar, ou un simple compteur de requêtes) et en observant si leur nombre grandit proportionnellement à la taille des données affichées."
  - q: "Pourquoi faut-il profiler avant d'optimiser ?"
    a: "Parce que l'intuition sur l'origine d'une lenteur est souvent fausse : un développeur peut passer des heures à optimiser un algorithme alors que 90% du temps de réponse vient en réalité d'une requête SQL mal indexée ou d'un appel réseau externe. Un profiler donne une mesure objective de la répartition du temps, ce qui permet de concentrer l'effort là où le gain sera réellement significatif."
---

## Le problème

Une application PHP qui répond lentement pousse souvent à une réaction instinctive : réécrire une boucle, ajouter du cache un peu partout, changer de framework. Ce genre d'optimisation "au feeling" corrige parfois un vrai problème par hasard, mais tout aussi souvent, elle rend le code plus complexe sans améliorer réellement le temps de réponse — parce que le vrai goulot d'étranglement se trouvait ailleurs.

Les lenteurs PHP ont des causes récurrentes et bien identifiées : un moteur qui recompile le code à chaque requête, un ORM qui exécute silencieusement des centaines de petites requêtes SQL au lieu d'une seule, ou tout simplement l'absence de toute mesure avant de se lancer dans une optimisation.

## L'idée générale

Trois leviers couvrent la grande majorité des gains de performance PHP en usage courant.

**OPcache.** PHP est un langage interprété : sans cache, chaque requête HTTP oblige le moteur à relire le fichier source, l'analyser (parsing) et le compiler en bytecode avant de l'exécuter — un travail répété inutilement si le fichier n'a pas changé depuis la requête précédente. OPcache conserve ce bytecode compilé en mémoire partagée, pour toutes les requêtes suivantes, jusqu'à ce que le fichier source soit modifié. Sur une application avec un framework et de nombreux fichiers, l'effet est souvent immédiat et significatif, pour un coût de configuration minimal.

**Le problème N+1.** Quand on affiche une liste d'éléments (des articles, par exemple) et que, pour chacun, on charge séparément une donnée liée (l'auteur de chaque article), le code exécute une requête pour récupérer la liste, puis une requête supplémentaire par élément — soit N+1 requêtes pour N éléments. Avec 20 articles, ça fait 21 requêtes là où 2 suffiraient. Le problème est particulièrement insidieux avec un ORM, dont le *lazy loading* déclenche des requêtes de façon transparente, sans que le code source laisse deviner combien de requêtes SQL sont réellement exécutées.

**Profiler avant d'optimiser.** Un profiler (Xdebug, Blackfire, ou même un simple chronométrage manuel autour de sections suspectes) mesure objectivement où le temps est réellement passé : dans une boucle CPU-intensive, dans des appels SQL répétés, dans un appel réseau externe lent. Sans cette mesure, l'optimisation devient une suite de paris — parfois gagnants, souvent une perte de temps sur un composant qui n'était de toute façon pas le facteur limitant.

## Analogie du quotidien

Optimiser sans profiler, c'est comme diagnostiquer une panne de voiture en changeant des pièces au hasard parce que "ça pourrait être ça" — les bougies, puis la batterie, puis le filtre à air — sans jamais brancher la valise de diagnostic électronique. On finit parfois par tomber sur la bonne pièce, après beaucoup de temps et d'argent dépensés inutilement sur des pièces qui fonctionnaient très bien.

Le profiler, c'est la valise de diagnostic : elle indique précisément quel capteur remonte une valeur anormale, avant même d'ouvrir le capot. OPcache et le problème N+1, dans cette analogie, sont deux pannes extrêmement courantes et bien documentées — l'équivalent d'une bougie encrassée ou d'une durite mal serrée — qu'un bon garagiste vérifie en priorité avant de chercher plus loin.

## Diagramme

{{< mermaid >}}
flowchart TD
    A[Application lente] --> B{A-t-on profilé ?}
    B -->|Non| C[Profiler d'abord : Xdebug / Blackfire / logs SQL]
    C --> B
    B -->|Oui| D{Où le temps est-il passé ?}
    D -->|Compilation répétée du code| E[Activer / configurer OPcache]
    D -->|Beaucoup de petites requêtes SQL| F[Corriger le N+1 : eager loading / jointure]
    D -->|Calcul CPU intensif| G[Optimiser l'algorithme ou mettre en cache le résultat]
    D -->|Appel réseau externe lent| H[Cache, timeout, appel asynchrone]
    E --> I[Mesurer à nouveau]
    F --> I
    G --> I
    H --> I
    I --> J{Amélioration suffisante ?}
    J -->|Non| B
    J -->|Oui| K[Terminé]
{{< /mermaid >}}

## Exemple de code

### Code vulnérable

```php
<?php
// Problème N+1 : une requête pour les articles, puis une par article pour l'auteur
function afficherArticlesAvecAuteur(PDO $pdo): array
{
    $stmt = $pdo->query('SELECT id, titre, auteur_id FROM articles LIMIT 20');
    $articles = $stmt->fetchAll();

    foreach ($articles as &$article) {
        // Exécutée 20 fois : une requête SQL par article affiché
        $stmtAuteur = $pdo->prepare('SELECT nom FROM auteurs WHERE id = ?');
        $stmtAuteur->execute([$article['auteur_id']]);
        $article['auteur_nom'] = $stmtAuteur->fetchColumn();
    }

    return $articles; // 21 requêtes exécutées au total
}
```

```ini
; php.ini : OPcache désactivé ou mal configuré
opcache.enable=0
```

### Code corrigé

```php
<?php
// Une seule requête, via une jointure, au lieu de 21
function afficherArticlesAvecAuteur(PDO $pdo): array
{
    $sql = '
        SELECT a.id, a.titre, u.nom AS auteur_nom
        FROM articles a
        JOIN auteurs u ON u.id = a.auteur_id
        LIMIT 20
    ';
    $stmt = $pdo->query($sql);

    return $stmt->fetchAll(); // 1 requête au total
}
```

```ini
; php.ini : OPcache activé et dimensionné pour l'application
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0 ; en production : désactive la vérification à chaque requête,
                                ; le cache doit alors être vidé explicitement à chaque déploiement
```

## Quand s'en préoccuper ?

- Dès la mise en production : OPcache doit être activé et correctement dimensionné (assez de mémoire et de slots de fichiers pour couvrir tout le code de l'application) — c'est une des optimisations les moins coûteuses et les plus impactantes qui existent.
- Dès qu'une page affiche une liste d'éléments accompagnés d'une donnée liée (auteur, catégorie, statistiques) : c'est le terrain classique du problème N+1, particulièrement avec un ORM en *lazy loading* par défaut.
- Avant toute session d'optimisation, systématiquement : profiler d'abord, corriger ensuite, puis mesurer à nouveau pour confirmer le gain réel — sans cette boucle, on ne sait jamais si le changement a vraiment aidé.
- Lors d'une revue de code touchant une boucle qui interroge la base de données ou un service externe à chaque itération : c'est le signal le plus fiable pour repérer un N+1 avant qu'il n'atteigne la production.

## Points importants

- `opcache.validate_timestamps=0` accélère encore les choses en production, mais impose de vider le cache OPcache explicitement à chaque déploiement (sinon l'ancien code reste servi) — une étape à automatiser dans le pipeline de déploiement.
- La plupart des ORM (Doctrine, Eloquent) proposent un mécanisme d'*eager loading* (`with()` en Eloquent, `JOIN`/fetch en Doctrine) qui résout le N+1 en une seule requête ou un nombre fixe de requêtes, indépendant du nombre d'éléments affichés.
- Le cache applicatif (Redis, Memcached) et OPcache répondent à des problèmes différents : OPcache évite de recompiler du code, un cache applicatif évite de recalculer ou re-récupérer une donnée coûteuse (résultat de requête, appel API externe). Les deux sont complémentaires, pas interchangeables.
- Une optimisation qui complexifie le code sans gain mesurable n'est pas une optimisation : mesurer avant/après avec les mêmes conditions de charge est la seule façon de valider qu'un changement a réellement amélioré les performances.
