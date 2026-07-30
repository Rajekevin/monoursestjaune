---
title: "PHP 8.1 : ce qui change vraiment"
description: "Enums, propriétés readonly, fibers, never, first-class callable syntax, intersection types : les vraies nouveautés de PHP 8.1, chacune avec un exemple avant/après."
date: 2026-07-30
category: "Sécurité & Performance"
difficulty: "Intermédiaire"
tags: ["php", "php8", "langage", "nouveautes"]
summary: "PHP 8.1 a introduit plusieurs fonctionnalités qui changent réellement la façon d'écrire du code robuste : les enums, les propriétés en lecture seule, les fibers, le type never, la syntaxe de callable de première classe, et les types d'intersection."
bearMemory:
  - "Les **enums** remplacent les constantes de classe éparpillées par un type à part entière, vérifié par le moteur PHP — fini les chaînes ou entiers magiques sans garantie de valeur valide."
  - "**readonly** interdit la modification d'une propriété après son initialisation dans le constructeur : c'est l'immutabilité imposée par le langage, pas seulement par convention."
  - "Les **fibers** sont une brique bas niveau pour la concurrence coopérative — la plupart des développeurs ne les manipulent jamais directement, mais elles servent de fondation aux frameworks asynchrones modernes (comme certaines parties de Symfony ou ReactPHP/AMPHP)."
interviewQuestions:
  - q: "Quel problème les propriétés readonly résolvent-elles ?"
    a: "Avant PHP 8.1, rendre une propriété immuable après construction demandait soit de la déclarer privée avec un simple getter (sans garantie que la classe elle-même ne la modifie pas ailleurs), soit d'écrire manuellement une exception dans un setter. readonly impose cette immutabilité directement au niveau du langage : toute tentative de réassignation en dehors du constructeur déclenche une erreur, sans code supplémentaire à écrire ni à maintenir."
  - q: "Quelle différence entre un enum PHP et une classe avec des constantes ?"
    a: "Une constante de classe est une simple valeur (chaîne ou entier) : rien n'empêche de passer une valeur invalide à une fonction qui l'attend, puisque le type déclaré reste string ou int. Un enum est un vrai type : une fonction qui type-hint un enum ne peut recevoir qu'une des valeurs déclarées par cet enum, vérifiée par PHP lui-même. Les enums peuvent aussi porter des méthodes et implémenter des interfaces, ce qu'une constante ne permet pas."
  - q: "À quoi servent les fibers, concrètement ?"
    a: "Les fibers permettent d'interrompre l'exécution d'une fonction PHP à un point donné, de rendre la main à l'appelant, puis de reprendre exactement où elle s'était arrêtée. C'est une brique bas niveau qui sert de fondation à la programmation asynchrone en PHP — la plupart des développeurs ne créent jamais de Fiber directement, mais les frameworks et bibliothèques asynchrones (gestion de coroutines, I/O non bloquantes) s'appuient dessus en interne."
---

## Le problème

Chaque nouvelle version majeure de PHP fait l'objet d'un article de blog listant "toutes les nouveautés", souvent difficile à distinguer entre ce qui change vraiment la façon d'écrire du code et ce qui relève du détail interne ou de la niche. En entretien, on attend une réponse précise et factuelle sur PHP 8.1 : quelles fonctionnalités existent réellement dans cette version, à quoi elles servent, et quel problème concret elles résolvent — pas une liste approximative mélangeant plusieurs versions du langage.

## L'idée générale

PHP 8.1 (sorti fin 2021) a introduit six changements qui modifient réellement la manière d'écrire du code PHP robuste et expressif : les **enums**, les propriétés **readonly**, les **fibers**, le type de retour **never**, la syntaxe de **callable de première classe**, et les **types d'intersection**. Chacun répond à un manque précis du langage, présent depuis longtemps.

## Analogie du quotidien

