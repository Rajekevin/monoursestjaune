---
title: "Clean Architecture expliquée simplement"
description: "La Clean Architecture organise le code en cercles concentriques pour protéger la logique métier des détails techniques. Explication, analogie, diagramme et code."
date: 2026-07-10
category: "Architecture logicielle"
difficulty: "Avancé"
tags: ["architecture", "clean-architecture", "php", "java", "ddd"]
summary: "La Clean Architecture organise le code en cercles concentriques : le métier au centre, les détails techniques (base de données, framework, UI) à l'extérieur. La règle est simple — les dépendances ne pointent jamais vers l'extérieur."
bearMemory:
  - "La règle de dépendance : le code du **centre ne connaît jamais** le code des couches extérieures — jamais l'inverse."
  - "La base de données est un **détail**, pas le cœur du système : le métier ne doit jamais dépendre de Doctrine, d'Eloquent ou d'un SGBD précis."
  - "On inverse les dépendances techniques via des **interfaces définies dans le domaine** et implémentées à l'extérieur (Dependency Inversion)."
interviewQuestions:
  - q: "Quelle différence entre Clean Architecture et architecture hexagonale ?"
    a: "Elles partagent la même idée fondatrice — isoler le métier des détails techniques — mais l'organisent différemment. L'hexagonale parle de *ports et adaptateurs* autour d'un noyau métier. La Clean Architecture formalise plusieurs cercles concentriques (Entities, Use Cases, Interface Adapters, Frameworks). En pratique, ce sont deux variantes du même principe : l'inversion de dépendance vers le métier."
  - q: "Pourquoi ne pas mettre la logique métier directement dans les modèles Eloquent/Doctrine ?"
    a: "Parce que ça couple votre métier à un ORM précis : changer d'ORM, ou même juste faire évoluer le schéma technique, devient risqué pour la logique métier. En séparant les deux, le métier reste testable en mémoire, sans base de données, et survit aux changements d'infrastructure."
  - q: "La Clean Architecture n'ajoute-t-elle pas trop de complexité pour un petit projet ?"
    a: "Oui, souvent. C'est un compromis : plus de fichiers et d'indirection en échange d'un métier protégé et testable. Sur un CRUD simple avec peu de logique métier, le surcoût n'est généralement pas justifié. Elle prend tout son sens quand la logique métier est riche et doit survivre à plusieurs changements d'infrastructure."
---

## Le problème

Un projet démarre souvent avec le framework au centre : les routes appellent des contrôleurs, qui appellent directement l'ORM, qui parle à la base de données. Ça va vite, au début. Mais la logique métier — les vraies règles de l'entreprise — se retrouve éparpillée dans les contrôleurs, les modèles et parfois même les vues.

Le jour où il faut changer de base de données, exposer la même logique via une API et une CLI, ou simplement écrire un test qui ne dépend pas d'une vraie base de données, on découvre que tout est emmêlé. Le métier dépend du framework, qui dépend de la base de données, qui dépend d'un service externe — impossible de tirer un seul fil sans faire bouger tout l'édifice.

## L'idée générale

La Clean Architecture (formalisée par Robert C. Martin) organise le code en **cercles concentriques**. Plus on va vers le centre, plus le code est stable et indépendant des détails techniques :

- **Entities** (centre) : les règles métier les plus générales, indépendantes de toute application précise.
- **Use Cases** : les règles métier spécifiques à l'application — ce que le système fait réellement.
- **Interface Adapters** : les contrôleurs, présentateurs, et convertisseurs entre le monde extérieur et les use cases.
- **Frameworks & Drivers** (extérieur) : la base de données, le framework web, l'UI — les détails.

La règle qui tient tout l'édifice s'appelle la **règle de dépendance** : le code source ne peut dépendre que vers l'intérieur. Rien dans un cercle intérieur ne peut connaître quoi que ce soit d'un cercle extérieur — ni son nom, ni son existence.

## Analogie du quotidien

La Clean Architecture, c'est comme l'organisation d'un restaurant. La recette (le métier) ne dépend pas du fournisseur de légumes précis, ni du modèle de four utilisé. Le chef applique sa recette — *faire revenir, assaisonner, dresser* — peu importe si les légumes viennent du marché du coin ou d'un grossiste, peu importe si le four est à gaz ou électrique.

