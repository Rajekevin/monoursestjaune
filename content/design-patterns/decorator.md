---
title: "Le Pattern Decorator expliqué simplement"
description: "Le Decorator Pattern ajoute des responsabilités à un objet à l'exécution, sans héritage ni explosion de sous-classes. Explication, analogie, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Intermédiaire"
tags: ["php", "java", "javascript", "design-patterns", "solid"]
summary: "Le Decorator Pattern permet d'ajouter dynamiquement des responsabilités à un objet, en l'enveloppant dans une ou plusieurs couches qui respectent la même interface. Une alternative à l'héritage quand les combinaisons de comportements se multiplient."
bearMemory:
  - "Decorator **enveloppe** un objet en gardant **la même interface**, contrairement à Adapter qui change l'interface."
  - "Chaque decorator ajoute un comportement avant et/ou après avoir délégué l'appel à l'objet qu'il enveloppe."
  - "Signe qu'il vous faut un Decorator : des sous-classes qui explosent en combinaisons (`AvecLog`, `AvecLogEtChiffrement`, `AvecChiffrementEtRetry`...) pour couvrir toutes les variantes possibles."
interviewQuestions:
  - q: "Quelle différence entre Decorator et héritage classique ?"
    a: "L'héritage fige les combinaisons de comportements à la compilation : pour couvrir *log seul*, *chiffrement seul* et *les deux ensemble*, il faut déjà trois sous-classes, et ce nombre explose avec chaque nouvelle option. Decorator compose les comportements à l'exécution, en empilant des objets : on obtient les mêmes combinaisons avec une classe par comportement, assemblées dans l'ordre voulu au moment voulu."
  - q: "Quelle différence entre Decorator et Adapter ?"
    a: "Les deux enveloppent un objet, mais Adapter change l'interface pour la rendre compatible avec autre chose, alors que Decorator conserve strictement la même interface et l'utilise pour enrichir le comportement. Un Adapter résout une incompatibilité, un Decorator ajoute une responsabilité optionnelle."
  - q: "Quelle différence entre Decorator et Proxy ?"
    a: "Structurellement, ce sont presque les mêmes diagrammes UML : un objet qui en enveloppe un autre en partageant son interface. La différence est dans l'intention. Proxy contrôle l'accès à l'objet enveloppé (lazy loading, cache, droits d'accès) sans changer sa signification fonctionnelle. Decorator ajoute réellement une responsabilité métier ou technique visible pour l'appelant."
---

## Le problème

Un service de notification envoie des messages par e-mail. Au départ, une seule classe suffit. Puis on demande de journaliser chaque envoi. Puis de chiffrer le contenu pour certains destinataires sensibles. Puis de combiner journalisation et chiffrement, mais pas systématiquement — cela dépend du contexte d'appel.

Avec de l'héritage classique, il faudrait une sous-classe par combinaison : `EmailNotifier`, `EmailNotifierAvecLog`, `EmailNotifierChiffre`, `EmailNotifierAvecLogEtChiffre`... Deux options indépendantes donnent déjà quatre classes. Trois options en donneraient huit. Le nombre de sous-classes croît de façon exponentielle, pour un gain fonctionnel qui, lui, reste linéaire.

## L'idée générale

Le Decorator Pattern propose d'envelopper l'objet dans des couches successives, chacune respectant la **même interface** que l'objet d'origine. Chaque couche ajoute un comportement, puis délègue l'appel à la couche qu'elle enveloppe.

Quatre éléments composent le pattern :

- **Component** : l'interface commune, partagée par l'objet de base et tous les decorators.
- **ConcreteComponent** : l'implémentation de base, sans aucun enrichissement.
- **Decorator** : une classe abstraite qui implémente `Component` et détient une référence vers un autre `Component` — celui qu'elle enveloppe.
- **ConcreteDecorator** : chaque enrichissement concret (journalisation, chiffrement...), qui ajoute son comportement puis délègue à l'objet enveloppé.

Comme chaque decorator respecte la même interface que l'objet enveloppé, on peut les empiler dans n'importe quel ordre, à l'exécution, sans jamais créer de nouvelle sous-classe.

## Analogie du quotidien

Le Decorator Pattern, c'est comme s'habiller pour l'hiver. Vous partez d'un t-shirt, puis vous ajoutez un pull, puis une veste, puis un manteau si nécessaire. Chaque couche s'ajoute par-dessus la précédente, sans la remplacer, et chacune ajoute sa propre qualité — chaleur, imperméabilité, visibilité avec des bandes réfléchissantes.

À aucun moment vous n'avez besoin d'un vêtement unique et sur-mesure combinant toutes les options possibles selon la météo du jour. Vous empilez des couches indépendantes, dans l'ordre qui vous convient, et vous restez toujours reconnaissable en dessous — la personne (l'interface) ne change pas, seules les couches ajoutées varient.

## Diagramme

