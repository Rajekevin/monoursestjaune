---
title: "Le Pattern Dependency Injection expliqué simplement"
description: "L'injection de dépendances consiste à fournir ses dépendances à un objet plutôt qu'à les construire soi-même. Explication, analogie, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Intermédiaire"
tags: ["php", "java", "javascript", "design-patterns", "solid"]
summary: "L'injection de dépendances (Dependency Injection) consiste à fournir à un objet ce dont il a besoin depuis l'extérieur, plutôt que de le laisser construire lui-même ses dépendances. Un principe simple qui rend le code testable et remplaçable."
bearMemory:
  - "DI consiste à **recevoir** ses dépendances (constructeur, setter) plutôt qu'à les **construire soi-même** avec `new` à l'intérieur d'une classe."
  - "L'injection par constructeur est la forme par défaut à privilégier : elle garantit qu'un objet est toujours dans un état valide, dépendances obligatoires incluses."
  - "Un conteneur DI (Symfony, Spring, etc.) n'est qu'un **outil qui automatise le câblage** : le principe DI fonctionne très bien sans conteneur, à la main, au point d'entrée de l'application."
interviewQuestions:
  - q: "Quelle différence entre Dependency Injection et Service Locator ?"
    a: "Avec un Service Locator, une classe va elle-même chercher ses dépendances dans un registre global (`ServiceLocator::get(MailerInterface::class)`) : les dépendances sont cachées à l'intérieur du code, invisibles depuis la signature du constructeur. Avec Dependency Injection, les dépendances sont explicites et révélées par le constructeur — on voit immédiatement de quoi une classe a besoin, et on peut les remplacer facilement par des mocks en test. C'est pour cette raison que Service Locator est aujourd'hui considéré comme un anti-pattern dans la plupart des contextes."
  - q: "Quelle différence entre Dependency Injection et le principe d'inversion de dépendance (DIP) ?"
    a: "Le DIP (le D de SOLID) est une règle de conception : les modules doivent dépendre d'abstractions, pas de détails concrets. Dependency Injection est une technique concrète qui permet d'appliquer cette règle : au lieu qu'une classe instancie elle-même une implémentation concrète, on lui fournit une abstraction depuis l'extérieur. DIP dit *quoi faire*, DI est *une façon de le faire*."
  - q: "Injection par constructeur ou par setter, laquelle choisir ?"
    a: "L'injection par constructeur est à privilégier pour les dépendances obligatoires : l'objet ne peut pas exister dans un état incomplet, et la dépendance est immuable une fois l'objet construit. L'injection par setter convient aux dépendances optionnelles, ou à celles qui doivent pouvoir changer après la construction de l'objet — mais elle laisse une fenêtre où l'objet existe sans sa dépendance, ce qui est plus risqué."
---

## Le problème

Une classe `ServiceInscription` a besoin d'envoyer un e-mail de bienvenue. La solution la plus directe : créer l'instance du mailer directement à l'intérieur de la classe, avec `new SmtpMailer()`. Ça fonctionne, mais ce choix a un coût caché.

`ServiceInscription` dépend maintenant d'une implémentation SMTP précise, câblée en dur. Impossible de tester la classe sans envoyer un vrai e-mail à chaque test. Impossible de changer de fournisseur d'e-mail (passer à un service tiers, ou à un mailer factice en environnement de développement) sans modifier le code de `ServiceInscription` lui-même. La classe qui devrait se concentrer sur la logique d'inscription se retrouve responsable, en plus, de savoir comment construire un mailer SMTP.

## L'idée générale

L'injection de dépendances renverse la responsabilité de construction : au lieu qu'une classe construise elle-même ce dont elle a besoin, elle le **reçoit de l'extérieur**, déjà prêt à l'emploi. La classe dépend d'une interface, jamais d'une implémentation concrète qu'elle devrait instancier.

Trois formes principales existent :

- **Injection par constructeur** : les dépendances sont passées au moment de la création de l'objet. C'est la forme à privilégier pour les dépendances obligatoires — l'objet n'existe jamais dans un état incomplet.
- **Injection par setter** : les dépendances sont fournies après la construction, via une méthode dédiée. Utile pour des dépendances optionnelles ou remplaçables en cours de vie de l'objet.
- **Injection par interface** : la classe implémente une interface qui impose une méthode d'injection, moins courante en pratique.

Un **conteneur DI** (comme le composant Symfony DependencyInjection, Spring en Java, ou InversifyJS/NestJS en JavaScript) automatise ce câblage : il sait construire l'arbre complet des dépendances et les injecter au bon endroit. Le conteneur est un outil pratique, pas le principe lui-même — on peut faire de l'injection de dépendances à la main, sans aucun conteneur, en câblant tout au point d'entrée de l'application.

## Analogie du quotidien

L'injection de dépendances, c'est comme une lampe de chevet branchée sur le secteur. La lampe a besoin d'électricité pour fonctionner, mais elle ne la produit pas elle-même : elle se contente d'un fil et d'une prise standard.

Peu importe que le courant vienne d'une centrale nucléaire, d'un panneau solaire ou d'un groupe électrogène — la lampe fonctionne exactement pareil, sans rien savoir de la source. Si vous changez de fournisseur d'électricité, vous ne démontez pas la lampe : vous changez ce qui est branché derrière la prise. La lampe (la classe) dépend d'une interface standard (la prise), jamais d'une centrale précise (une implémentation concrète).

## Diagramme