Les fournisseurs et les équipements (la base de données, le framework, l'API externe) sont interchangeables. La recette, elle, reste stable : c'est elle qui définit le résultat, pas les outils utilisés pour l'obtenir. Si demain le restaurant change de fournisseur de légumes, la recette ne change pas — seul le "branchement" avec le nouveau fournisseur doit être adapté.

## Diagramme

{{< mermaid >}}
flowchart TD
    subgraph Ext["Frameworks & Drivers"]
        DB[(Base de données)]
        Web[Framework web]
    end
    subgraph Adapt["Interface Adapters"]
        Ctrl[Contrôleur]
        Repo[Implémentation Repository]
    end
    subgraph UC["Use Cases"]
        Uc[CreerCommandeUseCase]
    end
    subgraph Ent["Entities"]
        Ent1[Commande]
    end

    Web --> Ctrl
    Ctrl --> Uc
    Uc --> Ent1
    Uc -->|dépend d'une interface| RepoI[[CommandeRepositoryInterface]]
    Repo -.implémente.-> RepoI
    Repo --> DB
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// --- Domaine (centre) : aucune dépendance technique ---
final class Commande
{
    public function __construct(
        private string $id,
        private float $montant,
    ) {}

    public function estValide(): bool
    {
        return $this->montant > 0;
    }
}

interface CommandeRepositoryInterface
{
    public function sauvegarder(Commande $commande): void;
}

// --- Use case : orchestre le métier, dépend d'une interface, pas d'une implémentation ---
final class CreerCommandeUseCase
{
    public function __construct(private CommandeRepositoryInterface $repository) {}

    public function executer(string $id, float $montant): void
    {
        $commande = new Commande($id, $montant);

        if (!$commande->estValide()) {
            throw new DomainException('Commande invalide');
        }

        $this->repository->sauvegarder($commande);
    }
}

// --- Détail technique (extérieur) : implémente l'interface, jamais l'inverse ---
final class DoctrineCommandeRepository implements CommandeRepositoryInterface
{
    public function __construct(private EntityManagerInterface $em) {}

    public function sauvegarder(Commande $commande): void
    {
        $this->em->persist($commande);
        $this->em->flush();
    }
}
```

### Java

```java
// --- Domaine (centre) ---
public final class Commande {
    private final String id;
    private final double montant;

    public Commande(String id, double montant) {
        this.id = id;
        this.montant = montant;
    }

    public boolean estValide() {
        return montant > 0;
    }
}

public interface CommandeRepository {
    void sauvegarder(Commande commande);
}

// --- Use case ---
public class CreerCommandeUseCase {
    private final CommandeRepository repository;

    public CreerCommandeUseCase(CommandeRepository repository) {
        this.repository = repository;
    }

    public void executer(String id, double montant) {
        Commande commande = new Commande(id, montant);

        if (!commande.estValide()) {
            throw new IllegalStateException("Commande invalide");
        }

        repository.sauvegarder(commande);
    }
}

// --- Détail technique (extérieur) ---
public class JpaCommandeRepository implements CommandeRepository {
    private final EntityManager em;

    public JpaCommandeRepository(EntityManager em) {
        this.em = em;
    }

    public void sauvegarder(Commande commande) {
        em.persist(commande);
    }
}
```

### JavaScript

```javascript
// --- Domaine (centre) ---
class Commande {
  constructor(id, montant) {
    this.id = id;
    this.montant = montant;
  }

  estValide() {
    return this.montant > 0;
  }
}

// --- Use case : dépend d'une abstraction (un objet avec la méthode sauvegarder) ---
class CreerCommandeUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  executer(id, montant) {
    const commande = new Commande(id, montant);

    if (!commande.estValide()) {
      throw new Error("Commande invalide");
    }

    this.repository.sauvegarder(commande);
  }
}

// --- Détail technique (extérieur) ---
class MongoCommandeRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async sauvegarder(commande) {
    await this.collection.insertOne(commande);
  }
}
```

## Quand utiliser ce pattern ?

- Sur des applications avec une **logique métier riche**, qui doit rester stable même quand les choix techniques changent (base de données, framework, fournisseur externe).
- Quand plusieurs interfaces doivent exposer le même métier (API REST, CLI, worker asynchrone) sans dupliquer les règles.
- Quand la testabilité du métier, indépendamment de toute infrastructure, est une priorité.
- À éviter sur un petit projet ou un prototype : l'indirection ajoutée (interfaces, use cases, mapping) coûte cher si la logique métier est simple ou évolue peu.

## Points importants

- La règle de dépendance se vérifie souvent par une question simple : *ce fichier importe-t-il un framework, un ORM ou un client HTTP ?* Si oui, ce n'est pas du domaine.
- Les interfaces qui permettent l'inversion de dépendance (comme `CommandeRepositoryInterface`) sont **définies dans le domaine**, mais **implémentées à l'extérieur** — c'est ce détail qui fait fonctionner toute l'architecture.
- Clean Architecture, architecture hexagonale et Ports & Adapters partagent le même objectif : ce sont des variantes d'un même principe, pas des concurrents à choisir absolument.
- Ce n'est pas gratuit : plus de fichiers, plus d'indirection. Le bénéfice apparaît sur la durée, pas sur le premier commit.
