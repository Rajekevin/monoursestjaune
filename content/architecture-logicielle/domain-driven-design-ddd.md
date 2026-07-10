---
title: "Domain Driven Design (DDD)"
description: "Le Domain Driven Design place le langage et les règles du métier au centre du logiciel, via des concepts comme le bounded context, l'ubiquitous language et les agrégats."
date: 2026-07-10
category: "Architecture logicielle"
difficulty: "Avancé"
tags: ["ddd", "architecture", "clean-architecture", "php", "java"]
summary: "Le Domain Driven Design (DDD) est autant une démarche de modélisation métier qu'une technique de code. Il propose un vocabulaire partagé avec les experts métier, des frontières explicites entre sous-domaines (bounded context), et des règles précises pour modéliser entités, value objects et agrégats."
bearMemory:
  - "Le DDD commence par le **langage**, pas par le code : l'ubiquitous language force développeurs et experts métier à parler exactement les mêmes mots."
  - "Un même mot peut avoir des sens différents selon le **bounded context** : un 'Client' en facturation n'est pas le même objet qu'un 'Client' en support technique."
  - "Une **entité** a une identité qui persiste dans le temps ; un **value object** n'a pas d'identité, seule sa valeur compte, et il est immuable."
interviewQuestions:
  - q: "Quelle différence entre une entité et un value object ?"
    a: "Une entité est définie par son identité, qui reste stable même si ses attributs changent — deux commandes avec le même montant restent deux commandes distinctes si leurs identifiants diffèrent. Un value object est défini uniquement par sa valeur : deux objets Money de 10 euros sont interchangeables, et un value object est immuable — on n'en modifie jamais un, on en crée un nouveau."
  - q: "Qu'est-ce qu'un agrégat, et pourquoi impose-t-il une racine ?"
    a: "Un agrégat est un groupe d'entités et de value objects traités comme une seule unité de cohérence : on ne charge, modifie et persiste jamais une partie de l'agrégat isolément. La racine d'agrégat (aggregate root) est le seul point d'entrée autorisé de l'extérieur : elle garantit que toutes les modifications respectent les invariants métier, en interdisant l'accès direct aux objets internes de l'agrégat."
  - q: "Le DDD est-il utile en dehors d'une architecture complexe type microservices ?"
    a: "Oui, et c'est une idée reçue fréquente. Les concepts tactiques du DDD — entités, value objects, agrégats, langage omniprésent — s'appliquent très bien dans un simple monolithe bien structuré. Le bounded context, lui, devient particulièrement précieux dès que plusieurs équipes ou plusieurs sous-domaines commencent à se marcher sur les pieds avec des définitions métier divergentes, avec ou sans microservices."
---

## Le problème

Un système qui grossit finit presque toujours par accumuler des mots ambigus. Le terme « Client » désigne, selon l'endroit du code, soit un compte de facturation, soit un contact commercial, soit un utilisateur connecté à l'application. Chaque équipe ajoute des champs à un même objet `Client` pour répondre à ses propres besoins, jusqu'à obtenir une classe de 40 attributs dont personne ne comprend plus vraiment le rôle exact.

Le second symptôme est linguistique : les développeurs parlent de « records », de « rows », de « DTOs », pendant que les experts métier parlent de « contrats », de « résiliations », de « sinistres ». La traduction entre ces deux vocabulaires se perd à chaque réunion, et chaque malentendu se traduit tôt ou tard par un bug ou une fonctionnalité mal comprise.

## L'idée générale

Le Domain Driven Design, formalisé par Eric Evans, part d'un principe simple : le code doit refléter le métier aussi fidèlement que possible, avec exactement le même vocabulaire. C'est autant une démarche de modélisation qu'une technique de code — le DDD se divise d'ailleurs traditionnellement en deux volets :

**Le DDD stratégique**, qui s'occupe des frontières :

- **Ubiquitous language** (langage omniprésent) : un vocabulaire unique, défini avec les experts métier, utilisé aussi bien dans les conversations que dans le nom des classes et des méthodes. Si les experts métier disent « résilier un contrat », le code contient une méthode `resilier()`, pas `updateStatus()`.
- **Bounded context** (contexte borné) : une frontière explicite à l'intérieur de laquelle un mot a un sens unique et précis. Le mot « Client » peut légitimement désigner des choses différentes dans le contexte Facturation et dans le contexte Support — tant que chaque contexte a sa propre définition cohérente, il n'y a pas de conflit.

**Le DDD tactique**, qui s'occupe de la modélisation dans le code :

- **Entité** : un objet défini par une identité stable dans le temps, même si ses attributs changent.
- **Value object** : un objet défini uniquement par sa valeur, immuable, sans identité propre.
- **Agrégat** : un regroupement d'entités et de value objects traité comme une seule unité de cohérence, accessible uniquement via sa racine (aggregate root).

## Analogie du quotidien

Le bounded context, c'est comme le mot « pièce » selon qui vous parle. Pour un architecte, une pièce est un espace délimité par des murs, avec une surface et des ouvertures. Pour un comptable qui évalue un bien immobilier, une pièce est une unité de valorisation qui influence le prix au mètre carré. Pour un déménageur, une pièce est une unité de charge — un volume de cartons à transporter.

