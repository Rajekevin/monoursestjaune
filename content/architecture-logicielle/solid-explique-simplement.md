---
title: "SOLID expliqué simplement"
description: "SOLID regroupe cinq principes de conception orientée objet — SRP, OCP, LSP, ISP, DIP — qui rendent le code plus facile à faire évoluer sans le casser."
date: 2026-07-10
category: "Architecture logicielle"
difficulty: "Intermédiaire"
tags: ["solid", "architecture", "php", "java", "design-patterns"]
summary: "SOLID est un acronyme regroupant cinq principes de conception orientée objet formulés par Robert C. Martin : Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation et Dependency Inversion. Ensemble, ils visent un seul objectif : pouvoir faire évoluer le code sans le casser."
bearMemory:
  - "SOLID n'est pas une checklist à cocher ligne par ligne : c'est un ensemble de **signaux d'alerte** à reconnaître dans du code qui devient rigide."
  - "Retenez l'objectif commun aux cinq lettres : **isoler ce qui change** de ce qui reste stable, pour que modifier une chose ne casse pas les autres."
  - "S et I se ressemblent : S sépare les **responsabilités d'une classe**, I sépare les **contrats d'une interface**. Ce sont deux granularités du même réflexe."
interviewQuestions:
  - q: "Peux-tu citer et expliquer brièvement les 5 principes SOLID ?"
    a: "Single Responsibility : une classe n'a qu'une seule raison de changer. Open/Closed : le code s'étend par ajout, pas par modification de l'existant. Liskov Substitution : une sous-classe doit pouvoir remplacer sa classe mère sans rien casser. Interface Segregation : mieux vaut plusieurs petites interfaces spécifiques qu'une seule interface générale. Dependency Inversion : on dépend d'abstractions, pas d'implémentations concrètes."
  - q: "SOLID est-il toujours pertinent, ou est-ce un principe daté ?"
    a: "Les principes restent pertinents, mais leur application mérite d'être dosée. Appliqués mécaniquement partout, ils produisent une explosion d'interfaces et de classes pour des besoins qui n'en ont pas. Utilisés comme des signaux d'alerte — reconnaître un `switch` qui grossit, une classe qui a plusieurs raisons de changer — ils restent un outil de diagnostic solide, indépendant du langage ou du framework utilisé."
  - q: "Quel principe SOLID est le plus souvent négligé en pratique ?"
    a: "Liskov Substitution, probablement, car sa violation est plus subtile que les autres : le code compile, l'interface est respectée à la lettre, mais le comportement d'une sous-classe trahit le contrat attendu (une méthode qui lève une exception là où la classe mère renvoyait un résultat, par exemple). Ce genre de violation ne se voit souvent qu'en production, quand un appelant générique reçoit un type inattendu."
---

## Le problème

SOLID est l'un des acronymes les plus cités en entretien technique et l'un des moins bien maîtrisés en pratique. Beaucoup de développeurs savent réciter les cinq lettres sans être capables de dire, face à un bout de code réel, lequel des cinq principes est violé — ou pire, appliquent les cinq principes partout, systématiquement, produisant du code sur-architecturé pour des besoins qui n'en demandaient pas tant.

SOLID n'est pas une checklist à cocher automatiquement. C'est un ensemble de signaux d'alerte, à reconnaître dans du code qui commence à devenir rigide, difficile à tester ou risqué à modifier.

## L'idée générale

SOLID regroupe cinq principes de conception orientée objet, formulés (et popularisés) par Robert C. Martin. Chacun d'entre eux, à sa manière, poursuit le même objectif : permettre au code d'évoluer sans se casser.

- **S — Single Responsibility Principle** : une classe ne devrait avoir qu'une seule raison de changer.
- **O — Open/Closed Principle** : le code doit être ouvert à l'extension, mais fermé à la modification — on ajoute un comportement, on ne réécrit pas l'existant.
- **L — Liskov Substitution Principle** : une sous-classe doit pouvoir remplacer sa classe mère partout où celle-ci est utilisée, sans changer le comportement attendu par l'appelant.
- **I — Interface Segregation Principle** : mieux vaut plusieurs interfaces petites et spécifiques qu'une seule grosse interface qui force à implémenter des méthodes inutiles.
- **D — Dependency Inversion Principle** : les modules dépendent d'abstractions (interfaces), jamais d'implémentations concrètes — le sens des dépendances technique s'inverse vers le métier.

Ces cinq principes ne s'appliquent pas isolément : dans la pratique, ils se renforcent mutuellement. Une classe respectant le SRP est plus facile à étendre sans la modifier (OCP) ; une bonne inversion de dépendance (DIP) s'appuie souvent sur des interfaces fines (ISP).

## Analogie du quotidien

Pensez à un système d'étagères modulaires, comme ceux qu'on assemble soi-même : chaque module (tiroir, porte, tablette) a un rôle précis et se fixe selon un standard commun.

- **S** : chaque module a une seule fonction — un tiroir range, une porte ferme. On ne conçoit pas un module « tiroir-porte-éclairage » qui fait tout à moitié bien.
- **O** : on ajoute un nouveau module (une nouvelle tablette) sans redémonter ni redessiner les modules déjà en place.
- **L** : n'importe quel tiroir standard de la gamme se fixe à la place d'un autre tiroir standard, sans que le meuble ait besoin d'être modifié.
- **I** : le kit de vis fourni pour fixer une porte ne vous oblige pas à utiliser aussi le kit prévu pour des roulettes que vous n'installerez jamais — chaque kit reste spécifique à son usage.
- **D** : le plan de montage général ne mentionne jamais une marque de vis précise, seulement un standard de fixation — n'importe quel fournisseur respectant ce standard peut être utilisé.

