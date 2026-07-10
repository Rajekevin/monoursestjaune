---
title: "Séparation des responsabilités"
description: "La séparation des responsabilités consiste à isoler chaque raison de changer dans sa propre unité — classe, module ou couche. Explication, analogie, exemple de code avant/après."
date: 2026-07-10
category: "Architecture logicielle"
difficulty: "Débutant"
tags: ["architecture", "solid", "php", "java"]
summary: "Séparer les responsabilités, ce n'est pas seulement écrire des petites classes : c'est isoler chaque raison de changer dans sa propre unité, que ce soit une classe, un module ou une couche entière du système. Bien fait, un changement métier ne touche qu'un seul endroit du code."
bearMemory:
  - "Une responsabilité, c'est une **raison de changer** — pas une simple méthode ou une simple ligne de code."
  - "Le principe s'applique à toutes les échelles : une **classe**, un **module** et une **couche applicative** peuvent tous violer la séparation des responsabilités."
  - "Le symptôme classique d'une responsabilité mal séparée : modifier une règle de validation casse, sans lien apparent, l'envoi d'e-mails."
interviewQuestions:
  - q: "Quelle est la différence entre le Single Responsibility Principle et la séparation des responsabilités en général ?"
    a: "Le Single Responsibility Principle (le S de SOLID) est la formulation la plus connue de cette idée, appliquée à l'échelle d'une classe : une classe ne doit avoir qu'une seule raison de changer. La séparation des responsabilités est le principe général, qui s'applique aussi bien à une classe qu'à un module entier, une couche applicative, voire un service dans une architecture distribuée. Le SRP est un cas particulier du principe plus large."
  - q: "Comment savoir si une classe a trop de responsabilités ?"
    a: "Une bonne heuristique consiste à décrire ce que fait la classe en une phrase, sans utiliser le mot « et ». Si la description devient : « elle valide les données et calcule le prix et envoie un e-mail », c'est le signe de plusieurs responsabilités mélangées. Autre indice concret : si des changements demandés par des personnes ou des équipes différentes (le service marketing, le service compta) obligent à modifier la même classe, c'est qu'elle porte plusieurs responsabilités qui devraient être séparées."
  - q: "Séparer les responsabilités ne crée-t-il pas trop de petites classes difficiles à suivre ?"
    a: "C'est un risque réel si la séparation est appliquée mécaniquement sans discernement — trop de fragmentation rend le flux global difficile à suivre. L'objectif n'est pas de minimiser la taille des classes, mais d'isoler les raisons de changer indépendantes les unes des autres. Une classe cohérente qui ne change que pour une seule raison peut rester assez grande sans poser de problème."
---

## Le problème

Une classe `InscriptionService` qui valide les données d'un formulaire, calcule un prix, enregistre l'utilisateur en base de données et envoie un e-mail de bienvenue fonctionne, au début. Puis le service marketing demande de changer le contenu de l'e-mail : il faut rouvrir cette classe. Le service comptabilité change la règle de calcul du prix : il faut rouvrir la même classe. Une nouvelle règle de validation arrive : encore la même classe.

Chaque équipe, pour des raisons complètement différentes, finit par toucher au même fichier — avec le risque, à chaque modification, de casser une fonctionnalité sans rapport avec le changement demandé. Ce n'est pas un problème de taille de fichier : c'est un problème de responsabilités mélangées dans une seule unité de code.

## L'idée générale

La séparation des responsabilités consiste à isoler chaque **raison de changer** dans sa propre unité de code. Une responsabilité n'est pas une méthode ni une ligne : c'est un motif de changement — une source qui, si elle évolue, force à modifier ce bout de code.

