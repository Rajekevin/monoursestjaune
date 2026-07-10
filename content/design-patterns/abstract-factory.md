---
title: "Le Pattern Abstract Factory expliqué simplement"
description: "L'Abstract Factory produit des familles complètes d'objets liés qui doivent rester cohérents entre eux. Explication, différence avec Factory, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Avancé"
tags: ["php", "java", "javascript", "design-patterns", "oop"]
summary: "L'Abstract Factory va plus loin que la Factory simple : elle garantit qu'un ensemble d'objets liés entre eux (une famille) reste toujours cohérent, en regroupant plusieurs méthodes de création derrière une seule interface."
bearMemory:
  - "Abstract Factory produit une **famille cohérente** d'objets liés ; Factory simple ne produit qu'un seul type d'objet à la fois."
  - "Ajouter une nouvelle famille (un nouveau thème) est facile ; ajouter un nouveau type de produit à la famille existante oblige à modifier toutes les factories concrètes."
  - "Question d'entretien classique : Abstract Factory est souvent composée de plusieurs Factory Method internes, une par produit de la famille."
interviewQuestions:
  - q: "Quelle est la différence entre Factory Method et Abstract Factory ?"
    a: "Factory Method encapsule la création d'un seul type d'objet derrière une méthode. Abstract Factory va plus loin : elle regroupe plusieurs Factory Method dans une seule interface, pour produire une famille complète d'objets liés qui doivent rester cohérents entre eux. En pratique, Abstract Factory est souvent constituée de plusieurs Factory Method combinées."
  - q: "Quel est le principal inconvénient de l'Abstract Factory ?"
    a: "Ajouter un nouveau type de produit à la famille — par exemple un composant Menu en plus du Bouton et de la CaseACocher — oblige à modifier l'interface UIFactory, puis toutes ses implémentations concrètes existantes. Le pattern facilite l'ajout d'une nouvelle famille, mais complique l'ajout d'un nouveau type de produit à une famille déjà en place."
  - q: "Comment reconnaît-on en entretien qu'un problème appelle un Abstract Factory plutôt qu'une simple Factory ?"
    a: "Le signal clé, c'est la notion de famille cohérente : si le problème mentionne plusieurs objets qui doivent varier ensemble selon un même contexte (thème, plateforme, région, fournisseur) et qu'un mélange entre familles serait un bug, c'est un Abstract Factory. Si un seul type d'objet varie selon un paramètre, une Factory simple suffit."
---

## Le problème

Une application doit supporter plusieurs thèmes graphiques — clair et sombre — chacun avec ses propres composants (un bouton, une case à cocher) qui doivent rester visuellement cohérents entre eux. Si on utilise une Factory simple par composant (une pour les boutons, une pour les cases à cocher), rien n'empêche d'assembler par erreur un `BoutonClair` avec une `CaseSombre`. Le thème n'est plus cohérent, et ce genre de bug — un mélange discret entre deux familles — est particulièrement difficile à repérer en relecture de code.

## L'idée générale

L'Abstract Factory définit une interface (`UIFactory`) qui déclare **une méthode de création par type de produit** de la famille : `creerBouton()`, `creerCaseACocher()`. Chaque factory concrète (`ThemeClairFactory`, `ThemeSombreFactory`) implémente toutes ces méthodes, en retournant systématiquement des composants issus de la **même famille**.

Le code client manipule uniquement l'`UIFactory` abstraite. Il n'a jamais à choisir individuellement chaque composant : la cohérence de la famille entière est garantie par construction, dès qu'on choisit la bonne factory concrète.

## Analogie du quotidien

C'est comme un fabricant de meubles qui propose des collections complètes : la "Collection Scandinave" (chaise, table et lampe scandinaves) et la "Collection Industrielle" (chaise, table et lampe industrielles). Vous ne choisissez pas chaque meuble séparément dans des catalogues différents en espérant qu'ils s'accordent visuellement une fois chez vous — vous choisissez une collection entière, et tous les meubles fournis sont garantis assortis entre eux.

## Diagramme

{{< mermaid >}}
classDiagram
    class UIFactory {
        <<interface>>
        +creerBouton() Bouton
        +creerCaseACocher() CaseACocher
    }
    class ThemeClairFactory {
        +creerBouton() Bouton
        +creerCaseACocher() CaseACocher
    }
    class ThemeSombreFactory {
        +creerBouton() Bouton
        +creerCaseACocher() CaseACocher
    }
    class Bouton {
        <<interface>>
        +afficher() string
    }
    class CaseACocher {
        <<interface>>
        +afficher() string
    }
    class BoutonClair
    class BoutonSombre
    class CaseClaire
    class CaseSombre
    UIFactory <|.. ThemeClairFactory
    UIFactory <|.. ThemeSombreFactory
    Bouton <|.. BoutonClair
    Bouton <|.. BoutonSombre
    CaseACocher <|.. CaseClaire
    CaseACocher <|.. CaseSombre
    ThemeClairFactory ..> BoutonClair
    ThemeClairFactory ..> CaseClaire
    ThemeSombreFactory ..> BoutonSombre
    ThemeSombreFactory ..> CaseSombre
{{< /mermaid >}}

