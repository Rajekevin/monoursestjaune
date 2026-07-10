---
title: "TDD expliqué simplement"
description: "Le Test-Driven Development inverse l'ordre naturel : on écrit le test avant le code. Cycle Red/Green/Refactor, analogie, diagramme et code PHP, JavaScript."
date: 2026-07-10
category: "Tests"
difficulty: "Intermédiaire"
tags: ["tdd", "tests", "unit-testing", "php", "javascript"]
summary: "Le TDD (Test-Driven Development) consiste à écrire un test qui échoue avant d'écrire le code qui le fait passer, puis à améliorer la structure une fois le comportement validé. Ce cycle court — Red, Green, Refactor — guide la conception au lieu de la vérifier après coup."
bearMemory:
  - "Le cycle TDD tient en trois mots : **Red** (test qui échoue), **Green** (code minimal qui le fait passer), **Refactor** (nettoyer sans changer le comportement)."
  - "En TDD, le test n'est pas une vérification a posteriori : il **précède** le code et guide sa conception."
  - "La règle d'or du Green : écrire le code **le plus simple possible** pour faire passer le test, jamais plus — la généralisation vient plus tard, poussée par de nouveaux tests."
interviewQuestions:
  - q: "Quelle différence entre TDD et le fait d'écrire des tests après le code ?"
    a: "Écrire des tests après coup vérifie un code déjà écrit — c'est utile, mais le test s'adapte souvent à l'implémentation existante, biais inclus. En TDD, le test est écrit en premier et c'est lui qui dicte l'interface et le comportement attendu du code à venir : le test façonne la conception plutôt que de simplement la valider a posteriori."
  - q: "Pourquoi écrire un test qui échoue avant d'écrire le code (l'étape Red) ?"
    a: "Voir le test échouer d'abord prouve que le test teste réellement quelque chose : s'il passait déjà sans code de production, il ne vérifierait rien d'utile, ou testerait le mauvais fichier. C'est une vérification du test lui-même avant de lui faire confiance pour valider le futur code."
  - q: "Le TDD garantit-il un code sans bug ?"
    a: "Non. Le TDD structure la façon d'écrire le code et produit une bonne couverture de test par construction, mais il ne protège que contre les cas que les tests couvrent explicitement. Un développeur qui oublie un cas limite au moment d'écrire le test aura un code TDD... qui ne le couvre pas non plus."
---

## Le problème

L'approche naturelle consiste à écrire d'abord le code, puis, si le temps le permet, à ajouter des tests après coup. Dans la pratique, "si le temps le permet" devient souvent "jamais" : une fois la fonctionnalité livrée, l'attention passe au ticket suivant. Et quand des tests sont écrits après coup, ils ont tendance à confirmer ce que le code fait déjà — y compris ses bugs — plutôt qu'à vérifier ce qu'il devrait faire.

Il manque un mécanisme qui force à clarifier le comportement attendu *avant* d'écrire la première ligne d'implémentation, et qui donne un signal objectif du moment où le travail est terminé.

## L'idée générale

Le TDD (Test-Driven Development) inverse l'ordre habituel : on écrit un test qui décrit le comportement attendu, on le voit échouer (puisque le code n'existe pas encore), puis on écrit le code minimal nécessaire pour le faire passer. Ce cycle se répète en trois étapes courtes :

- **Red** : écrire un test qui décrit un comportement pas encore implémenté. Il échoue — c'est normal et attendu, ça prouve que le test teste bien quelque chose.
- **Green** : écrire le code le plus simple possible pour faire passer ce test, sans se soucier de l'élégance. L'objectif est uniquement que la suite de tests soit au vert.
- **Refactor** : une fois le test au vert, nettoyer le code (noms, duplication, structure) sans changer son comportement. Les tests déjà écrits garantissent que rien ne casse pendant cette étape.

On répète ensuite ce cycle pour le comportement suivant. Chaque itération est volontairement petite — quelques minutes — ce qui garde un rythme rapide et un feedback immédiat.

## Analogie du quotidien

Le TDD, c'est comme se fixer un itinéraire avant de démarrer un trajet plutôt que de rouler et vérifier après coup si on est arrivé au bon endroit. On définit d'abord la destination précise (le test : *"je veux arriver ici"*), puis on choisit le chemin le plus direct pour y parvenir (le code minimal), puis, une fois arrivé, on peut ajuster l'itinéraire pour éviter les bouchons la prochaine fois (le refactoring) — sans jamais changer la destination elle-même.

