---
title: "Couplage fort vs faible"
description: "Le couplage mesure à quel point deux composants dépendent l'un de l'autre. Comprendre la différence entre couplage fort et faible, avec un exemple concret d'injection de dépendance."
date: 2026-07-10
category: "Architecture logicielle"
difficulty: "Débutant"
tags: ["architecture", "solid", "php", "java"]
summary: "Le couplage mesure à quel point un composant dépend d'un autre. Un couplage fort rend le système fragile et difficile à faire évoluer ; un couplage faible, obtenu via des interfaces et l'injection de dépendance, permet de changer une implémentation sans toucher au code qui l'utilise."
bearMemory:
  - "Le couplage se mesure à une question simple : combien de fichiers faut-il changer si on remplace une dépendance ?"
  - "Dépendre d'une **interface plutôt que d'une classe concrète** est le levier principal pour réduire le couplage."
  - "L'**injection de dépendance** ne fait qu'appliquer ce principe : au lieu de créer sa dépendance avec `new`, une classe la reçoit de l'extérieur."
interviewQuestions:
  - q: "Comment repérer du couplage fort dans du code existant ?"
    a: "Le signe le plus fiable est un `new NomDeClasseConcrete()` au milieu d'une méthode métier, surtout si cette classe touche à une technologie précise (SDK, ORM, client HTTP). Un deuxième signe : impossible de tester une classe sans faire tourner une vraie base de données ou un vrai service externe — c'est la preuve que le test dépend d'une implémentation concrète, pas d'une abstraction."
  - q: "Le couplage faible signifie-t-il qu'il faut créer une interface pour chaque classe ?"
    a: "Non. Créer une interface a un coût — plus de fichiers, plus d'indirection — qui ne se justifie que lorsqu'il existe un vrai besoin de substitution : plusieurs implémentations réelles, ou le besoin de mocker cette dépendance en test. Une classe utilitaire pure, sans effet de bord ni dépendance externe, n'a généralement pas besoin d'être cachée derrière une interface."
  - q: "Quel est le lien entre couplage faible et le principe d'inversion de dépendance (le D de SOLID) ?"
    a: "Le D de SOLID formalise exactement cette pratique : les modules de haut niveau ne doivent pas dépendre des modules de bas niveau, les deux doivent dépendre d'abstractions. Réduire le couplage en injectant une interface plutôt qu'une implémentation concrète, c'est appliquer directement ce principe. Le détail est expliqué dans l'article sur [SOLID expliqué simplement](/architecture-logicielle/solid-explique-simplement)."
---

## Le problème

Une classe `GestionnaireCommande` qui instancie directement un client MySQL, un client Stripe et un client SMTP à l'intérieur de ses méthodes fonctionne très bien... jusqu'à ce qu'on essaie d'en écrire un test unitaire. Impossible de tester la logique de validation d'une commande sans faire tourner une vraie base de données, sans réellement débiter une carte bancaire de test, sans envoyer un vrai e-mail.

Le même problème apparaît dès qu'il faut changer un fournisseur : remplacer Stripe par un autre prestataire de paiement oblige à retrouver et modifier chaque endroit du code qui a écrit `new StripeClient()`. Plus une classe connaît de détails concrets sur ses dépendances, plus elle devient fragile face à leurs changements — c'est ça, le couplage fort.

## L'idée générale

Le couplage mesure à quel point un composant dépend des détails internes d'un autre. Plus deux composants sont couplés, plus modifier l'un impose de modifier l'autre.

- **Couplage fort** : une classe connaît le type concret exact de sa dépendance, l'instancie elle-même (`new`), et souvent connaît aussi ses détails d'implémentation (méthodes propres à ce type précis, format de retour spécifique).
- **Couplage faible** : une classe dépend d'une abstraction — une interface — sans savoir quelle implémentation tourne réellement derrière. La dépendance lui est fournie de l'extérieur plutôt que créée en interne.

Le levier principal pour passer d'un couplage fort à un couplage faible s'appelle l'**injection de dépendance** : au lieu qu'une classe construise elle-même ce dont elle a besoin, on le lui transmet — généralement via le constructeur. Combinée à une interface, l'injection de dépendance permet de changer d'implémentation (une vraie base de données contre un stockage en mémoire pour les tests, Stripe contre PayPal) sans toucher une seule ligne de la classe qui l'utilise.

Le couplage faible n'est pas gratuit : il ajoute une interface et une indirection. Ce coût se justifie dès qu'il existe un vrai besoin de substitution — tester sans dépendance réelle, ou supporter plusieurs implémentations en production.

## Analogie du quotidien

Le couplage fort, c'est comme une télécommande de télévision soudée en usine à un unique modèle de téléviseur, avec un connecteur propriétaire. Si le téléviseur tombe en panne, il faut jeter la télécommande avec — elle ne fonctionne avec rien d'autre.

