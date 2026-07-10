---
title: "Architecture hexagonale"
description: "L'architecture hexagonale isole le métier du reste du monde via des ports (interfaces) et des adaptateurs (implémentations techniques). Explication, analogie, diagramme et code."
date: 2026-07-10
category: "Architecture logicielle"
difficulty: "Intermédiaire"
tags: ["architecture", "clean-architecture", "php", "java", "javascript"]
summary: "L'architecture hexagonale (Ports & Adapters) place le métier au centre et le connecte au monde extérieur via des ports — des interfaces définies par le métier — implémentés par des adaptateurs interchangeables. La base de données, l'API REST ou la CLI ne sont que des détails branchés sur ces ports."
bearMemory:
  - "Un **port** est une interface définie côté métier ; un **adaptateur** est une implémentation technique de ce port."
  - "Il existe deux familles de ports : les **ports primaires** (le monde extérieur pilote le métier) et les **ports secondaires** (le métier pilote le monde extérieur)."
  - "Le métier ne connaît que des ports, jamais des adaptateurs — remplacer une base de données ou une API externe ne doit jamais toucher au cœur métier."
interviewQuestions:
  - q: "Quelle différence entre un port primaire et un port secondaire ?"
    a: "Un port primaire (ou *driving port*) est le point d'entrée du métier : c'est l'interface qu'un adaptateur extérieur — un contrôleur HTTP, une commande CLI — utilise pour déclencher une action métier. Un port secondaire (ou *driven port*) est un point de sortie : c'est une interface que le métier appelle pour parler au monde extérieur, comme un repository ou un service d'envoi d'e-mails. Le métier définit les deux, mais dans un sens il est appelé, dans l'autre il appelle."
  - q: "En quoi l'architecture hexagonale diffère-t-elle de la Clean Architecture ?"
    a: "Elles partagent le même objectif — isoler le métier des détails techniques — et la même règle de fond : les dépendances pointent vers le métier, jamais l'inverse. L'hexagonale utilise un vocabulaire plus simple, port et adaptateur, sans imposer de nombre de cercles précis. La Clean Architecture formalise davantage la structure interne du métier (Entities, Use Cases). Dans la pratique quotidienne, les deux se traduisent par le même code : des interfaces définies dans le domaine, implémentées à l'extérieur."
  - q: "Pourquoi appelle-t-on ça une architecture 'hexagonale' précisément ?"
    a: "Le nombre six n'a rien de spécial — Alistair Cockburn, qui a formalisé ce style en 2005, a choisi un hexagone simplement pour avoir assez de faces pour représenter plusieurs ports sans donner l'illusion qu'il n'y en a que deux (comme un rectangle le suggérerait, avec une entrée et une sortie). L'idée à retenir n'est pas la forme géométrique, mais le fait que le métier peut avoir un nombre arbitraire de ports, chacun branché à un ou plusieurs adaptateurs."
---

## Le problème

Une application qui expose sa logique métier uniquement via une API REST fonctionne très bien, jusqu'au jour où il faut aussi l'exposer via une commande CLI pour les traitements batch, ou via un worker qui consomme une file de messages. Si la logique métier est écrite à l'intérieur des contrôleurs HTTP, elle doit être dupliquée — ou pire, le worker se met à appeler l'API HTTP en interne, ce qui ajoute une latence et une fragilité inutiles.

Le même problème se pose côté sortie : le métier appelle directement un client PostgreSQL, un SDK d'envoi d'e-mails, une bibliothèque de paiement. Tester ce métier isolément devient impossible sans mocker des dizaines de dépendances techniques, et changer de fournisseur de paiement oblige à modifier le cœur du système plutôt qu'un simple point de branchement.

## L'idée générale

L'architecture hexagonale, formalisée par Alistair Cockburn, place le métier au centre et matérialise chaque point de contact avec l'extérieur sous la forme d'un **port** : une interface définie par le métier lui-même, jamais par la technique.

Deux familles de ports coexistent :

- **Ports primaires (driving)** : le point d'entrée du métier. Un adaptateur extérieur — contrôleur HTTP, commande CLI, listener de message — appelle le métier à travers ce port pour déclencher une action.
- **Ports secondaires (driven)** : le point de sortie du métier. Le métier appelle ce port pour parler au monde extérieur — persister une donnée, envoyer un e-mail, appeler une API tierce — sans jamais connaître l'implémentation réelle derrière.

