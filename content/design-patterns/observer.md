---
title: "Le Pattern Observer expliqué simplement"
description: "L'Observer Pattern permet à un objet de notifier automatiquement une liste d'abonnés à chaque changement d'état. Explication, analogie, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Intermédiaire"
tags: ["php", "java", "javascript", "design-patterns", "event-driven"]
summary: "L'Observer Pattern définit une relation un-à-plusieurs : quand un objet change d'état, tous ses abonnés sont notifiés automatiquement, sans que l'émetteur ait besoin de connaître leur nature exacte. C'est le pattern derrière les event listeners et les systèmes pub/sub."
bearMemory:
  - "Observer notifie automatiquement **tous les abonnés** d'un changement d'état, sans que le Subject ait besoin de les connaître individuellement."
  - "C'est le pattern derrière `addEventListener` et `EventEmitter` : vous l'utilisez probablement déjà sans le nommer."
  - "Ne pas oublier le désabonnement (`removeEventListener`/`desabonner`) : c'est la cause la plus fréquente de fuite mémoire liée à ce pattern."
interviewQuestions:
  - q: "Quelle différence entre Observer et pub/sub (publish/subscribe) ?"
    a: "Dans l'Observer classique, le Subject connaît directement ses observateurs : il détient la liste et les appelle lui-même, c'est un couplage direct bien que faible. Dans un vrai pub/sub, un intermédiaire (un message broker, un event bus) se place entre les émetteurs et les abonnés, qui ne se connaissent pas du tout entre eux — ce qui permet en plus la communication asynchrone et inter-processus. Le pub/sub est souvent vu comme une évolution distribuée de l'Observer."
  - q: "Quelle différence entre Observer et Strategy ?"
    a: "Strategy encapsule un algorithme interchangeable, choisi explicitement par le client, avec une seule stratégie active à la fois. Observer notifie potentiellement plusieurs abonnés en parallèle dès qu'un événement survient, sans qu'aucun ne soit sélectionné. Les deux patterns répondent à des besoins différents : faire varier un comportement contre réagir à un changement d'état."
  - q: "Comment implémenter Observer en JavaScript sans tout écrire à la main ?"
    a: "Le DOM fournit déjà addEventListener/removeEventListener, et Node.js fournit la classe EventEmitter — toutes deux sont des implémentations prêtes à l'emploi du pattern Observer. Il est rarement nécessaire de le réimplémenter à la main dans un projet JavaScript ou Node, sauf pour un besoin très spécifique."
---

## Le problème

Quand le statut d'une commande change — payée, expédiée, livrée — plusieurs parties du système doivent réagir : envoyer un email au client, envoyer un SMS, notifier l'entrepôt pour préparer l'envoi. Si la classe `Commande` appelle directement chacun de ces services dans sa méthode `changerStatut()`, elle devient couplée à tous ses « abonnés ». Chaque nouveau besoin de notification oblige alors à rouvrir cette classe centrale et à la modifier, encore et encore.

## L'idée générale

L'Observer définit une relation un-à-plusieurs : quand l'état d'un objet (le **Subject**) change, tous les objets qui s'y sont abonnés (les **Observers**) sont automatiquement notifiés, sans que le Subject ait besoin de connaître leur nature exacte.

Trois éléments composent le pattern :

- **Subject** : l'objet observé, qui maintient une liste d'observateurs et les notifie à chaque changement pertinent.
- **Observer** : l'interface commune que chaque abonné implémente, souvent une seule méthode (`notifier()`).
- **ConcreteObserver** : chaque implémentation concrète, qui réagit à sa manière à la notification reçue.

## Analogie du quotidien

C'est comme s'abonner à une chaîne YouTube. Le créateur de contenu (le Subject) ne connaît pas individuellement chaque abonné : il publie simplement une nouvelle vidéo. Tous les abonnés (les Observers) reçoivent une notification automatiquement, chacun réagissant à sa façon — l'un regarde immédiatement, l'autre ignore la notification et regardera plus tard. Le créateur peut gagner ou perdre des abonnés à tout moment sans jamais avoir à changer sa façon de publier du contenu.

## Diagramme

{{< mermaid >}}
classDiagram
    class SuiviCommande {
        -observers: List~Observer~
        +abonner(o: Observer)
        +desabonner(o: Observer)
        +changerStatut(statut)
    }
    class Observer {
        <<interface>>
        +notifier(statut)
    }
    class NotificationEmail {
        +notifier(statut)
    }
    class NotificationSms {
        +notifier(statut)
    }
    class ServiceEntrepot {
        +notifier(statut)
    }
    SuiviCommande o--> Observer
    Observer <|.. NotificationEmail
    Observer <|.. NotificationSms
    Observer <|.. ServiceEntrepot
{{< /mermaid >}}

## Exemple de code

### PHP

