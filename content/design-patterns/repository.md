---
title: "Le Pattern Repository expliqué simplement"
description: "Le Repository Pattern encapsule l'accès aux données derrière une interface orientée métier. Explication, analogie, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Intermédiaire"
tags: ["php", "java", "javascript", "design-patterns", "ddd", "architecture"]
summary: "Le Repository Pattern cache les détails de stockage (SQL, ORM, API externe) derrière une interface orientée métier. Le domaine manipule des objets, pas des requêtes — l'implémentation concrète du stockage reste un détail interchangeable."
bearMemory:
  - "L'interface du Repository vit dans le **domaine** ; son implémentation (SQL, ORM, en mémoire) vit à **l'extérieur** — c'est de l'inversion de dépendance appliquée à la persistance."
  - "Un Repository expose un **vocabulaire métier** (`trouverUtilisateurActif`), pas un vocabulaire technique de table (`SELECT * FROM users WHERE...`)."
  - "Signe qu'il vous manque un Repository : votre logique métier appelle directement un ORM ou une requête SQL, ce qui rend les tests impossibles sans une vraie base de données."
interviewQuestions:
  - q: "Quelle différence entre Repository et DAO (Data Access Object) ?"
    a: "Un DAO expose généralement une interface proche de la table qu'il manipule — souvent du CRUD technique, une classe par table. Un Repository, lui, est pensé du point de vue du domaine : il manipule des agrégats métier complets et expose des méthodes qui parlent le langage de l'application (`trouverCommandesEnAttente()`), pas celui de la base de données. En pratique, un Repository peut être implémenté à l'aide d'un ou plusieurs DAO en interne."
  - q: "Pourquoi ne pas appeler directement l'ORM depuis le code métier ?"
    a: "Parce que ça couple la logique métier à un détail technique précis. Si demain vous changez d'ORM, de moteur de base de données, ou voulez simplement tester votre logique sans base de données réelle, tout le code métier qui appelle l'ORM directement doit être touché. En passant par une interface de domaine, seule l'implémentation du Repository change — le métier, lui, reste stable."
  - q: "Un Repository doit-il correspondre à une table de la base de données ?"
    a: "Non, et c'est une confusion fréquente. Un Repository correspond à un agrégat métier (au sens Domain-Driven Design), pas à une table. Un agrégat `Commande` peut être stocké sur plusieurs tables (commandes, lignes de commande) tout en n'exposant qu'un seul `CommandeRepositoryInterface` — la complexité du mapping reste cachée dans l'implémentation."
---

## Le problème

Un contrôleur d'inscription construit directement une requête SQL, ou appelle un ORM, pour vérifier si un e-mail existe déjà avant de créer un utilisateur. Six mois plus tard, cette même vérification est dupliquée dans trois endroits différents : le contrôleur web, une commande CLI d'import, et un job asynchrone.

Impossible de tester la logique d'inscription sans une vraie base de données en marche. Impossible de changer d'ORM ou de moteur de stockage sans traquer tous les appels techniques éparpillés dans le code métier. La logique de *comment on stocke* et la logique de *ce que fait l'application* sont mélangées, et chaque évolution technique risque de casser une règle métier qu'on ne voit même plus.

## L'idée générale

Le Repository Pattern introduit une **interface orientée métier** qui cache entièrement la façon dont les données sont stockées et récupérées. Le domaine ne connaît que cette interface : `trouverParEmail()`, `sauvegarder()` — jamais une requête SQL, jamais un client ORM.

Deux éléments composent le pattern :

- **RepositoryInterface** : définie dans le domaine, elle déclare les opérations dont le métier a besoin, dans son propre vocabulaire.
- **Implémentation concrète** : vit à l'extérieur du domaine (couche infrastructure), et traduit ces opérations vers un mécanisme de stockage précis — base SQL, NoSQL, API externe, ou même une simple liste en mémoire pour les tests.

C'est une application directe du principe d'inversion de dépendance déjà rencontré dans l'article sur la [Clean Architecture](/architecture-logicielle/clean-architecture-expliquee-simplement) : l'interface est définie *par* le domaine, mais implémentée *en dehors* de lui. Le domaine dépend d'une abstraction qu'il possède, jamais d'un détail technique qu'il ne maîtrise pas.

