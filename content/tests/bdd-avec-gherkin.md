---
title: "BDD avec Gherkin"
description: "Le BDD décrit le comportement métier en langage naturel structuré (Given/When/Then) pour rapprocher développeurs et non-développeurs. Explication, analogie, diagramme et code."
date: 2026-07-10
category: "Tests"
difficulty: "Intermédiaire"
tags: ["bdd", "tdd", "tests", "php"]
summary: "Le BDD (Behavior-Driven Development) décrit le comportement attendu d'un système en langage naturel structuré, via la syntaxe Gherkin (Given/When/Then), pour que développeurs, testeurs et experts métier partagent une seule source de vérité, exécutable comme un test."
bearMemory:
  - "Gherkin structure un scénario en trois blocs : **Given** (contexte initial), **When** (action déclenchée), **Then** (résultat attendu)."
  - "Le BDD porte sur le **comportement métier**, exprimé en langage naturel compréhensible par des non-développeurs — le TDD porte sur la conception technique, exprimée en code."
  - "Un scénario Gherkin sert à la fois de **spécification lisible** par les non-développeurs et de **test automatisé exécutable** par la machine : c'est le même document pour les deux usages."
interviewQuestions:
  - q: "Quelle différence entre BDD et TDD ?"
    a: "Le TDD est une discipline de conception technique : on écrit un test de code (unitaire, souvent) avant l'implémentation, dans le cycle Red/Green/Refactor. Le BDD porte sur le comportement métier, exprimé en langage naturel structuré (Given/When/Then) et rédigé idéalement avec les parties prenantes non techniques — produit, métier, QA. Le BDD peut s'appuyer sur des pratiques proches du TDD une fois qu'on descend au niveau de l'implémentation des steps, mais son objectif premier est la collaboration et la clarté du comportement attendu, pas uniquement la conception du code."
  - q: "Pourquoi utiliser un langage structuré comme Gherkin plutôt que d'écrire directement le test en code ?"
    a: "Parce que Gherkin reste lisible par des non-développeurs — un product owner, un testeur manuel, un client — qui peuvent relire, corriger ou même écrire un scénario sans connaître le langage de programmation sous-jacent. Ça crée une source de vérité partagée entre le métier et la technique : le scénario n'est pas une traduction après coup du code, c'est la spécification elle-même, qui devient ensuite exécutable comme test."
  - q: "Un scénario Gherkin est-il un test unitaire, d'intégration ou end-to-end ?"
    a: "Ça dépend entièrement de l'implémentation des steps derrière le scénario. Gherkin est un format de description du comportement, pas un niveau de test en soi : les steps peuvent appeler directement une fonction isolée (proche d'un test unitaire), orchestrer plusieurs composants réels (test d'intégration), ou piloter un navigateur (test end-to-end). C'est un langage de spécification, indépendant du niveau technique auquel il s'exécute."
---

## Le problème

Un product owner décrit une règle métier à l'oral : "un client fidèle depuis plus d'un an obtient une remise de 10%, sauf sur les articles déjà en promotion". Le développeur code cette règle, l'équipe QA la teste manuellement selon sa propre compréhension, et le product owner découvre en recette que la règle implémentée diffère légèrement de son intention initiale — la définition de "fidèle depuis plus d'un an" n'était pas la même pour tout le monde.

Le problème n'est pas un manque de tests : c'est que le comportement attendu n'a jamais existé sous une forme unique, précise et partagée entre le métier et la technique. Chacun a sa propre interprétation, et les tests, écrits après coup en code, ne sont lisibles que par les développeurs — impossible pour le product owner de vérifier lui-même que la spécification est correctement traduite.

## L'idée générale

Le BDD (Behavior-Driven Development) déplace l'attention du "comment coder" vers le "comment le système doit se comporter", exprimé dans un langage naturel structuré et compréhensible par toutes les parties prenantes — pas seulement les développeurs. La syntaxe la plus répandue pour ça s'appelle **Gherkin**, et structure chaque scénario en trois blocs :

- **Given** (étant donné) : le contexte initial, l'état du système avant l'action.
- **When** (quand) : l'action déclenchée par l'utilisateur ou le système.
- **Then** (alors) : le résultat attendu, observable, qui doit se produire.

Ce scénario, écrit en langage naturel, n'est pas qu'une documentation : des outils comme Behat (PHP), Cucumber ou Jest-Cucumber (JavaScript) le rendent **exécutable**. Chaque ligne du scénario (chaque "step") est reliée à une fonction de code qui l'implémente réellement. Le même texte sert donc à la fois de spécification lisible par le métier et de test automatisé pour la technique — un seul document, deux usages.

Le BDD ne remplace pas le TDD : il opère à un niveau différent. Le TDD structure la façon d'écrire le code, en partant d'un test technique. Le BDD structure la façon de définir le comportement attendu, en partant d'une conversation avec le métier — et ce comportement peut ensuite être implémenté avec ou sans TDD.

## Analogie du quotidien

Le BDD, c'est comme un cahier des charges rédigé avec un architecte avant de construire une maison, plutôt que des plans techniques compréhensibles uniquement par le maçon. Le client dit : "étant donné que le terrain est en pente, quand on accède au garage, alors la rampe ne doit pas dépasser 15% d'inclinaison." Cette phrase reste compréhensible par le client, l'architecte et le maçon — chacun peut la relire et confirmer qu'elle correspond bien à son intention, avant même que la première pierre ne soit posée.