```php
interface Observer
{
    public function notifier(string $statut): void;
}

final class NotificationEmail implements Observer
{
    public function notifier(string $statut): void
    {
        echo "Email : votre commande est maintenant '{$statut}'" . PHP_EOL;
    }
}

final class NotificationSms implements Observer
{
    public function notifier(string $statut): void
    {
        echo "SMS : statut mis à jour -> {$statut}" . PHP_EOL;
    }
}

final class ServiceEntrepot implements Observer
{
    public function notifier(string $statut): void
    {
        if ($statut === 'payee') {
            echo "Entrepôt : préparation de l'envoi lancée" . PHP_EOL;
        }
    }
}

final class SuiviCommande
{
    /** @var Observer[] */
    private array $observers = [];

    public function abonner(Observer $observer): void
    {
        $this->observers[] = $observer;
    }

    public function desabonner(Observer $observer): void
    {
        $this->observers = array_filter($this->observers, fn ($o) => $o !== $observer);
    }

    public function changerStatut(string $statut): void
    {
        foreach ($this->observers as $observer) {
            $observer->notifier($statut);
        }
    }
}

// Utilisation
$commande = new SuiviCommande();
$commande->abonner(new NotificationEmail());
$commande->abonner(new NotificationSms());
$commande->abonner(new ServiceEntrepot());

$commande->changerStatut('payee');
// Les trois observateurs réagissent, chacun à sa manière
```

### Java

```java
interface Observer {
    void notifier(String statut);
}

class NotificationEmail implements Observer {
    public void notifier(String statut) {
        System.out.println("Email : votre commande est maintenant '" + statut + "'");
    }
}

class NotificationSms implements Observer {
    public void notifier(String statut) {
        System.out.println("SMS : statut mis à jour -> " + statut);
    }
}

class ServiceEntrepot implements Observer {
    public void notifier(String statut) {
        if (statut.equals("payee")) {
            System.out.println("Entrepôt : préparation de l'envoi lancée");
        }
    }
}

class SuiviCommande {
    private final List<Observer> observers = new ArrayList<>();

    public void abonner(Observer observer) {
        observers.add(observer);
    }

    public void desabonner(Observer observer) {
        observers.remove(observer);
    }

    public void changerStatut(String statut) {
        for (Observer observer : observers) {
            observer.notifier(statut);
        }
    }
}

// Utilisation
SuiviCommande commande = new SuiviCommande();
commande.abonner(new NotificationEmail());
commande.abonner(new NotificationSms());
commande.abonner(new ServiceEntrepot());

commande.changerStatut("payee");
// Les trois observateurs réagissent, chacun à sa manière
```

### JavaScript

```javascript
class NotificationEmail {
  notifier(statut) {
    console.log(`Email : votre commande est maintenant '${statut}'`);
  }
}

class NotificationSms {
  notifier(statut) {
    console.log(`SMS : statut mis à jour -> ${statut}`);
  }
}

class ServiceEntrepot {
  notifier(statut) {
    if (statut === "payee") {
      console.log("Entrepôt : préparation de l'envoi lancée");
    }
  }
}

class SuiviCommande {
  #observers = [];

  abonner(observer) {
    this.#observers.push(observer);
  }

  desabonner(observer) {
    this.#observers = this.#observers.filter((o) => o !== observer);
  }

  changerStatut(statut) {
    this.#observers.forEach((observer) => observer.notifier(statut));
  }
}

// Utilisation
const commande = new SuiviCommande();
commande.abonner(new NotificationEmail());
commande.abonner(new NotificationSms());
commande.abonner(new ServiceEntrepot());

commande.changerStatut("payee");
// Les trois observateurs réagissent, chacun à sa manière
```

## Quand utiliser ce pattern ?

- Quand plusieurs parties du système doivent réagir à un même événement, sans que l'émetteur ait besoin de les connaître individuellement.
- Quand le nombre d'abonnés peut varier dans le temps, avec des ajouts ou des retraits à l'exécution.
- Quand on veut découpler l'objet qui déclenche un changement de ceux qui y réagissent, pour pouvoir les faire évoluer indépendamment.

Évitez Observer si un seul destinataire réagit toujours de la même façon : un appel de méthode direct est plus simple et plus facile à suivre.

## Points importants

- Observer est la base théorique des event listeners du DOM (`addEventListener`), des `EventEmitter` de Node.js, et des systèmes pub/sub — le pattern est omniprésent, même sans être nommé explicitement.
- Attention à l'ordre de notification : si les observateurs doivent s'exécuter dans un ordre précis ou en parallèle, c'est au Subject de le gérer explicitement.
- Un Observer qui lève une exception peut interrompre la notification des suivants si rien n'est prévu pour l'isoler : pensez à englober chaque notification dans un `try/catch` si l'un des abonnés ne doit pas bloquer les autres.
- Toujours prévoir un moyen de se désabonner (`desabonner`) : l'oublier est une cause fréquente de fuite mémoire, notamment en JavaScript avec les écouteurs d'événements jamais retirés.