## Analogie du quotidien

Le Repository Pattern, c'est comme demander un livre à un bibliothécaire. Vous dites *« Je cherche tel roman »* — vous ne précisez jamais dans quelle salle, sur quelle étagère, ni même si le livre est physiquement dans ce bâtiment ou dans une réserve externe.

Le bibliothécaire (le Repository) sait où et comment chercher : il traduit votre demande en une action de recherche précise, peu importe le système de rangement utilisé derrière. Si la bibliothèque change d'organisation, ou numérise sa réserve, votre façon de demander un livre ne change pas — seul le travail du bibliothécaire s'adapte.

## Diagramme

{{< mermaid >}}
classDiagram
    class UtilisateurRepositoryInterface {
        <<interface>>
        +trouverParEmail(email) Utilisateur
        +sauvegarder(utilisateur)
    }
    class ServiceInscription {
        -repository: UtilisateurRepositoryInterface
        +inscrire(email) Utilisateur
    }
    class PdoUtilisateurRepository {
        +trouverParEmail(email) Utilisateur
        +sauvegarder(utilisateur)
    }
    class InMemoryUtilisateurRepository {
        +trouverParEmail(email) Utilisateur
        +sauvegarder(utilisateur)
    }
    UtilisateurRepositoryInterface <|.. PdoUtilisateurRepository
    UtilisateurRepositoryInterface <|.. InMemoryUtilisateurRepository
    ServiceInscription --> UtilisateurRepositoryInterface
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// --- Domaine : l'interface vit ici, aucune dépendance technique ---
interface UtilisateurRepositoryInterface
{
    public function trouverParEmail(string $email): ?Utilisateur;
    public function sauvegarder(Utilisateur $utilisateur): void;
}

final class ServiceInscription
{
    public function __construct(private UtilisateurRepositoryInterface $repository) {}

    public function inscrire(string $email): Utilisateur
    {
        if ($this->repository->trouverParEmail($email) !== null) {
            throw new DomainException('Cet e-mail est déjà utilisé');
        }

        $utilisateur = new Utilisateur($email);
        $this->repository->sauvegarder($utilisateur);

        return $utilisateur;
    }
}

// --- Infrastructure : implémentation réelle, en dehors du domaine ---
final class PdoUtilisateurRepository implements UtilisateurRepositoryInterface
{
    public function __construct(private PDO $pdo) {}

    public function trouverParEmail(string $email): ?Utilisateur
    {
        $stmt = $this->pdo->prepare('SELECT * FROM utilisateurs WHERE email = ?');
        $stmt->execute([$email]);
        $row = $stmt->fetch();

        return $row ? Utilisateur::depuisLigne($row) : null;
    }

    public function sauvegarder(Utilisateur $utilisateur): void
    {
        $stmt = $this->pdo->prepare('INSERT INTO utilisateurs (email) VALUES (?)');
        $stmt->execute([$utilisateur->email()]);
    }
}

// --- Tests : implémentation en mémoire, aucune base de données requise ---
final class InMemoryUtilisateurRepository implements UtilisateurRepositoryInterface
{
    private array $utilisateurs = [];

    public function trouverParEmail(string $email): ?Utilisateur
    {
        return $this->utilisateurs[$email] ?? null;
    }

    public function sauvegarder(Utilisateur $utilisateur): void
    {
        $this->utilisateurs[$utilisateur->email()] = $utilisateur;
    }
}
```

### Java

```java
// --- Domaine : l'interface vit ici ---
public interface UtilisateurRepository {
    Optional<Utilisateur> trouverParEmail(String email);
    void sauvegarder(Utilisateur utilisateur);
}

public class ServiceInscription {
    private final UtilisateurRepository repository;

    public ServiceInscription(UtilisateurRepository repository) {
        this.repository = repository;
    }

