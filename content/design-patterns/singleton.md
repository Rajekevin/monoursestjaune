---
title: "Le Pattern Singleton expliqué simplement"
description: "Le Singleton garantit qu'une classe n'a jamais qu'une seule instance dans toute l'application. Explication, pièges classiques, analogie, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Débutant"
tags: ["php", "java", "javascript", "design-patterns", "oop"]
summary: "Le Singleton garantit qu'une classe n'a qu'une seule instance, accessible depuis n'importe où dans l'application. Pratique en apparence, mais c'est aussi l'un des patterns les plus critiqués : il introduit un état global qui rend le code difficile à tester et à faire évoluer."
bearMemory:
  - "Singleton garantit une seule instance accessible globalement, mais ce n'est pas un but en soi : c'est un compromis qui introduit de l'état global caché."
  - "À ne pas confondre avec une instance unique gérée par un conteneur d'injection de dépendances (scope *singleton*) : celle-ci reste testable, contrairement au Singleton codé en dur."
  - "Signal d'alerte : si vos tests unitaires doivent réinitialiser un état statique entre deux exécutions, un Singleton est probablement en cause."
interviewQuestions:
  - q: "Quelle différence entre un Singleton et une instance unique gérée par un conteneur d'injection de dépendances ?"
    a: "Le Singleton classique impose l'unicité dans le code lui-même, via un constructeur privé et un accès statique global — impossible à remplacer par un mock en test, couplage fort. Avec un conteneur DI (Spring, Symfony...), l'unicité n'est qu'une configuration de portée (scope singleton) : la classe reste un objet ordinaire, injectable et testable, et le conteneur pourrait tout aussi bien lui donner un scope différent sans changer une ligne de code métier."
  - q: "Pourquoi le Singleton est-il considéré comme un anti-pattern par beaucoup de développeurs ?"
    a: "Il introduit un état global accessible depuis n'importe où, ce qui crée des dépendances cachées entre des parties du code qui semblent indépendantes. Cela rend les tests unitaires fragiles — l'état d'un test peut fuiter sur le suivant — et le code difficile à faire évoluer, car retirer ou remplacer le Singleton implique de traquer tous ses appels dans toute la base de code."
  - q: "Le Singleton pose-t-il un problème avec le multithreading ?"
    a: "Oui : si deux threads appellent getInstance() exactement en même temps avant que l'instance existe, il est possible de créer deux instances distinctes. En Java, on protège généralement la création avec synchronized ou un holder statique pour garantir qu'une seule instance est jamais créée, même sous forte concurrence."
---

## Le problème

Une application a besoin d'un point d'accès unique à une ressource partagée : un journal d'application (logger), une configuration lue une seule fois au démarrage, une connexion à un pilote de log. Si chaque partie du code crée sa propre instance de cette classe, on se retrouve avec plusieurs fichiers de logs distincts, des états incohérents, et des ressources dupliquées inutilement.

Le besoin est simple à formuler : *il ne doit exister qu'une seule instance de cette classe dans toute l'application, et tout le monde doit accéder à la même.*

## L'idée générale

Le Singleton répond à ce besoin de deux façons combinées :

- Il rend le **constructeur privé**, pour empêcher quiconque de faire `new MaClasse()` depuis l'extérieur.
- Il expose une **méthode statique** (généralement `getInstance()`) qui crée l'instance la première fois qu'elle est appelée, puis retourne toujours cette même instance ensuite.

Le résultat : peu importe combien de fois `getInstance()` est appelée, et depuis quel endroit du code, c'est toujours le même objet qui est retourné.

## Analogie du quotidien

C'est comme la caisse enregistreuse unique d'un petit commerce. Si chaque vendeur utilisait sa propre caisse pour encaisser les clients, les comptes de fin de journée ne correspondraient jamais : chacun aurait sa propre version de l'historique des ventes. En n'ayant qu'une seule caisse partagée par tous les vendeurs, il n'existe qu'une seule source de vérité, cohérente à tout moment.

## Diagramme

{{< mermaid >}}
classDiagram
    class Singleton {
        -instance: Singleton$
        -Singleton()
        +getInstance() Singleton$
        +log(message)
    }
{{< /mermaid >}}

## Exemple de code

### PHP

```php
final class Logger
{
    private static ?Logger $instance = null;
    private array $logs = [];

    private function __construct() {}

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function log(string $message): void
    {
        $this->logs[] = $message;
        echo "[LOG] {$message}" . PHP_EOL;
    }
}

// Utilisation
Logger::getInstance()->log("Application démarrée");
Logger::getInstance()->log("Utilisateur connecté");
// Les deux appels utilisent exactement la même instance
```

### Java

```java
public final class Logger {
    private static Logger instance;
    private final List<String> logs = new ArrayList<>();

    private Logger() {}

    public static synchronized Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }

    public void log(String message) {
        logs.add(message);
        System.out.println("[LOG] " + message);
    }
}

// Utilisation
Logger.getInstance().log("Application démarrée");
Logger.getInstance().log("Utilisateur connecté");
// synchronized évite que deux threads créent deux instances en même temps
```

### JavaScript

```javascript
class Logger {
  static #instance;
  #logs = [];

  constructor() {
    if (Logger.#instance) {
      return Logger.#instance;
    }
    Logger.#instance = this;
  }

  log(message) {
    this.#logs.push(message);
    console.log(`[LOG] ${message}`);
  }
}

// Utilisation
new Logger().log("Application démarrée");
new Logger().log("Utilisateur connecté");
// new Logger() renvoie toujours la même instance
```

## Quand utiliser ce pattern ?

- Quand une ressource doit véritablement être unique par nature dans l'application : un cache en mémoire partagé, un accès à un pilote de log, un registre de configuration en lecture seule.
- Quand la création répétée de l'objet serait coûteuse ou incohérente si elle existait en plusieurs exemplaires.

Dans la grande majorité des autres cas, préférez l'injection de dépendances : demandez à votre framework ou conteneur de gérer une instance unique avec un scope adapté, plutôt que de coder l'unicité en dur dans la classe elle-même.

## Points importants

- Le principal reproche fait au Singleton : il introduit un **état global caché**, ce qui crée des dépendances invisibles entre des parties du code qui semblent pourtant indépendantes.
- Il rend les tests unitaires plus fragiles : l'état du Singleton peut fuiter d'un test à l'autre si rien n'est prévu pour le réinitialiser entre deux exécutions.
- Ne confondez pas le Singleton codé en dur avec une instance unique gérée par un conteneur d'injection de dépendances : dans ce second cas, la classe reste un objet ordinaire, injectable et remplaçable par un mock en test — seule sa portée (son *scope*) est configurée comme singleton.
- En environnement multithread (Java, notamment), la création de l'instance doit être protégée contre les accès concurrents, sous peine de voir deux instances créées simultanément.