PHP 8.1, c'est comme une mise à jour d'un atelier de menuiserie qui ne change pas le bois utilisé, mais qui ajoute des outils précis pour des tâches jusque-là bricolées à la main. Avant, pour garantir qu'une pièce de bois ne bouge plus une fois assemblée, il fallait la clouer soi-même à plusieurs endroits en espérant ne rien oublier (l'équivalent d'une convention de code pour l'immutabilité). Avec `readonly`, l'établi lui-même refuse de bouger la pièce une fois qu'elle est fixée — ce n'est plus une discipline à respecter, c'est une contrainte physique de l'outil.

## Diagramme

{{< mermaid >}}
flowchart LR
    A[PHP 8.1] --> B[Enums]
    A --> C[readonly properties]
    A --> D[Fibers]
    A --> E["never return type"]
    A --> F["First-class callable syntax"]
    A --> G["Intersection types"]

    B --> B1[Type sûr pour un ensemble fixe de valeurs]
    C --> C1[Immutabilité imposée par le langage]
    D --> D1[Brique bas niveau pour la concurrence coopérative]
    E --> E1[Une fonction qui ne retourne jamais normalement]
    F --> F1[Créer une closure depuis une méthode existante, sans wrapper]
    G --> G1[Un paramètre qui doit respecter plusieurs interfaces à la fois]
{{< /mermaid >}}

## Exemple de code

### Enums

**Avant PHP 8.1** (constantes de classe, sans garantie de type) :

```php
<?php
class StatutCommande
{
    const EN_ATTENTE = 'en_attente';
    const EXPEDIEE = 'expediee';
    const LIVREE = 'livree';
}

function changerStatut(string $statut): void
{
    // Rien n'empêche d'appeler changerStatut('nimporte_quoi')
}
```

**Avec PHP 8.1** :

```php
<?php
enum StatutCommande: string
{
    case EnAttente = 'en_attente';
    case Expediee = 'expediee';
    case Livree = 'livree';

    public function libelle(): string
    {
        return match ($this) {
            self::EnAttente => 'En attente',
            self::Expediee => 'Expédiée',
            self::Livree => 'Livrée',
        };
    }
}

function changerStatut(StatutCommande $statut): void
{
    // Seule une valeur valide de l'enum peut être passée ici, vérifié par PHP
}

changerStatut(StatutCommande::Expediee);
```

### Propriétés readonly

**Avant PHP 8.1** (immutabilité par convention uniquement) :

```php
<?php
final class Prix
{
    private float $montant;

    public function __construct(float $montant)
    {
        $this->montant = $montant;
    }

    public function montant(): float
    {
        return $this->montant;
        // Rien n'empêche une autre méthode de la classe de modifier $this->montant plus tard
    }
}
```

**Avec PHP 8.1** :

```php
<?php
final class Prix
{
    public function __construct(
        public readonly float $montant,
    ) {}
}

$prix = new Prix(42.0);
// $prix->montant = 100.0; // Error: Cannot modify readonly property Prix::$montant
```

### Fibers

**Avant PHP 8.1**, suspendre puis reprendre une fonction au milieu de son exécution nécessitait des générateurs (limités à `yield`) ou des bibliothèques externes s'appuyant sur des extensions bas niveau.

**Avec PHP 8.1** :

```php
<?php
$fiber = new Fiber(function (): void {
    echo "Début\n";
    $valeur = Fiber::suspend('pause');
    echo "Reprise avec : $valeur\n";
});

$resultatSuspension = $fiber->start(); // affiche "Début", puis suspend
echo "Reçu du fiber : $resultatSuspension\n"; // "pause"
$fiber->resume('valeur reprise'); // affiche "Reprise avec : valeur reprise"
```

Les fibers sont une brique de bas niveau : en pratique, la plupart des développeurs les utilisent indirectement, via un framework ou une bibliothèque asynchrone construite dessus.

### Le type never

**Avant PHP 8.1**, rien ne permettait d'exprimer dans la signature qu'une fonction ne retourne jamais normalement (elle lève systématiquement une exception ou termine le script) :