Chaque port est ensuite branché à un ou plusieurs **adaptateurs**, qui traduisent entre le langage du métier et celui d'une technologie précise. Un adaptateur REST et un adaptateur CLI peuvent tous deux utiliser le même port primaire ; un adaptateur PostgreSQL et un adaptateur en mémoire (pour les tests) peuvent tous deux implémenter le même port secondaire.

C'est très exactement la même idée que la Clean Architecture — isoler le métier, inverser les dépendances techniques — mais avec un vocabulaire plus direct : on ne parle pas de cercles, on parle de ce qui entre (port primaire) et de ce qui sort (port secondaire).

## Analogie du quotidien

Pensez à une prise électrique murale. La prise (le **port**) définit un contrat standard — une forme, une tension — sans se soucier de ce qui sera branché dessus. Une lampe, un chargeur de téléphone ou un aspirateur sont autant d'**adaptateurs** différents qui respectent ce même contrat.

La prise ne sait pas, et n'a pas besoin de savoir, ce qu'elle alimente. Vous pouvez débrancher la lampe et brancher l'aspirateur sans toucher au mur, au circuit électrique, ni à l'installation elle-même. C'est exactement le rôle d'un port : offrir un contrat stable auquel n'importe quel adaptateur compatible peut se connecter, sans jamais exposer les détails internes du système derrière.

## Diagramme

{{< mermaid >}}
flowchart LR
    subgraph Primaires["Adaptateurs primaires (pilotent le métier)"]
        HTTP[Contrôleur HTTP]
        CLI[Commande CLI]
    end

    subgraph Hexagone["Métier"]
        PortIn[["Port primaire : SouscrireNewsletterPort"]]
        Core((Logique métier))
        PortOut[["Port secondaire : AbonneRepositoryPort"]]
        PortMail[["Port secondaire : NotificationPort"]]
        PortIn --> Core
        Core --> PortOut
        Core --> PortMail
    end

    subgraph Secondaires["Adaptateurs secondaires (pilotés par le métier)"]
        DB[(Adaptateur PostgreSQL)]
        Mail[Adaptateur SMTP]
    end

    HTTP --> PortIn
    CLI --> PortIn
    PortOut -.implémenté par.-> DB
    PortMail -.implémenté par.-> Mail
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// --- Port primaire : ce que le métier expose au monde extérieur ---
interface SouscrireNewsletterPort
{
    public function souscrire(string $email): void;
}

// --- Port secondaire : ce dont le métier a besoin, sans savoir comment c'est implémenté ---
interface AbonneRepositoryPort
{
    public function existe(string $email): bool;
    public function sauvegarder(string $email): void;
}

interface NotificationPort
{
    public function envoyerBienvenue(string $email): void;
}

// --- Métier : implémente le port primaire, dépend uniquement des ports secondaires ---
final class SouscrireNewsletterService implements SouscrireNewsletterPort
{
    public function __construct(
        private AbonneRepositoryPort $repository,
        private NotificationPort $notifications,
    ) {}

    public function souscrire(string $email): void
    {
        if ($this->repository->existe($email)) {
            throw new DomainException('Cet e-mail est déjà inscrit');
        }

        $this->repository->sauvegarder($email);
        $this->notifications->envoyerBienvenue($email);
    }
}

// --- Adaptateur primaire : traduit une requête HTTP en appel au port primaire ---
final class SouscriptionController
{
    public function __construct(private SouscrireNewsletterPort $service) {}

    public function post(Requete $requete): Reponse
    {
        $this->service->souscrire($requete->get('email'));
        return new Reponse(201);
    }
}

// --- Adaptateur secondaire : implémente le port avec une technologie précise ---
final class PostgresAbonneRepository implements AbonneRepositoryPort
{
    public function __construct(private PDO $pdo) {}

    public function existe(string $email): bool
    {
        $stmt = $this->pdo->prepare('SELECT 1 FROM abonnes WHERE email = ?');
        $stmt->execute([$email]);
        return (bool) $stmt->fetchColumn();
    }