Personne n'a tort. Chacun utilise le mot « pièce » avec une définition cohérente dans son propre contexte de travail, et personne n'essaie de faire tenir les trois définitions dans un seul modèle universel. Le DDD applique exactement cette logique au logiciel : plutôt que de forcer un mot unique à satisfaire tout le monde, on accepte des définitions différentes dans des contextes différents, explicitement délimités.

## Diagramme

{{< mermaid >}}
classDiagram
    class Commande {
        <<Aggregate Root>>
        -id: CommandeId
        -lignes: LigneCommande[]
        -montantTotal: Money
        +ajouterLigne(produit, quantite)
        +valider()
    }
    class LigneCommande {
        <<Entity>>
        -id: LigneId
        -produit: ProduitId
        -quantite: int
    }
    class Money {
        <<Value Object>>
        -montant: decimal
        -devise: string
        +additionner(m: Money) Money
    }
    class CommandeId {
        <<Value Object>>
        -valeur: UUID
    }

    Commande "1" *-- "1..*" LigneCommande : contient
    Commande --> Money : montantTotal
    Commande --> CommandeId : id
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// --- Value Object : immuable, identifié par sa valeur ---
final class Money
{
    public function __construct(
        private readonly int $montantEnCentimes,
        private readonly string $devise,
    ) {}

    public function additionner(Money $autre): self
    {
        if ($this->devise !== $autre->devise) {
            throw new DomainException('Devises incompatibles');
        }
        return new self($this->montantEnCentimes + $autre->montantEnCentimes, $this->devise);
    }

    public function egale(Money $autre): bool
    {
        return $this->montantEnCentimes === $autre->montantEnCentimes && $this->devise === $autre->devise;
    }
}

// --- Entité : identité stable, mutable ---
final class LigneCommande
{
    public function __construct(
        private readonly string $id,
        private readonly string $produitId,
        private int $quantite,
    ) {}

    public function sousTotal(Money $prixUnitaire): Money
    {
        return new Money($prixUnitaire->montant() * $this->quantite, $prixUnitaire->devise());
    }
}

// --- Aggregate Root : seul point d'entrée autorisé ---
final class Commande
{
    /** @var LigneCommande[] */
    private array $lignes = [];

    public function __construct(private readonly string $id) {}

    public function ajouterLigne(string $produitId, int $quantite): void
    {
        if ($quantite <= 0) {
            throw new DomainException('Quantité invalide');
        }
        $this->lignes[] = new LigneCommande(uniqid(), $produitId, $quantite);
    }

    public function nombreDeLignes(): int
    {
        return count($this->lignes);
    }
}
```

### Java

```java
// --- Value Object ---
public final class Money {
    private final long montantEnCentimes;
    private final String devise;

    public Money(long montantEnCentimes, String devise) {
        this.montantEnCentimes = montantEnCentimes;
        this.devise = devise;
    }

    public Money additionner(Money autre) {
        if (!devise.equals(autre.devise)) {
            throw new IllegalArgumentException("Devises incompatibles");
        }
        return new Money(montantEnCentimes + autre.montantEnCentimes, devise);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Money)) return false;
        Money autre = (Money) o;
        return montantEnCentimes == autre.montantEnCentimes && devise.equals(autre.devise);
    }
}

// --- Entité ---
public final class LigneCommande {
    private final String id;
    private final String produitId;
    private final int quantite;

    public LigneCommande(String id, String produitId, int quantite) {
        this.id = id;
        this.produitId = produitId;
        this.quantite = quantite;
    }
}

// --- Aggregate Root ---
public final class Commande {
    private final String id;
    private final List<LigneCommande> lignes = new ArrayList<>();

    public Commande(String id) {
        this.id = id;
    }

    public void ajouterLigne(String produitId, int quantite) {
        if (quantite <= 0) {
            throw new IllegalArgumentException("Quantité invalide");
        }
        lignes.add(new LigneCommande(UUID.randomUUID().toString(), produitId, quantite));
    }

    public int nombreDeLignes() {
        return lignes.size();
    }
}
```

## Quand utiliser le DDD ?

- Quand la logique métier est riche, pleine de règles et d'exceptions, et pas un simple CRUD autour d'une base de données.
- Quand plusieurs équipes ou plusieurs sous-domaines utilisent les mêmes mots avec des sens différents, source de confusion et de bugs.
- Quand le système est amené à durer et à évoluer plusieurs années, avec des règles métier qui se complexifient au fil du temps.
- À éviter sur un projet simple ou un prototype : construire des agrégats, des value objects et des bounded contexts explicites pour un CRUD basique ajoute un coût de modélisation qui ne sera jamais rentabilisé.

## Points importants

- Le DDD stratégique (langage, bounded context) apporte de la valeur dès le premier jour, même sans écrire une ligne de code tactique — c'est avant tout un exercice de clarification avec le métier.
- Un value object ne se modifie jamais : on en crée un nouveau. C'est ce qui le rend prévisible et sûr à partager entre plusieurs entités.
- Une racine d'agrégat est la seule porte d'entrée : on ne récupère et modifie jamais une `LigneCommande` isolément, toujours en passant par `Commande`.
- Le DDD partage sa philosophie avec la Clean Architecture et l'architecture hexagonale — isoler et protéger le métier — mais y ajoute une dimension : la rigueur du vocabulaire partagé avec les experts métier eux-mêmes.
