---
title: "Le Pattern Adapter expliqué simplement"
description: "Le Adapter Pattern rend compatibles deux interfaces qui ne se comprennent pas. Explication, analogie, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Débutant"
tags: ["php", "java", "javascript", "design-patterns", "integration"]
summary: "Le Adapter Pattern permet à deux interfaces incompatibles de fonctionner ensemble, sans modifier ni l'une ni l'autre. Il s'intercale entre le code appelant et une librairie tierce pour traduire les appels d'un contrat vers un autre."
bearMemory:
  - "Adapter **traduit une interface** vers une autre, il ne change jamais le comportement métier sous-jacent."
  - "L'adapter ne doit contenir **aucune logique métier** : juste de la traduction (noms de méthodes, formats de paramètres, types de retour)."
  - "Signe qu'il vous faut un Adapter : votre domaine doit appeler une librairie tierce dont l'interface ne correspond pas à celle que vous attendez."
interviewQuestions:
  - q: "Quelle différence entre Adapter et Facade ?"
    a: "Facade simplifie l'accès à un sous-système complexe en exposant une interface plus simple, souvent nouvelle, sans contrainte de compatibilité avec un contrat existant. Adapter, lui, a un objectif précis : faire correspondre une interface existante à une autre interface existante et déjà attendue par le code appelant. Facade réduit la complexité, Adapter résout une incompatibilité."
  - q: "Quelle différence entre Adapter et Decorator ?"
    a: "Les deux enveloppent un objet, mais pas dans le même but. Adapter change l'interface de l'objet enveloppé pour la rendre compatible avec ce qu'attend le client. Decorator conserve exactement la même interface et l'utilise pour ajouter un comportement supplémentaire. Un Adapter répond à *comment faire parler deux contrats différents ?*, un Decorator répond à *comment enrichir un comportement sans y toucher ?*."
  - q: "Adapter d'objet ou adapter de classe, lequel privilégier ?"
    a: "L'adapter d'objet (par composition, l'adapter détient une référence vers l'objet adapté) est presque toujours préférable : il fonctionne même quand la classe adaptée est finale ou vient d'une librairie tierce, et il n'impose pas d'héritage multiple. L'adapter de classe (par héritage) est plus rare, limité aux langages qui supportent l'héritage multiple, et couple fortement l'adapter à l'implémentation adaptée."
---

## Le problème

Votre domaine a défini un contrat clair : pour encaisser un paiement, il attend une méthode `payer(Commande $commande): bool`. Simple, lisible, indépendant de tout prestataire.

Mais le prestataire de paiement choisi — un SDK tiers — expose une API totalement différente : `charge(int $montantEnCentimes, string $devise): StripeResponse`. Les noms ne correspondent pas, les unités non plus (centimes contre euros), et le type de retour n'est pas celui attendu.

Deux mauvaises solutions s'offrent à vous : réécrire tout le domaine pour coller à l'API du SDK (et le recommencer au prochain changement de prestataire), ou éparpiller la logique de conversion partout où le SDK est appelé. Aucune des deux ne protège le domaine des détails d'implémentation d'une librairie externe.

## L'idée générale

Le Adapter Pattern introduit une classe intermédiaire qui **traduit** un appel d'une interface vers une autre. Le domaine continue de parler son propre langage (`payer()`), et l'adapter se charge de convertir cet appel dans les termes attendus par la librairie tierce (`charge()`).

Trois éléments composent le pattern :

- **Target** : l'interface attendue par le code appelant — celle que le domaine connaît.
- **Adaptee** : la classe existante, incompatible, qu'on ne peut ou ne veut pas modifier (souvent une librairie tierce).
- **Adapter** : la classe qui implémente `Target` et délègue le travail à `Adaptee`, en traduisant les appels au passage.

Le code appelant ne sait même pas qu'un adapter existe : il continue à programmer contre l'interface qu'il connaît.

## Analogie du quotidien

Le Adapter Pattern, c'est l'adaptateur de prise électrique que vous glissez dans votre valise avant un voyage. Votre chargeur attend une prise européenne à deux broches rondes ; la prise murale de l'hôtel, à l'étranger, est complètement différente.

Vous ne modifiez ni votre chargeur, ni la prise murale : vous intercalez un petit boîtier qui traduit une forme de prise vers une autre. Le courant qui circule est le même des deux côtés — seule l'interface physique change. C'est exactement le rôle de l'adapter en code : il ne change pas ce qui se passe réellement, seulement la façon de le déclencher.

## Diagramme

{{< mermaid >}}
classDiagram
    class PaymentGatewayInterface {
        <<interface>>
        +payer(commande) bool
    }
    class StripeAdapter {
        -stripeClient: StripeClient
        +payer(commande) bool
    }
    class StripeClient {
        +charge(montantCentimes, devise) StripeResponse
    }
    class ServiceCommande {
        -gateway: PaymentGatewayInterface
        +valider(commande)
    }
    PaymentGatewayInterface <|.. StripeAdapter
    StripeAdapter --> StripeClient
    ServiceCommande --> PaymentGatewayInterface
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// --- Target : l'interface attendue par le domaine ---
interface PaymentGatewayInterface
{
    public function payer(Commande $commande): bool;
}