Rouler d'abord et vérifier ensuite si on est au bon endroit fonctionne parfois, mais on ne le sait qu'après coup, une fois le trajet terminé.

## Diagramme

{{< mermaid >}}
flowchart TD
    A[Red: écrire un test qui échoue] --> B[Green: écrire le code minimal pour le faire passer]
    B --> C[Refactor: améliorer la structure, tests toujours au vert]
    C -->|nouveau comportement à ajouter| A
    C -->|fonctionnalité terminée| D[Fin du cycle]
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// Étape 1 - RED : on écrit le test avant que la classe existe
use PHPUnit\Framework\TestCase;

final class PanierTest extends TestCase
{
    public function testUnPanierVideATotalZero(): void
    {
        $panier = new Panier();

        $this->assertSame(0.0, $panier->total());
    }
}

// À ce stade, `Panier` n'existe pas : le test échoue (erreur de classe manquante).
```

```php
// Étape 2 - GREEN : le code minimal pour faire passer le test
final class Panier
{
    public function total(): float
    {
        return 0.0;
    }
}

// Le test passe. C'est volontairement simpliste : on n'anticipe rien de plus
// que ce que le test actuel exige.
```

```php
// On ajoute un nouveau test pour pousser le comportement plus loin (nouveau cycle RED)
public function testAjouterUnArticleAugmenteLeTotal(): void
{
    $panier = new Panier();

    $panier->ajouter(new Article('Livre', 15.0));

    $this->assertSame(15.0, $panier->total());
}
```

```php
// Étape GREEN suivante : le code évolue pour répondre au nouveau test,
// sans casser le précédent (`testUnPanierVideATotalZero` reste vert)
final class Panier
{
    /** @var Article[] */
    private array $articles = [];

    public function ajouter(Article $article): void
    {
        $this->articles[] = $article;
    }

    public function total(): float
    {
        return array_sum(array_map(fn (Article $a) => $a->prix(), $this->articles));
    }
}
```

### JavaScript

```javascript
// Étape 1 - RED : le test décrit un comportement qui n'existe pas encore
const { Panier } = require("./panier");

describe("Panier", () => {
  it("a un total de 0 quand il est vide", () => {
    const panier = new Panier();

    expect(panier.total()).toBe(0);
  });
});

// À ce stade, `./panier` n'existe même pas : le test échoue.
```

```javascript
// Étape 2 - GREEN : le code minimal pour faire passer le test
class Panier {
  total() {
    return 0;
  }
}

module.exports = { Panier };
```

```javascript
// Nouveau cycle RED : on pousse le comportement plus loin
it("additionne le prix des articles ajoutés", () => {
  const panier = new Panier();

  panier.ajouter({ nom: "Livre", prix: 15 });

  expect(panier.total()).toBe(15);
});
```

```javascript
// GREEN suivant : le code évolue sans casser le test précédent
class Panier {
  constructor() {
    this.articles = [];
  }

  ajouter(article) {
    this.articles.push(article);
  }

  total() {
    return this.articles.reduce((somme, a) => somme + a.prix, 0);
  }
}

module.exports = { Panier };
```

## Quand utiliser le TDD ?

- Sur une logique métier dont le comportement attendu est connu à l'avance : le TDD excelle à clarifier des règles précises (calculs, validations, transitions d'état).
- Quand on veut garantir une bonne couverture de tests par construction, plutôt que d'espérer la rattraper après coup.
- Sur un code destiné à évoluer souvent : le filet de tests produit par le TDD facilite chaque refactoring futur.
- Moins adapté à l'exploration pure (prototypage d'UI, expérimentation d'API externe méconnue) où le comportement attendu n'est pas encore clair — dans ce cas, explorer d'abord, puis stabiliser au TDD une fois la direction connue, est souvent plus efficace.

## Points importants

- L'étape Red n'est pas optionnelle : voir le test échouer avant d'écrire le code confirme que le test teste réellement quelque chose de nouveau.
- Le code écrit à l'étape Green doit rester **minimal** — céder à la tentation de généraliser trop tôt casse le rythme court du cycle et introduit du code non couvert par un test.
- Le Refactor s'appuie entièrement sur les tests déjà verts : sans eux, refactorer devient aussi risqué qu'avant le TDD.
- Le TDD est une discipline de conception autant qu'une pratique de test : le vrai bénéfice est la clarté qu'il impose sur le comportement attendu, avant même d'écrire l'implémentation.