    public function sauvegarder(string $email): void
    {
        $stmt = $this->pdo->prepare('INSERT INTO abonnes (email) VALUES (?)');
        $stmt->execute([$email]);
    }
}
```

### Java

```java
// --- Port primaire ---
public interface SouscrireNewsletterPort {
    void souscrire(String email);
}

// --- Ports secondaires ---
public interface AbonneRepositoryPort {
    boolean existe(String email);
    void sauvegarder(String email);
}

public interface NotificationPort {
    void envoyerBienvenue(String email);
}

// --- Métier ---
public class SouscrireNewsletterService implements SouscrireNewsletterPort {
    private final AbonneRepositoryPort repository;
    private final NotificationPort notifications;

    public SouscrireNewsletterService(AbonneRepositoryPort repository, NotificationPort notifications) {
        this.repository = repository;
        this.notifications = notifications;
    }

    public void souscrire(String email) {
        if (repository.existe(email)) {
            throw new IllegalStateException("Cet e-mail est déjà inscrit");
        }

        repository.sauvegarder(email);
        notifications.envoyerBienvenue(email);
    }
}

// --- Adaptateur primaire ---
@RestController
public class SouscriptionController {
    private final SouscrireNewsletterPort service;

    public SouscriptionController(SouscrireNewsletterPort service) {
        this.service = service;
    }

    @PostMapping("/newsletter")
    public ResponseEntity<Void> souscrire(@RequestBody SouscriptionRequest requete) {
        service.souscrire(requete.email());
        return ResponseEntity.status(201).build();
    }
}

// --- Adaptateur secondaire ---
public class JpaAbonneRepository implements AbonneRepositoryPort {
    private final EntityManager em;

    public JpaAbonneRepository(EntityManager em) {
        this.em = em;
    }

    public boolean existe(String email) {
        return em.createQuery("SELECT 1 FROM Abonne a WHERE a.email = :email")
                 .setParameter("email", email)
                 .getResultList()
                 .size() > 0;
    }

    public void sauvegarder(String email) {
        em.persist(new Abonne(email));
    }
}
```

### JavaScript

```javascript
// --- Métier : dépend d'abstractions passées en paramètre (pas d'interfaces formelles en JS) ---
class SouscrireNewsletterService {
  constructor(repository, notifications) {
    this.repository = repository; // port secondaire
    this.notifications = notifications; // port secondaire
  }

  async souscrire(email) {
    if (await this.repository.existe(email)) {
      throw new Error("Cet e-mail est déjà inscrit");
    }

    await this.repository.sauvegarder(email);
    await this.notifications.envoyerBienvenue(email);
  }
}

// --- Adaptateur primaire : route Express qui pilote le métier ---
app.post("/newsletter", async (req, res) => {
  await souscrireNewsletterService.souscrire(req.body.email);
  res.status(201).end();
});

// --- Adaptateur secondaire : implémentation MongoDB du port repository ---
class MongoAbonneRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async existe(email) {
    return (await this.collection.countDocuments({ email })) > 0;
  }

  async sauvegarder(email) {
    await this.collection.insertOne({ email });
  }
}
```

## Quand utiliser l'architecture hexagonale ?

- Quand le même métier doit être exposé par plusieurs points d'entrée : API REST, CLI, worker asynchrone, GraphQL.
- Quand vous voulez tester le métier sans base de données réelle ni service externe, en substituant un adaptateur en mémoire au port secondaire.
- Quand une dépendance technique externe (fournisseur de paiement, service d'e-mail, base de données) a de bonnes chances de changer un jour.
- À éviter sur un CRUD simple sans logique métier significative : multiplier les ports et adaptateurs pour brancher un formulaire sur une table n'apporte rien.

## Points importants

- Un port est **toujours défini côté métier**, jamais côté technique — c'est cette inversion qui permet de changer d'adaptateur sans toucher au cœur du système.
- Ne confondez pas port primaire et port secondaire : le sens de l'appel définit la catégorie, pas la technologie utilisée.
- L'architecture hexagonale et la Clean Architecture ne sont pas deux concurrents à départager : ce sont deux formulations du même principe d'inversion de dépendance, avec un vocabulaire différent.
- Un adaptateur en mémoire, écrit uniquement pour les tests, est souvent le meilleur signe que vos ports sont bien conçus : s'il est simple à écrire, c'est que le contrat du port est propre.