Sans ce langage commun, le maçon travaillerait à partir d'un plan technique que le client ne sait pas lire, et la première fois que le client verrait le résultat serait... une fois la maison construite.

## Diagramme

{{< mermaid >}}
flowchart LR
    A[Conversation métier<br/>Product Owner + Dev + QA] --> B[Scénario Gherkin<br/>Given / When / Then]
    B --> C{Deux usages}
    C --> D[Spécification lisible<br/>par le métier]
    C --> E[Steps reliés au code<br/>test automatisé]
    E --> F{Résultat}
    F -->|Conforme| G[Scénario vert]
    F -->|Non conforme| H[Scénario rouge]
{{< /mermaid >}}

## Exemple de code

### Scénario Gherkin

```gherkin
Fonctionnalité: Remise fidélité
  En tant que client fidèle
  Je veux obtenir une remise sur mes achats
  Afin d'être récompensé pour ma fidélité

  Scénario: Un client fidèle depuis plus d'un an obtient une remise
    Étant donné un client inscrit depuis 18 mois
    Et un article à 100 euros non soldé
    Quand le client ajoute l'article à son panier
    Alors le total du panier est de 90 euros

  Scénario: Un client fidèle n'obtient aucune remise sur un article déjà en promotion
    Étant donné un client inscrit depuis 18 mois
    Et un article à 100 euros déjà en promotion
    Quand le client ajoute l'article à son panier
    Alors le total du panier est de 100 euros
```

### PHP (Behat)

```php
use Behat\Behat\Context\Context;
use PHPUnit\Framework\Assert;

final class FidelityContext implements Context
{
    private Client $client;
    private Panier $panier;

    /** @Given un client inscrit depuis :mois mois */
    public function unClientInscritDepuis(int $mois): void
    {
        $this->client = new Client(ancienneteEnMois: $mois);
        $this->panier = new Panier($this->client);
    }

    /** @Given un article à :prix euros non soldé */
    public function unArticleNonSolde(float $prix): void
    {
        $this->articleCourant = new Article($prix, enPromotion: false);
    }

    /** @Given un article à :prix euros déjà en promotion */
    public function unArticleEnPromotion(float $prix): void
    {
        $this->articleCourant = new Article($prix, enPromotion: true);
    }

    /** @When le client ajoute l'article à son panier */
    public function leClientAjouteLArticle(): void
    {
        $this->panier->ajouter($this->articleCourant);
    }

    /** @Then le total du panier est de :total euros */
    public function leTotalDuPanierEst(float $total): void
    {
        Assert::assertSame($total, $this->panier->total());
    }
}
```

### JavaScript (jest-cucumber)

```javascript
const { defineFeature, loadFeature } = require("jest-cucumber");
const { Client } = require("./client");
const { Panier } = require("./panier");
const { Article } = require("./article");

const feature = loadFeature("./remiseFidelite.feature");

defineFeature(feature, (test) => {
  test("Un client fidèle depuis plus d'un an obtient une remise", ({
    given,
    and,
    when,
    then,
  }) => {
    let client;
    let panier;
    let article;

    given(/^un client inscrit depuis (\d+) mois$/, (mois) => {
      client = new Client(Number(mois));
      panier = new Panier(client);
    });

    and(/^un article à (\d+) euros non soldé$/, (prix) => {
      article = new Article(Number(prix), false);
    });

    when("le client ajoute l'article à son panier", () => {
      panier.ajouter(article);
    });

    then(/^le total du panier est de (\d+) euros$/, (total) => {
      expect(panier.total()).toBe(Number(total));
    });
  });
});
```

## Quand utiliser le BDD ?

- Quand une règle métier est ambiguë ou sujette à interprétation, et que sa formulation précise mérite d'être validée avec le métier avant d'être codée.
- Sur des projets où testeurs, product owners ou clients doivent pouvoir lire — voire écrire — les scénarios de test sans connaître le code.
- Pour documenter le comportement attendu d'une fonctionnalité de façon durable, exécutable, qui ne peut pas devenir obsolète sans que le test échoue.
- Moins adapté à une logique purement technique (un algorithme de tri, une optimisation de requête) où aucune partie prenante non technique n'a d'intérêt à lire la spécification en langage naturel — un test unitaire classique suffit alors.

## Points importants

- Gherkin est un format de spécification, pas un niveau de test : les steps peuvent appeler du code isolé, orchestrer plusieurs composants réels, ou piloter un navigateur, selon ce que le scénario doit vérifier.
- La valeur du BDD dépend de la conversation qui précède l'écriture du scénario, pas seulement de la syntaxe — un scénario Gherkin écrit seul par un développeur, sans le métier, perd une grande partie de son intérêt.
- BDD et TDD ne s'opposent pas : le BDD cadre le comportement attendu au niveau métier, le TDD peut ensuite guider l'implémentation technique des steps qui réalisent ce comportement.
- Trop de détails techniques dans un scénario Gherkin ("cliquer sur le bouton #submit-btn") le rend illisible pour le métier et fragile aux changements d'interface — un bon scénario reste au niveau du comportement, pas de l'implémentation.