{{< mermaid >}}
classDiagram
    class NotificationInterface {
        <<interface>>
        +envoyer(message)
    }
    class EmailNotifier {
        +envoyer(message)
    }
    class NotificationDecorator {
        <<abstract>>
        -wrappee: NotificationInterface
        +envoyer(message)
    }
    class NotificationAvecLog {
        +envoyer(message)
    }
    class NotificationChiffree {
        +envoyer(message)
    }
    NotificationInterface <|.. EmailNotifier
    NotificationInterface <|.. NotificationDecorator
    NotificationDecorator <|-- NotificationAvecLog
    NotificationDecorator <|-- NotificationChiffree
    NotificationDecorator o--> NotificationInterface
{{< /mermaid >}}

## Exemple de code

### PHP

```php
interface NotificationInterface
{
    public function envoyer(string $message): void;
}

final class EmailNotifier implements NotificationInterface
{
    public function envoyer(string $message): void
    {
        // Envoi réel de l'e-mail...
        echo "Email envoyé : {$message}\n";
    }
}

abstract class NotificationDecorator implements NotificationInterface
{
    public function __construct(protected NotificationInterface $wrappee) {}
}

final class NotificationAvecLog extends NotificationDecorator
{
    public function envoyer(string $message): void
    {
        error_log("Envoi en cours : {$message}");
        $this->wrappee->envoyer($message);
    }
}

final class NotificationChiffree extends NotificationDecorator
{
    public function envoyer(string $message): void
    {
        $this->wrappee->envoyer($this->chiffrer($message));
    }

    private function chiffrer(string $message): string
    {
        return base64_encode($message); // simplifié pour l'exemple
    }
}

// Utilisation : les couches se combinent librement, à l'exécution
$notifier = new NotificationAvecLog(
    new NotificationChiffree(
        new EmailNotifier()
    )
);

$notifier->envoyer('Votre commande est confirmée');
```

### Java

```java
interface Notification {
    void envoyer(String message);
}

class EmailNotifier implements Notification {
    public void envoyer(String message) {
        System.out.println("Email envoyé : " + message);
    }
}

abstract class NotificationDecorator implements Notification {
    protected final Notification wrappee;

    protected NotificationDecorator(Notification wrappee) {
        this.wrappee = wrappee;
    }
}

class NotificationAvecLog extends NotificationDecorator {
    public NotificationAvecLog(Notification wrappee) {
        super(wrappee);
    }

    public void envoyer(String message) {
        System.out.println("Log : envoi en cours - " + message);
        wrappee.envoyer(message);
    }
}

class NotificationChiffree extends NotificationDecorator {
    public NotificationChiffree(Notification wrappee) {
        super(wrappee);
    }

    public void envoyer(String message) {
        wrappee.envoyer(chiffrer(message));
    }

    private String chiffrer(String message) {
        return Base64.getEncoder().encodeToString(message.getBytes());
    }
}

// Utilisation
Notification notifier = new NotificationAvecLog(
    new NotificationChiffree(
        new EmailNotifier()
    )
);

notifier.envoyer("Votre commande est confirmée");
```

### JavaScript

```javascript
class EmailNotifier {
  envoyer(message) {
    console.log(`Email envoyé : ${message}`);
  }
}

class NotificationDecorator {
  constructor(wrappee) {
    this.wrappee = wrappee;
  }
}

class NotificationAvecLog extends NotificationDecorator {
  envoyer(message) {
    console.log(`Log : envoi en cours - ${message}`);
    this.wrappee.envoyer(message);
  }
}

class NotificationChiffree extends NotificationDecorator {
  envoyer(message) {
    this.wrappee.envoyer(this.chiffrer(message));
  }

  chiffrer(message) {
    return Buffer.from(message).toString("base64");
  }
}

// Utilisation : les couches se combinent librement, à l'exécution
const notifier = new NotificationAvecLog(
  new NotificationChiffree(
    new EmailNotifier()
  )
);

notifier.envoyer("Votre commande est confirmée");
```

## Quand utiliser ce pattern ?

- Quand plusieurs responsabilités optionnelles doivent pouvoir se combiner librement, sans multiplier les sous-classes pour chaque combinaison.
- Quand vous voulez pouvoir **ajouter ou retirer un comportement à l'exécution**, ce que l'héritage statique ne permet pas.
- Quand la logique ajoutée (journalisation, mise en cache, validation, chiffrement) est transverse et indépendante du comportement métier principal.
- Évitez Decorator si une seule combinaison de comportements existe réellement : une sous-classe simple suffit, et empiler des couches inutiles complique la lecture sans bénéfice.

## Points importants

- Un decorator garde **exactement la même interface** que l'objet enveloppé — c'est ce qui permet de les empiler sans que le code appelant s'en aperçoive.
- L'ordre d'empilement peut avoir un impact réel : chiffrer avant de journaliser ne produit pas le même log que journaliser avant de chiffrer.
- Le pattern est à la base du concept de *middleware* qu'on retrouve dans la plupart des frameworks web (Express, PSR-15, ASP.NET) : chaque middleware est un decorator autour du traitement d'une requête.
- Utilisé sans discipline, Decorator peut produire une pile d'objets difficile à déboguer : documentez l'ordre attendu, ou fournissez une fabrique qui construit la pile correcte pour chaque cas d'usage.