{{< mermaid >}}
classDiagram
    class MailerInterface {
        <<interface>>
        +envoyer(destinataire, message)
    }
    class SmtpMailer {
        +envoyer(destinataire, message)
    }
    class MailerDeTest {
        +envoyer(destinataire, message)
    }
    class ServiceInscription {
        -mailer: MailerInterface
        +inscrire(email)
    }
    MailerInterface <|.. SmtpMailer
    MailerInterface <|.. MailerDeTest
    ServiceInscription --> MailerInterface
{{< /mermaid >}}

## Exemple de code

### PHP

```php
interface MailerInterface
{
    public function envoyer(string $destinataire, string $message): void;
}

final class SmtpMailer implements MailerInterface
{
    public function envoyer(string $destinataire, string $message): void
    {
        // Envoi réel via SMTP...
        mail($destinataire, 'Bienvenue', $message);
    }
}

// --- Injection par constructeur : dépendance obligatoire ---
final class ServiceInscription
{
    public function __construct(private MailerInterface $mailer) {}

    public function inscrire(string $email): void
    {
        // ... logique d'inscription ...
        $this->mailer->envoyer($email, 'Bienvenue parmi nous !');
    }
}

// Câblage manuel, sans conteneur
$service = new ServiceInscription(new SmtpMailer());

// Avec un conteneur DI (exemple Symfony), le câblage est automatique :
// $container->set(MailerInterface::class, SmtpMailer::class);
// $service = $container->get(ServiceInscription::class);

// En test, on injecte un double sans jamais toucher SmtpMailer
final class MailerDeTest implements MailerInterface
{
    public array $messagesEnvoyes = [];

    public function envoyer(string $destinataire, string $message): void
    {
        $this->messagesEnvoyes[] = [$destinataire, $message];
    }
}
```

### Java

```java
public interface Mailer {
    void envoyer(String destinataire, String message);
}

public class SmtpMailer implements Mailer {
    public void envoyer(String destinataire, String message) {
        // Envoi réel via SMTP...
        System.out.println("Email envoyé à " + destinataire);
    }
}

// --- Injection par constructeur : dépendance obligatoire ---
public class ServiceInscription {
    private final Mailer mailer;

    public ServiceInscription(Mailer mailer) {
        this.mailer = mailer;
    }

    public void inscrire(String email) {
        // ... logique d'inscription ...
        mailer.envoyer(email, "Bienvenue parmi nous !");
    }
}

// Câblage manuel
ServiceInscription service = new ServiceInscription(new SmtpMailer());

// Avec Spring, le conteneur automatise l'injection :
// @Service
// public class ServiceInscription {
//     public ServiceInscription(Mailer mailer) { this.mailer = mailer; } // @Autowired implicite
// }

// --- Injection par setter : dépendance optionnelle ou remplaçable ---
public class ServiceNotification {
    private Mailer mailer;

    public void setMailer(Mailer mailer) {
        this.mailer = mailer;
    }
}
```

### JavaScript

```javascript
class SmtpMailer {
  envoyer(destinataire, message) {
    // Envoi réel via SMTP...
    console.log(`Email envoyé à ${destinataire}`);
  }
}

// --- Injection par constructeur : dépendance obligatoire ---
class ServiceInscription {
  constructor(mailer) {
    this.mailer = mailer;
  }

  inscrire(email) {
    // ... logique d'inscription ...
    this.mailer.envoyer(email, "Bienvenue parmi nous !");
  }
}

// Câblage manuel, sans conteneur
const service = new ServiceInscription(new SmtpMailer());

// Avec un conteneur DI (ex. NestJS), le câblage est automatique via décorateurs :
// @Injectable()
// class ServiceInscription {
//   constructor(private mailer) {}
// }

// En test, on injecte un double sans jamais toucher SmtpMailer
class MailerDeTest {
  constructor() {
    this.messagesEnvoyes = [];
  }

  envoyer(destinataire, message) {
    this.messagesEnvoyes.push({ destinataire, message });
  }
}

const serviceDeTest = new ServiceInscription(new MailerDeTest());
```

## Quand utiliser ce pattern ?

- Dès qu'une classe dépend d'un service dont l'implémentation peut varier entre les environnements (production, test, développement local) : mailer, logger, client HTTP, repository.
- Quand vous voulez tester une classe en isolation, sans dépendre d'une infrastructure réelle (base de données, SMTP, API externe).
- Quand le graphe de dépendances devient large : c'est là qu'un conteneur DI devient utile, pour éviter de câbler des dizaines d'objets à la main.
- En pratique, c'est une bonne pratique par défaut plutôt qu'un choix ponctuel : instancier une dépendance en dur avec `new` à l'intérieur d'une classe doit rester l'exception, justifiée, pas la norme.

## Points importants

- Ne confondez pas le principe (injecter plutôt que construire) et l'outil (un conteneur DI) : le premier s'applique même dans un script de dix lignes, le second n'est utile qu'à partir d'un graphe de dépendances conséquent.
- L'injection par constructeur est la forme par défaut : elle rend les dépendances visibles dans la signature, et garantit qu'un objet mal construit ne peut pas exister.
- Le "point de composition" (l'endroit où toutes les dépendances sont assemblées) doit rester unique et proche du point d'entrée de l'application — jamais éparpillé dans la logique métier.
- Attention au Service Locator, souvent présenté comme une alternative pratique à DI : il masque les dépendances réelles d'une classe et rend le code plus difficile à tester et à comprendre à la simple lecture d'un constructeur.
