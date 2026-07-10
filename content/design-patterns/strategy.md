---
title: "Le Pattern Strategy expliqué simplement"
description: "Le Strategy Pattern permet de changer un comportement à la volée sans multiplier les if/else. Explication, analogie, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Intermédiaire"
tags: ["php", "java", "javascript", "design-patterns", "solid"]
summary: "Le Strategy Pattern permet de faire varier un comportement indépendamment du code qui l'utilise. Au lieu d'empiler des `if/else`, on encapsule chaque variante dans sa propre classe, interchangeable à tout moment."
bearMemory:
  - "Strategy encapsule un **comportement interchangeable**, pas un objet à construire (contrairement à Factory)."
  - "Le client dépend d'une **interface**, jamais d'une implémentation concrète : c'est ce qui permet de changer de stratégie sans toucher au code appelant."
  - "Un signe qu'il vous faut un Strategy : une méthode avec un `switch` ou une cascade de `if/else` qui grossit à chaque nouveau cas."
interviewQuestions:
  - q: "Quelle différence entre Strategy et Factory ?"
    a: "Factory répond à la question *comment créer un objet ?* — elle encapsule une logique de construction. Strategy répond à *comment se comporter ?* — elle encapsule un algorithme interchangeable. On peut d'ailleurs utiliser une Factory pour choisir quelle Strategy instancier : les deux patterns sont complémentaires, pas concurrents."
  - q: "Quelle différence entre Strategy et State ?"
    a: "Structurellement, ce sont presque les mêmes diagrammes UML. La différence est dans l'intention : avec Strategy, c'est le client qui choisit explicitement la stratégie à utiliser. Avec State, c'est l'objet lui-même qui change de comportement en fonction de son état interne, souvent sans que le client s'en aperçoive."
  - q: "Pourquoi ne pas simplement utiliser des if/else ?"
    a: "Un if/else fonctionne, mais chaque nouveau cas oblige à modifier une fonction existante — ce qui viole le principe ouvert/fermé (le O de SOLID). Avec Strategy, ajouter un comportement revient à ajouter une nouvelle classe, sans toucher au code déjà en place et déjà testé."
---

## Le problème

Imaginez un service de calcul de frais de livraison. Au départ, une seule règle : livraison standard. Puis on ajoute la livraison express. Puis la livraison internationale. Puis un partenaire propose ses propres tarifs. Six mois plus tard, la méthode `calculerFrais()` ressemble à un mur de `if/else` (ou de `switch`) impossible à lire, où chaque nouvelle règle métier ajoute un risque de casser les précédentes.

Le problème n'est pas la logique elle-même : c'est qu'elle est **figée dans une seule méthode**. Impossible de tester un mode de livraison isolément, impossible d'en ajouter un nouveau sans rouvrir un fichier que tout le monde touche, impossible de changer de comportement à l'exécution proprement.

## L'idée générale

Le Strategy Pattern propose d'extraire chaque variante du comportement dans sa **propre classe**, toutes ces classes respectant la même interface. Le code appelant ne connaît que l'interface — il ignore totalement laquelle des implémentations tourne réellement derrière.

Trois éléments composent le pattern :

- **Strategy** : l'interface commune, qui déclare la méthode que toutes les variantes doivent implémenter.
- **ConcreteStrategy** : chaque implémentation concrète (une classe par comportement).
- **Context** : la classe qui utilise une Strategy, sans savoir laquelle précisément — elle lui délègue simplement le travail.

Ajouter un nouveau comportement revient à ajouter une nouvelle classe qui implémente l'interface. Rien d'existant n'a besoin d'être modifié.

## Analogie du quotidien

Le Strategy Pattern, c'est comme choisir différents moyens de transport selon la situation. Pour aller travailler, vous pouvez prendre le vélo, la voiture ou le métro. L'objectif reste le même — *se déplacer d'un point A à un point B* — mais la manière de l'atteindre change selon le contexte (météo, distance, budget).

Vous (le `Context`) ne réinventez pas la façon de vous déplacer à chaque fois : vous choisissez un moyen de transport (`ConcreteStrategy`) qui respecte toujours le même contrat — *m'emmener à destination* (`Strategy`). Changer de moyen de transport ne change rien à votre objectif final, seulement à la façon de l'atteindre.

## Diagramme