## Diagramme

{{< mermaid >}}
flowchart TD
    SOLID((SOLID))
    SOLID --> S["S — Single Responsibility
Une seule raison de changer"]
    SOLID --> O["O — Open/Closed
Étendre sans modifier"]
    SOLID --> L["L — Liskov Substitution
Une sous-classe respecte le contrat"]
    SOLID --> I["I — Interface Segregation
Des interfaces petites et spécifiques"]
    SOLID --> D["D — Dependency Inversion
Dépendre d'abstractions, pas d'implémentations"]
{{< /mermaid >}}

## Exemple de code

Un exemple court par principe, en PHP, suffit à voir concrètement ce que chaque lettre change dans le code.

### S — Single Responsibility

```php
// Violation : une classe calcule ET exporte en PDF — deux raisons de changer.
final class Facture
{
    public function calculerTotal(array $lignes): float { /* ... */ }
    public function exporterEnPdf(array $lignes): string { /* ... */ }
}

// Respect du principe : une responsabilité par classe.
final class CalculateurFacture
{
    public function calculerTotal(array $lignes): float { /* ... */ }
}

final class ExporteurFacturePdf
{
    public function exporter(array $lignes): string { /* ... */ }
}
```

### O — Open/Closed

```php
// Violation : chaque nouveau type de client oblige à modifier cette méthode.
final class CalculateurRemise
{
    public function calculer(string $typeClient, float $montant): float
    {
        return match ($typeClient) {
            'standard' => $montant * 0.0,
            'premium' => $montant * 0.1,
            'vip' => $montant * 0.2,
        };
    }
}

// Respect du principe : ajouter un type de client = ajouter une classe, sans toucher à l'existant.
interface RemiseStrategy
{
    public function calculer(float $montant): float;
}

final class RemiseVip implements RemiseStrategy
{
    public function calculer(float $montant): float { return $montant * 0.2; }
}
```

### L — Liskov Substitution

```php
// Violation : Pingouin hérite d'Oiseau mais trahit le contrat voler().
class Oiseau
{
    public function voler(): void { /* ... */ }
}

class Pingouin extends Oiseau
{
    public function voler(): void
    {
        throw new LogicException('Un pingouin ne vole pas');
    }
}
// Tout code qui manipule un Oiseau générique et appelle voler() casse avec un Pingouin.

// Respect du principe : séparer ce qui n'est pas garanti pour tous les sous-types.
interface Oiseau {}
interface CapableDeVoler
{
    public function voler(): void;
}

class Pingouin implements Oiseau {}
class Aigle implements Oiseau, CapableDeVoler
{
    public function voler(): void { /* ... */ }
}
```

### I — Interface Segregation

```php
// Violation : une interface trop large force des implémentations inutiles.
interface Travailleur
{
    public function travailler(): void;
    public function manger(): void;
}

final class RobotOuvrier implements Travailleur
{
    public function travailler(): void { /* ... */ }
    public function manger(): void
    {
        throw new LogicException('Un robot ne mange pas'); // méthode forcée, inutile
    }
}

// Respect du principe : deux interfaces distinctes, chacune implémentée si besoin.
interface Travaillable { public function travailler(): void; }
interface Mangeable { public function manger(): void; }

final class RobotOuvrier implements Travaillable
{
    public function travailler(): void { /* ... */ }
}
```

### D — Dependency Inversion

```php
// Violation : le service dépend directement d'une implémentation concrète.
final class NotificationService
{
    public function notifier(string $message): void
    {
        (new EmailSender())->envoyer($message);
    }
}

// Respect du principe : le service dépend d'une abstraction, injectée de l'extérieur.
interface Sender
{
    public function envoyer(string $message): void;
}

final class NotificationService
{
    public function __construct(private Sender $sender) {}

    public function notifier(string $message): void
    {
        $this->sender->envoyer($message);
    }
}
```

## Quand appliquer SOLID ?

- Sur du code métier amené à évoluer souvent — nouvelles règles, nouveaux types de clients, nouveaux moyens de paiement.
- Quand un `switch` ou une cascade de `if/else` grossit à chaque nouvelle fonctionnalité (signal typique d'une violation d'Open/Closed).
- Quand une classe doit être modifiée pour des raisons complètement indépendantes par des équipes différentes (signal typique d'une violation de Single Responsibility).
- Avec retenue sur du code simple et stable : appliquer les cinq lettres systématiquement à un script utilitaire de vingt lignes produit plus d'indirection que de valeur.

## Points importants

- SOLID est un outil de diagnostic, pas un objectif en soi : le but n'est pas d'avoir « du code SOLID », mais du code qui reste facile à faire évoluer.
- S et I se ressemblent : S sépare les responsabilités d'une classe, I sépare les contrats d'une interface — deux granularités du même réflexe.
- D (Dependency Inversion) est le principe le plus structurant à l'échelle d'une architecture entière : c'est lui qui rend possibles la Clean Architecture, l'architecture hexagonale et le couplage faible en général.
- Les cinq principes se retrouvent partout ailleurs sur ce site : le [couplage fort vs faible](/architecture-logicielle/couplage-fort-vs-faible) illustre le D, la [séparation des responsabilités](/architecture-logicielle/separation-des-responsabilites) approfondit le S, et le [Strategy Pattern](/design-patterns/strategy) est une application directe de l'Open/Closed.