## Exemple de code

### PHP

```php
interface Bouton { public function afficher(): string; }
interface CaseACocher { public function afficher(): string; }

final class BoutonClair implements Bouton {
    public function afficher(): string { return "Bouton clair"; }
}
final class BoutonSombre implements Bouton {
    public function afficher(): string { return "Bouton sombre"; }
}
final class CaseClaire implements CaseACocher {
    public function afficher(): string { return "Case claire"; }
}
final class CaseSombre implements CaseACocher {
    public function afficher(): string { return "Case sombre"; }
}

interface UIFactory
{
    public function creerBouton(): Bouton;
    public function creerCaseACocher(): CaseACocher;
}

final class ThemeClairFactory implements UIFactory
{
    public function creerBouton(): Bouton { return new BoutonClair(); }
    public function creerCaseACocher(): CaseACocher { return new CaseClaire(); }
}

final class ThemeSombreFactory implements UIFactory
{
    public function creerBouton(): Bouton { return new BoutonSombre(); }
    public function creerCaseACocher(): CaseACocher { return new CaseSombre(); }
}

// Utilisation
function construireFormulaire(UIFactory $factory): void
{
    echo $factory->creerBouton()->afficher() . PHP_EOL;
    echo $factory->creerCaseACocher()->afficher() . PHP_EOL;
}

construireFormulaire(new ThemeSombreFactory());
// Bouton sombre + Case sombre : jamais de mélange possible
```

### Java

```java
interface Bouton { String afficher(); }
interface CaseACocher { String afficher(); }

class BoutonClair implements Bouton {
    public String afficher() { return "Bouton clair"; }
}
class BoutonSombre implements Bouton {
    public String afficher() { return "Bouton sombre"; }
}
class CaseClaire implements CaseACocher {
    public String afficher() { return "Case claire"; }
}
class CaseSombre implements CaseACocher {
    public String afficher() { return "Case sombre"; }
}

interface UIFactory {
    Bouton creerBouton();
    CaseACocher creerCaseACocher();
}

class ThemeClairFactory implements UIFactory {
    public Bouton creerBouton() { return new BoutonClair(); }
    public CaseACocher creerCaseACocher() { return new CaseClaire(); }
}

class ThemeSombreFactory implements UIFactory {
    public Bouton creerBouton() { return new BoutonSombre(); }
    public CaseACocher creerCaseACocher() { return new CaseSombre(); }
}

// Utilisation
static void construireFormulaire(UIFactory factory) {
    System.out.println(factory.creerBouton().afficher());
    System.out.println(factory.creerCaseACocher().afficher());
}

construireFormulaire(new ThemeSombreFactory());
// Bouton sombre + Case sombre : jamais de mélange possible
```

### JavaScript

```javascript
class BoutonClair {
  afficher() { return "Bouton clair"; }
}
class BoutonSombre {
  afficher() { return "Bouton sombre"; }
}
class CaseClaire {
  afficher() { return "Case claire"; }
}
class CaseSombre {
  afficher() { return "Case sombre"; }
}

class ThemeClairFactory {
  creerBouton() { return new BoutonClair(); }
  creerCaseACocher() { return new CaseClaire(); }
}

class ThemeSombreFactory {
  creerBouton() { return new BoutonSombre(); }
  creerCaseACocher() { return new CaseSombre(); }
}

// Utilisation
function construireFormulaire(factory) {
  console.log(factory.creerBouton().afficher());
  console.log(factory.creerCaseACocher().afficher());
}

construireFormulaire(new ThemeSombreFactory());
// Bouton sombre + Case sombre : jamais de mélange possible
```

## Quand utiliser ce pattern ?

- Quand l'application doit supporter plusieurs familles de produits liés (thèmes, environnements, fournisseurs) qui doivent rester cohérents entre eux.
- Quand on veut garantir, par construction, qu'on ne mélange jamais des composants issus de familles différentes.
- Quand on veut pouvoir changer une famille entière de produits en un seul point du code : la ligne où on choisit quelle factory injecter.

Évitez ce pattern si une seule famille de produits existe, ou si les objets créés n'ont pas de contrainte de cohérence entre eux — une Factory simple suffit alors largement.

## Points importants

- La question d'entretien la plus fréquente sur ce sujet : Factory crée un objet, Abstract Factory crée une famille d'objets qui doivent rester cohérents entre eux. Abstract Factory est d'ailleurs souvent implémentée en combinant plusieurs Factory Method, une par produit de la famille.
- Ajouter une nouvelle famille (par exemple un "Thème contraste élevé") revient à ajouter une nouvelle factory concrète, sans toucher au code existant — le principe ouvert/fermé est respecté.
- En revanche, ajouter un nouveau type de produit à la famille (par exemple un composant "Menu déroulant") oblige à modifier l'interface `UIFactory`, puis toutes les factories concrètes existantes : c'est le principal point faible du pattern.
- Abstract Factory ajoute une couche d'indirection non négligeable : à réserver aux cas où plusieurs familles de produits liés coexistent réellement dans l'application.