{{< mermaid >}}
classDiagram
    class Context {
        -strategy: ShippingStrategy
        +setStrategy(s: ShippingStrategy)
        +calculerFrais(commande) float
    }
    class ShippingStrategy {
        <<interface>>
        +calculer(commande) float
    }
    class LivraisonStandard {
        +calculer(commande) float
    }
    class LivraisonExpress {
        +calculer(commande) float
    }
    class LivraisonInternationale {
        +calculer(commande) float
    }
    Context o--> ShippingStrategy
    ShippingStrategy <|.. LivraisonStandard
    ShippingStrategy <|.. LivraisonExpress
    ShippingStrategy <|.. LivraisonInternationale
{{< /mermaid >}}

## Exemple de code

### PHP

```php
interface ShippingStrategy
{
    public function calculer(Commande $commande): float;
}

final class LivraisonStandard implements ShippingStrategy
{
    public function calculer(Commande $commande): float
    {
        return 4.90;
    }
}

final class LivraisonExpress implements ShippingStrategy
{
    public function calculer(Commande $commande): float
    {
        return 9.90 + ($commande->poids() * 0.5);
    }
}

final class Context
{
    public function __construct(private ShippingStrategy $strategy) {}

    public function setStrategy(ShippingStrategy $strategy): void
    {
        $this->strategy = $strategy;
    }

    public function calculerFrais(Commande $commande): float
    {
        return $this->strategy->calculer($commande);
    }
}

// Utilisation
$context = new Context(new LivraisonStandard());
$context->calculerFrais($commande); // 4.90

$context->setStrategy(new LivraisonExpress());
$context->calculerFrais($commande); // change de comportement, sans changer Context
```

### Java

```java
interface ShippingStrategy {
    double calculer(Commande commande);
}

class LivraisonStandard implements ShippingStrategy {
    public double calculer(Commande commande) {
        return 4.90;
    }
}

class LivraisonExpress implements ShippingStrategy {
    public double calculer(Commande commande) {
        return 9.90 + (commande.getPoids() * 0.5);
    }
}

class Context {
    private ShippingStrategy strategy;

    public Context(ShippingStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(ShippingStrategy strategy) {
        this.strategy = strategy;
    }

    public double calculerFrais(Commande commande) {
        return strategy.calculer(commande);
    }
}

// Utilisation
Context context = new Context(new LivraisonStandard());
context.calculerFrais(commande); // 4.90

context.setStrategy(new LivraisonExpress());
context.calculerFrais(commande); // change de comportement, sans changer Context
```

### JavaScript

```javascript
class LivraisonStandard {
  calculer(commande) {
    return 4.90;
  }
}

class LivraisonExpress {
  calculer(commande) {
    return 9.90 + commande.poids * 0.5;
  }
}

class Context {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  calculerFrais(commande) {
    return this.strategy.calculer(commande);
  }
}

// Utilisation
const context = new Context(new LivraisonStandard());
context.calculerFrais(commande); // 4.90

context.setStrategy(new LivraisonExpress());
context.calculerFrais(commande); // change de comportement, sans changer Context
```

## Quand utiliser ce pattern ?

- Quand une méthode contient plusieurs variantes d'un même algorithme, sélectionnées par un `if/else` ou un `switch` qui grossit avec le temps.
- Quand vous voulez pouvoir **changer de comportement à l'exécution**, sans redéployer ni modifier le code appelant.
- Quand plusieurs classes partagent une logique presque identique, avec seulement quelques variations de comportement.
- Quand vous voulez pouvoir **tester chaque comportement isolément**, sans dépendre du reste de la logique métier.

Évitez Strategy si vous n'avez qu'une seule variante prévisible : l'indirection ajoutée par le pattern coûte plus qu'elle ne rapporte tant qu'un vrai besoin de variation n'existe pas.

## Points importants

- Strategy respecte le principe ouvert/fermé (*open/closed*) : on étend le comportement en ajoutant une classe, jamais en modifiant l'existant.
- Le `Context` ne doit jamais faire de `instanceof` ou de test de type sur la Strategy : s'il le fait, l'abstraction a une fuite.
- En PHP et en Java modernes, une closure ou une expression lambda peut parfois remplacer une Strategy triviale à une seule méthode — le pattern reste utile dès que la logique se complexifie ou doit être testée indépendamment.
- Strategy est la base de nombreux autres patterns : il est souvent combiné à une Factory pour décider *quelle* stratégie instancier selon le contexte.
