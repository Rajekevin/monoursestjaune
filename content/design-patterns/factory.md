---
title: "Le Pattern Factory expliqué simplement"
description: "Le Factory Pattern centralise la logique de création d'objets pour découpler le code client des classes concrètes. Explication, analogie, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Intermédiaire"
tags: ["php", "java", "javascript", "design-patterns", "oop"]
summary: "Le Factory Pattern encapsule la logique de création d'un objet dans une méthode ou une classe dédiée, plutôt que de disperser des `new` conditionnels dans tout le code. Le client dépend d'une interface, jamais des classes concrètes créées derrière."
bearMemory:
  - "Factory centralise la logique de **création** d'objets ; le client ne dépend que d'une interface, jamais des classes concrètes."
  - "Signal d'alerte : un `if`/`switch` sur un type qui décide quelle classe instancier, répété à plusieurs endroits du code."
  - "Factory crée un seul objet à la fois ; Abstract Factory crée une famille d'objets cohérents entre eux — ne pas confondre les deux en entretien."
interviewQuestions:
  - q: "Quelle différence entre Factory et Abstract Factory ?"
    a: "Factory crée un seul type d'objet à partir d'un paramètre (ou d'une condition). Abstract Factory crée plusieurs objets liés entre eux qui doivent rester cohérents entre eux — une famille complète — typiquement via une interface qui déclare une méthode de création par type de produit. Abstract Factory est d'ailleurs souvent composée de plusieurs Factory internes, une par produit de la famille."
  - q: "Factory viole-t-elle le principe ouvert/fermé, puisqu'il faut modifier un switch pour ajouter un type ?"
    a: "En partie, oui : ajouter un nouveau type d'objet implique de modifier la Factory. C'est un compromis assumé — on concentre la modification en un seul endroit clairement identifié, plutôt que de la disperser dans tout le code appelant. Pour un respect plus strict du principe, on peut combiner Factory avec un registre (une map associant un type à un constructeur) alimenté dynamiquement."
  - q: "Peut-on remplacer une Factory par un simple `new` quand il n'y a qu'un seul type d'objet possible ?"
    a: "Oui, absolument. Le pattern ajoute une indirection qui n'a de sens que si la création varie selon un contexte, ou qu'elle est suffisamment complexe pour mériter d'être isolée. Pour un seul type fixe, un appel direct au constructeur est plus simple et parfaitement suffisant."
---

## Le problème

Une application doit envoyer des notifications aux utilisateurs : par email, par SMS, ou par notification push, selon leurs préférences. Le code appelant écrit quelque chose comme :

```php
if ($type === 'email') {
    $notification = new EmailNotification();
} elseif ($type === 'sms') {
    $notification = new SmsNotification();
} elseif ($type === 'push') {
    $notification = new PushNotification();
}
```

Ce bloc de code, on le retrouve bientôt copié-collé à cinq endroits différents de l'application. Le jour où un nouveau canal de notification apparaît (WhatsApp, par exemple), il faut retrouver et modifier chacun de ces endroits — avec le risque d'en oublier un, ou de les faire diverger légèrement les uns des autres.

## L'idée générale

Le Factory Pattern déplace cette logique de décision dans un **seul endroit dédié** : une méthode ou une classe dont le seul travail est de créer le bon objet selon un paramètre, et de le retourner sous la forme d'une interface commune.

Le code client ne fait plus jamais `new EmailNotification()` lui-même : il demande à la Factory *"donne-moi une notification de type email"*, sans jamais savoir précisément quelle classe concrète il reçoit en retour.

## Analogie du quotidien

C'est comme commander au comptoir d'un fast-food. Vous demandez "un menu numéro 3" — vous n'avez pas besoin de savoir comment la cuisine assemble le burger, quelles sauces elle utilise ni dans quel ordre elle empile les ingrédients. Le comptoir (la Factory) prend votre commande, décide en interne comment la préparer, et vous remet un plat fini, prêt à consommer. Si demain le restaurant change sa recette du menu 3, vous n'avez rien à changer dans votre façon de commander.

## Diagramme