// --- Adaptee : le SDK tiers, incompatible, non modifiable ---
final class StripeClient
{
    public function charge(int $montantEnCentimes, string $devise): StripeResponse
    {
        // Appel réel à l'API Stripe...
        return new StripeResponse(status: 'succeeded');
    }
}

// --- Adapter : traduit Target vers Adaptee ---
final class StripeAdapter implements PaymentGatewayInterface
{
    public function __construct(private StripeClient $stripeClient) {}

    public function payer(Commande $commande): bool
    {
        $montantEnCentimes = (int) round($commande->montant() * 100);
        $response = $this->stripeClient->charge($montantEnCentimes, 'eur');

        return $response->status === 'succeeded';
    }
}

// --- Utilisation : le domaine ne connaît que PaymentGatewayInterface ---
final class ServiceCommande
{
    public function __construct(private PaymentGatewayInterface $gateway) {}

    public function valider(Commande $commande): void
    {
        if (!$this->gateway->payer($commande)) {
            throw new DomainException('Paiement refusé');
        }
    }
}

$service = new ServiceCommande(new StripeAdapter(new StripeClient()));
```

### Java

```java
// --- Target ---
interface PaymentGateway {
    boolean payer(Commande commande);
}

// --- Adaptee : SDK tiers, incompatible ---
class StripeClient {
    StripeResponse charge(int montantEnCentimes, String devise) {
        // Appel réel à l'API Stripe...
        return new StripeResponse("succeeded");
    }
}

// --- Adapter ---
class StripeAdapter implements PaymentGateway {
    private final StripeClient stripeClient;

    public StripeAdapter(StripeClient stripeClient) {
        this.stripeClient = stripeClient;
    }

    public boolean payer(Commande commande) {
        int montantEnCentimes = Math.round(commande.getMontant() * 100);
        StripeResponse response = stripeClient.charge(montantEnCentimes, "eur");
        return response.getStatus().equals("succeeded");
    }
}

// --- Utilisation ---
class ServiceCommande {
    private final PaymentGateway gateway;

    public ServiceCommande(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public void valider(Commande commande) {
        if (!gateway.payer(commande)) {
            throw new IllegalStateException("Paiement refusé");
        }
    }
}

ServiceCommande service = new ServiceCommande(new StripeAdapter(new StripeClient()));
```

### JavaScript

```javascript
// --- Adaptee : SDK tiers, incompatible ---
class StripeClient {
  charge(montantEnCentimes, devise) {
    // Appel réel à l'API Stripe...
    return { status: "succeeded" };
  }
}

// --- Adapter : expose payer(), traduit vers charge() ---
class StripeAdapter {
  constructor(stripeClient) {
    this.stripeClient = stripeClient;
  }

  payer(commande) {
    const montantEnCentimes = Math.round(commande.montant * 100);
    const response = this.stripeClient.charge(montantEnCentimes, "eur");
    return response.status === "succeeded";
  }
}

// --- Utilisation : le domaine ne connaît que payer() ---
class ServiceCommande {
  constructor(gateway) {
    this.gateway = gateway;
  }

  valider(commande) {
    if (!this.gateway.payer(commande)) {
      throw new Error("Paiement refusé");
    }
  }
}

const service = new ServiceCommande(new StripeAdapter(new StripeClient()));
```

## Quand utiliser ce pattern ?

- Quand vous devez intégrer une librairie tierce dont l'interface ne correspond pas à celle attendue par votre domaine.
- Quand vous migrez progressivement d'une ancienne API vers une nouvelle, et que vous voulez que le code appelant continue de fonctionner sans modification pendant la transition.
- Quand deux systèmes doivent cohabiter (un legacy et un nouveau) sans que l'un ne dépende directement des détails de l'autre.
- Évitez Adapter si vous contrôlez les deux côtés de l'interface : dans ce cas, il est souvent plus simple d'aligner directement les deux contrats plutôt que d'ajouter une couche de traduction.

## Points importants

- L'adapter doit rester **mince** : sa seule responsabilité est de traduire un appel, jamais d'ajouter de la logique métier.
- Il protège le domaine d'un couplage direct à une librairie tierce : changer de prestataire de paiement revient à écrire un nouvel adapter, sans toucher au domaine.
- L'adapter d'objet (composition) est presque toujours préférable à l'adapter de classe (héritage) : plus flexible, il fonctionne même avec des classes finales ou tierces.
- Adapter est souvent le premier pattern à connaître un projet vieillissant : c'est lui qui permet de faire cohabiter du code ancien et du code neuf sans tout réécrire d'un coup.