```php
<?php
function echouer(string $message)
{
    throw new RuntimeException($message);
    // Le type de retour reste ambigu pour les outils d'analyse statique
}
```

**Avec PHP 8.1** :

```php
<?php
function echouer(string $message): never
{
    throw new RuntimeException($message);
}

function traiter(?string $valeur): string
{
    if ($valeur === null) {
        echouer('Valeur manquante');
    }

    return $valeur; // Les analyseurs statiques comprennent que $valeur est forcément string ici
}
```

### First-class callable syntax

**Avant PHP 8.1**, référencer une méthode existante comme callable demandait une chaîne ou un tableau, sans vérification à l'écriture :

```php
<?php
$callable = 'strlen';
$callableMethode = [$objet, 'maMethode'];
```

**Avec PHP 8.1** :

```php
<?php
$callable = strlen(...);
$callableMethode = $objet->maMethode(...);

$longueurs = array_map(strlen(...), ['a', 'bb', 'ccc']);
```

Cette syntaxe est vérifiée par le moteur PHP au moment de l'écriture (la méthode ou fonction doit exister), contrairement aux chaînes ou tableaux, qui échouent seulement à l'exécution.

### Intersection types

**Avant PHP 8.1**, un paramètre ne pouvait exiger qu'un seul type à la fois — impossible de dire "cet objet doit implémenter à la fois `Countable` et `Iterator`" sans créer une interface dédiée qui combine les deux artificiellement.

**Avec PHP 8.1** :

```php
<?php
function traiter(Countable&Iterator $collection): void
{
    // $collection doit implémenter à la fois Countable ET Iterator
    echo count($collection);
}
```

## Quand se pencher sur PHP 8.1 ?

- Au démarrage d'un nouveau projet : les enums et les propriétés readonly changent souvent la façon de modéliser des objets de valeur et des ensembles fermés de constantes — autant les adopter dès la conception plutôt que de migrer plus tard.
- Lors d'une montée de version d'un projet existant : readonly et never demandent une vérification manuelle des classes concernées (une propriété readonly ne peut plus être modifiée après coup, y compris par du code qui en dépendait implicitement).
- En entretien technique, quand la question porte spécifiquement sur "les nouveautés de PHP récentes" : préciser explicitement la version évite de mélanger des fonctionnalités d'autres versions (comme les *named arguments* ou les *union types*, qui datent de PHP 8.0, ou les *enums* readonly par défaut ou les classes readonly, arrivées seulement en PHP 8.2 et 8.3).
- Pour les fibers spécifiquement : rarement utile en usage direct dans du code applicatif classique — pertinent surtout si vous évaluez ou contribuez à un framework ou une bibliothèque asynchrone.

## Points importants

- Les enums PHP 8.1 existent en deux variantes : les *pure enums* (sans valeur associée) et les *backed enums* (avec une valeur `string` ou `int` associée à chaque cas, comme dans l'exemple ci-dessus) — seuls les backed enums peuvent être convertis depuis/vers une valeur scalaire (`from()`, `tryFrom()`).
- `readonly` s'applique à une propriété typée : elle ne peut être assignée qu'une seule fois, depuis l'intérieur de la classe qui la déclare (typiquement le constructeur) — toute tentative ultérieure, même depuis une méthode de la même classe, lève une erreur.
- Ne pas confondre avec des fonctionnalités de versions voisines : les classes entièrement `readonly` (au niveau de la classe, pas juste de la propriété) datent de PHP 8.2, tout comme les types autonomes `true`/`false`/`null`. Les *first-class enum in const expressions* et d'autres raffinements arrivent dans des versions encore plus récentes.
- Ces fonctionnalités sont indépendantes les unes des autres : on peut très bien adopter les enums et readonly sans jamais toucher aux fibers, qui répondent à un besoin beaucoup plus spécifique (construire des mécanismes de concurrence coopérative).