Le couplage faible, c'est une télécommande universelle qui communique avec n'importe quel téléviseur respectant le protocole infrarouge standard. La télécommande ne connaît pas la marque du téléviseur en face d'elle : elle envoie un signal standard (« allumer », « monter le volume »), et n'importe quel appareil compatible avec ce protocole y répond. Changer de téléviseur ne demande pas de changer de télécommande — seul le respect du protocole commun compte.

## Diagramme

{{< mermaid >}}
classDiagram
    class GestionnaireCommandeCouple {
        -client: StripeClient
        +payer(commande)
    }
    class StripeClient {
        +charge(montant)
    }
    GestionnaireCommandeCouple --> StripeClient : dépend directement (couplage fort)

    class GestionnaireCommandeDecouple {
        -passerelle: PassionPaiementInterface
        +payer(commande)
    }
    class PassionPaiementInterface {
        <<interface>>
        +payer(montant)
    }
    class StripeAdapter {
        +payer(montant)
    }
    class PaypalAdapter {
        +payer(montant)
    }
    GestionnaireCommandeDecouple --> PassionPaiementInterface : dépend d'une abstraction (couplage faible)
    PassionPaiementInterface <|.. StripeAdapter
    PassionPaiementInterface <|.. PaypalAdapter
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// --- AVANT : couplage fort ---
final class GestionnaireCommande
{
    public function payer(Commande $commande): void
    {
        // La classe connaît et instancie directement une implémentation concrète.
        $stripe = new \Stripe\StripeClient(getenv('STRIPE_KEY'));
        $stripe->charges->create(['amount' => $commande->montant()]);
    }
}

// Impossible de tester sans réellement appeler Stripe.
// Impossible de changer de prestataire sans modifier cette classe.

// --- APRÈS : couplage faible via interface + injection de dépendance ---
interface PasserellePaiement
{
    public function payer(int $montantEnCentimes): void;
}

final class StripePasserelle implements PasserellePaiement
{
    public function __construct(private \Stripe\StripeClient $client) {}

    public function payer(int $montantEnCentimes): void
    {
        $this->client->charges->create(['amount' => $montantEnCentimes]);
    }
}

final class GestionnaireCommande
{
    public function __construct(private PasserellePaiement $passerelle) {}

    public function payer(Commande $commande): void
    {
        $this->passerelle->payer($commande->montant());
    }
}

// Le test unitaire n'a plus besoin de Stripe : une fausse implémentation suffit.
final class FaussePasserelle implements PasserellePaiement
{
    public array $appels = [];

    public function payer(int $montantEnCentimes): void
    {
        $this->appels[] = $montantEnCentimes;
    }
}
```

### Java

```java
// --- AVANT : couplage fort ---
public class GestionnaireCommande {
    public void payer(Commande commande) {
        StripeClient stripe = new StripeClient(System.getenv("STRIPE_KEY"));
        stripe.charge(commande.getMontant());
    }
}

// --- APRÈS : couplage faible via interface + injection de dépendance ---
public interface PasserellePaiement {
    void payer(long montantEnCentimes);
}

public class StripePasserelle implements PasserellePaiement {
    private final StripeClient client;

    public StripePasserelle(StripeClient client) {
        this.client = client;
    }

    public void payer(long montantEnCentimes) {
        client.charge(montantEnCentimes);
    }
}

public class GestionnaireCommande {
    private final PasserellePaiement passerelle;

    public GestionnaireCommande(PasserellePaiement passerelle) {
        this.passerelle = passerelle;
    }

    public void payer(Commande commande) {
        passerelle.payer(commande.getMontant());
    }
}
```

## Quand viser un couplage faible ?

- Quand une classe dépend d'un service externe susceptible de changer (fournisseur de paiement, base de données, API tierce).
- Quand vous voulez tester une classe unitairement, sans faire tourner une vraie infrastructure.
- Quand plusieurs implémentations réelles doivent coexister (plusieurs fournisseurs de notification selon le pays, par exemple).
- Inutile en revanche pour une dépendance purement interne, stable, sans effet de bord — comme une fonction utilitaire de formatage : y ajouter une interface n'apporte que de l'indirection sans bénéfice réel.

## Points importants

- Le signal d'alarme le plus fiable d'un couplage fort : un `new NomDeClasseConcrete()` au milieu d'une méthode métier qui parle à une technologie précise.
- L'injection de dépendance n'est qu'une technique — le vrai principe est de dépendre d'abstractions plutôt que d'implémentations concrètes.
- Un couplage faible mal utilisé (interface partout, même sans besoin réel de substitution) ajoute de la complexité sans bénéfice : le but n'est pas zéro couplage, mais un couplage maîtrisé aux bons endroits.
- Ce principe est au cœur du D de SOLID (Dependency Inversion), détaillé dans l'article [SOLID expliqué simplement](/architecture-logicielle/solid-explique-simplement).