{{< mermaid >}}
classDiagram
    class NotificationFactory {
        +creer(type: string) Notification$
    }
    class Notification {
        <<interface>>
        +envoyer(message: string)
    }
    class EmailNotification {
        +envoyer(message: string)
    }
    class SmsNotification {
        +envoyer(message: string)
    }
    class PushNotification {
        +envoyer(message: string)
    }
    NotificationFactory ..> Notification
    Notification <|.. EmailNotification
    Notification <|.. SmsNotification
    Notification <|.. PushNotification
{{< /mermaid >}}

## Exemple de code

### PHP

```php
interface Notification
{
    public function envoyer(string $message): void;
}

final class EmailNotification implements Notification
{
    public function envoyer(string $message): void
    {
        echo "Email envoyé : {$message}" . PHP_EOL;
    }
}

final class SmsNotification implements Notification
{
    public function envoyer(string $message): void
    {
        echo "SMS envoyé : {$message}" . PHP_EOL;
    }
}

final class PushNotification implements Notification
{
    public function envoyer(string $message): void
    {
        echo "Push envoyé : {$message}" . PHP_EOL;
    }
}

final class NotificationFactory
{
    public static function creer(string $type): Notification
    {
        return match ($type) {
            'email' => new EmailNotification(),
            'sms'   => new SmsNotification(),
            'push'  => new PushNotification(),
            default => throw new InvalidArgumentException("Type inconnu : {$type}"),
        };
    }
}

// Utilisation
$notification = NotificationFactory::creer('sms');
$notification->envoyer("Votre commande est expédiée");
```

### Java

```java
interface Notification {
    void envoyer(String message);
}

class EmailNotification implements Notification {
    public void envoyer(String message) {
        System.out.println("Email envoyé : " + message);
    }
}

class SmsNotification implements Notification {
    public void envoyer(String message) {
        System.out.println("SMS envoyé : " + message);
    }
}

class PushNotification implements Notification {
    public void envoyer(String message) {
        System.out.println("Push envoyé : " + message);
    }
}

class NotificationFactory {
    public static Notification creer(String type) {
        return switch (type) {
            case "email" -> new EmailNotification();
            case "sms" -> new SmsNotification();
            case "push" -> new PushNotification();
            default -> throw new IllegalArgumentException("Type inconnu : " + type);
        };
    }
}

// Utilisation
Notification notification = NotificationFactory.creer("sms");
notification.envoyer("Votre commande est expédiée");
```

### JavaScript

```javascript
class EmailNotification {
  envoyer(message) {
    console.log(`Email envoyé : ${message}`);
  }
}

class SmsNotification {
  envoyer(message) {
    console.log(`SMS envoyé : ${message}`);
  }
}

class PushNotification {
  envoyer(message) {
    console.log(`Push envoyé : ${message}`);
  }
}

class NotificationFactory {
  static creer(type) {
    switch (type) {
      case "email": return new EmailNotification();
      case "sms": return new SmsNotification();
      case "push": return new PushNotification();
      default: throw new Error(`Type inconnu : ${type}`);
    }
  }
}

// Utilisation
const notification = NotificationFactory.creer("sms");
notification.envoyer("Votre commande est expédiée");
```

## Quand utiliser ce pattern ?

- Quand la logique de création dépend d'une condition (type, configuration, environnement) et qu'on veut la centraliser en un seul endroit.
- Quand on veut isoler le code client des classes concrètes, pour qu'il ne dépende que d'une interface commune.
- Quand ajouter un nouveau type d'objet ne doit pas obliger à modifier le code appelant partout où l'objet est utilisé.

## Points importants

- Factory ne concerne qu'un seul type d'objet à la fois. Dès qu'il faut créer plusieurs objets liés entre eux qui doivent rester cohérents (une famille complète), il faut envisager un Abstract Factory.
- Une Factory Method est souvent une simple méthode statique ou une méthode d'une petite classe dédiée ; dans certains langages, une closure ou une fonction fabrique légère peut la remplacer pour des cas triviaux.
- Ne transformez pas chaque `new` du code en Factory par principe : le pattern se justifie quand la logique de création varie réellement ou devient complexe, pas systématiquement.