    public Utilisateur inscrire(String email) {
        if (repository.trouverParEmail(email).isPresent()) {
            throw new IllegalStateException("Cet e-mail est déjà utilisé");
        }

        Utilisateur utilisateur = new Utilisateur(email);
        repository.sauvegarder(utilisateur);

        return utilisateur;
    }
}

// --- Infrastructure : implémentation JPA, en dehors du domaine ---
public class JpaUtilisateurRepository implements UtilisateurRepository {
    private final EntityManager em;

    public JpaUtilisateurRepository(EntityManager em) {
        this.em = em;
    }

    public Optional<Utilisateur> trouverParEmail(String email) {
        return em.createQuery("SELECT u FROM Utilisateur u WHERE u.email = :email", Utilisateur.class)
                 .setParameter("email", email)
                 .getResultStream()
                 .findFirst();
    }

    public void sauvegarder(Utilisateur utilisateur) {
        em.persist(utilisateur);
    }
}

// --- Tests : implémentation en mémoire ---
public class InMemoryUtilisateurRepository implements UtilisateurRepository {
    private final Map<String, Utilisateur> utilisateurs = new HashMap<>();

    public Optional<Utilisateur> trouverParEmail(String email) {
        return Optional.ofNullable(utilisateurs.get(email));
    }

    public void sauvegarder(Utilisateur utilisateur) {
        utilisateurs.put(utilisateur.getEmail(), utilisateur);
    }
}
```

### JavaScript

```javascript
// --- Domaine : ServiceInscription ne dépend que d'un "contrat" implicite ---
class ServiceInscription {
  constructor(repository) {
    this.repository = repository;
  }

  async inscrire(email) {
    const existant = await this.repository.trouverParEmail(email);
    if (existant) {
      throw new Error("Cet e-mail est déjà utilisé");
    }

    const utilisateur = new Utilisateur(email);
    await this.repository.sauvegarder(utilisateur);

    return utilisateur;
  }
}

// --- Infrastructure : implémentation réelle, via un client de base de données ---
class SqlUtilisateurRepository {
  constructor(db) {
    this.db = db;
  }

  async trouverParEmail(email) {
    const row = await this.db.get("SELECT * FROM utilisateurs WHERE email = ?", [email]);
    return row ? Utilisateur.depuisLigne(row) : null;
  }

  async sauvegarder(utilisateur) {
    await this.db.run("INSERT INTO utilisateurs (email) VALUES (?)", [utilisateur.email]);
  }
}

// --- Tests : implémentation en mémoire, aucune base de données requise ---
class InMemoryUtilisateurRepository {
  constructor() {
    this.utilisateurs = new Map();
  }

  async trouverParEmail(email) {
    return this.utilisateurs.get(email) ?? null;
  }

  async sauvegarder(utilisateur) {
    this.utilisateurs.set(utilisateur.email, utilisateur);
  }
}
```

## Quand utiliser ce pattern ?

- Quand la logique métier doit rester indépendante du mécanisme de stockage (SQL, NoSQL, API externe, fichier).
- Quand vous voulez tester votre logique métier sans dépendre d'une vraie base de données, grâce à une implémentation en mémoire.
- Quand plusieurs sources de données doivent pouvoir être interchangeables (migration de SGBD, ajout d'un cache, bascule progressive vers un nouveau système).
- Évitez d'ajouter un Repository pour un CRUD trivial sans logique métier autour : l'indirection ajoutée n'apporte rien si le code appelant se contente déjà de faire du SQL basique sans règle à protéger.

## Points importants

- L'interface du Repository est définie **dans le domaine**, son implémentation vit **à l'extérieur** — exactement le mécanisme d'inversion de dépendance détaillé dans l'article sur la Clean Architecture.
- Un bon Repository expose un vocabulaire métier, pas un vocabulaire de table : préférez `trouverCommandesEnAttente()` à des méthodes génériques calquées sur le SQL.
- Un Repository correspond en général à un agrégat métier complet, pas à une table brute — le mapping entre les deux peut être complexe et doit rester caché dans l'implémentation.
- L'implémentation en mémoire n'est pas un détail secondaire : c'est elle qui rend vos tests rapides et fiables, sans base de données à démarrer ni à nettoyer entre chaque test.