Le principe le plus connu qui formalise cette idée à l'échelle d'une classe est le **Single Responsibility Principle** (le S de SOLID, détaillé dans l'article [SOLID expliqué simplement](/architecture-logicielle/solid-explique-simplement)) : une classe ne devrait avoir qu'une seule raison de changer.

Mais l'idée dépasse largement l'échelle d'une classe :

- **À l'échelle d'une classe** : `InscriptionService` devrait être scindé en un validateur, un calculateur de prix, un repository et un service de notification.
- **À l'échelle d'un module** : un module « facturation » ne devrait pas contenir de logique de gestion des stocks — ce sont deux raisons de changer différentes, portées par des équipes différentes.
- **À l'échelle d'une couche applicative** : une couche de présentation (contrôleurs, vues) ne devrait pas contenir de règles métier, et une couche métier ne devrait pas connaître les détails d'un format HTTP.

Séparer les responsabilités, c'est donc organiser le code pour qu'un changement métier reste localisé — un seul endroit à modifier, un seul test à revoir, un seul risque de régression, au lieu d'une onde de choc qui traverse tout le système.

## Analogie du quotidien

Un restaurant sépare naturellement ses responsabilités : le cuisinier prépare les plats, le serveur prend les commandes et sert la salle, le caissier encaisse le paiement. Si le restaurant change de fournisseur de légumes, seule la cuisine est concernée. Si le restaurant change son système de caisse, seul le caissier est concerné. Le serveur continue son travail sans rien changer à sa façon de faire.

Imaginez à l'inverse un restaurant où une seule personne cuisine, sert, encaisse et gère les fournisseurs. Le jour où il faut changer le système de caisse, toute l'activité s'arrête, parce qu'une seule personne porte toutes les responsabilités à la fois. Séparer les rôles, ce n'est pas juste une question d'organisation humaine — c'est ce qui permet à chaque partie du système de changer sans bloquer les autres.

## Diagramme

{{< mermaid >}}
flowchart TD
    subgraph Avant["Avant : une seule classe, plusieurs responsabilités"]
        A[InscriptionService] -->|valide| A1[Règles de validation]
        A -->|calcule| A2[Calcul du prix]
        A -->|persiste| A3[Accès base de données]
        A -->|notifie| A4[Envoi d'e-mail]
    end

    subgraph Apres["Après : une responsabilité par unité"]
        V[Validateur] --> C[CalculateurPrix]
        C --> R[UtilisateurRepository]
        R --> N[ServiceNotification]
    end
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// --- AVANT : une classe, quatre responsabilités ---
final class InscriptionService
{
    public function inscrire(array $donnees): void
    {
        // Responsabilité 1 : validation
        if (empty($donnees['email']) || !str_contains($donnees['email'], '@')) {
            throw new InvalidArgumentException('E-mail invalide');
        }

        // Responsabilité 2 : calcul métier
        $prix = $donnees['abonnementPremium'] ? 29.90 : 0.0;

        // Responsabilité 3 : persistance
        $pdo = new PDO('mysql:host=localhost;dbname=app', 'root', '');
        $stmt = $pdo->prepare('INSERT INTO utilisateurs (email, prix) VALUES (?, ?)');
        $stmt->execute([$donnees['email'], $prix]);

        // Responsabilité 4 : notification
        mail($donnees['email'], 'Bienvenue', 'Merci pour votre inscription !');
    }
}

// --- APRÈS : une responsabilité par classe ---
final class ValidateurInscription
{
    public function valider(array $donnees): void
    {
        if (empty($donnees['email']) || !str_contains($donnees['email'], '@')) {
            throw new InvalidArgumentException('E-mail invalide');
        }
    }
}

final class CalculateurPrix
{
    public function calculer(bool $premium): float
    {
        return $premium ? 29.90 : 0.0;
    }
}

interface UtilisateurRepository
{
    public function sauvegarder(string $email, float $prix): void;
}

interface ServiceNotification
{
    public function envoyerBienvenue(string $email): void;
}

final class InscriptionService
{
    public function __construct(
        private ValidateurInscription $validateur,
        private CalculateurPrix $calculateur,
        private UtilisateurRepository $repository,
        private ServiceNotification $notifications,
    ) {}

    public function inscrire(array $donnees): void
    {
        $this->validateur->valider($donnees);
        $prix = $this->calculateur->calculer($donnees['abonnementPremium']);
        $this->repository->sauvegarder($donnees['email'], $prix);
        $this->notifications->envoyerBienvenue($donnees['email']);
    }
}
```

### Java

```java
// --- APRÈS : une responsabilité par classe ---
public class ValidateurInscription {
    public void valider(InscriptionRequest donnees) {
        if (donnees.email() == null || !donnees.email().contains("@")) {
            throw new IllegalArgumentException("E-mail invalide");
        }
    }
}

public class CalculateurPrix {
    public double calculer(boolean premium) {
        return premium ? 29.90 : 0.0;
    }
}

public interface UtilisateurRepository {
    void sauvegarder(String email, double prix);
}

public interface ServiceNotification {
    void envoyerBienvenue(String email);
}

public class InscriptionService {
    private final ValidateurInscription validateur;
    private final CalculateurPrix calculateur;
    private final UtilisateurRepository repository;
    private final ServiceNotification notifications;

    public InscriptionService(ValidateurInscription validateur, CalculateurPrix calculateur,
                               UtilisateurRepository repository, ServiceNotification notifications) {
        this.validateur = validateur;
        this.calculateur = calculateur;
        this.repository = repository;
        this.notifications = notifications;
    }

    public void inscrire(InscriptionRequest donnees) {
        validateur.valider(donnees);
        double prix = calculateur.calculer(donnees.premium());
        repository.sauvegarder(donnees.email(), prix);
        notifications.envoyerBienvenue(donnees.email());
    }
}
```

## Quand appliquer la séparation des responsabilités ?

- Dès qu'une classe ou un module mélange des règles métier, de la validation, de la persistance et de la notification dans le même bloc de code.
- Quand des équipes différentes doivent modifier le même fichier pour des raisons complètement indépendantes.
- Quand vous voulez tester une règle métier isolément, sans dépendre d'une base de données ou d'un service d'envoi d'e-mails.
- À doser avec discernement sur un petit script ou un prototype : séparer à l'excès une logique très simple en cinq classes de trois lignes chacune complique la lecture plus qu'elle ne l'aide.

## Points importants

- Une responsabilité se définit par une raison de changer, pas par une taille de classe : une grande classe cohérente qui ne change que pour une seule raison respecte le principe.
- Le principe s'applique à toutes les échelles : classe, module, couche — le symptôme est le même à chaque niveau, un changement qui devrait être local se propage ailleurs.
- Le Single Responsibility Principle (S de SOLID) est la version la plus connue de ce principe, appliquée à l'échelle d'une classe.
- Trop séparer nuit aussi à la lisibilité : l'objectif est d'isoler les raisons de changer indépendantes, pas de minimiser artificiellement la taille du code.
