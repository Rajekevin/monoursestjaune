---
title: "Authentification et sessions sécurisées"
description: "Hachage de mot de passe, gestion de session et cookies HttpOnly/Secure : les fondamentaux pour ne pas exposer les comptes de vos utilisateurs."
date: 2026-07-30
category: "Sécurité & Performance"
difficulty: "Avancé"
tags: ["securite", "owasp", "authentification", "sessions", "php"]
summary: "Une authentification sécurisée repose sur trois piliers : ne jamais stocker un mot de passe en clair ni avec un hachage faible, protéger le cycle de vie de la session (création, régénération, expiration), et verrouiller les cookies avec les bons attributs. Un seul maillon faible suffit à compromettre un compte."
bearMemory:
  - "Un mot de passe se **hache**, il ne se chiffre pas : le hachage est à sens unique (impossible de retrouver le mot de passe d'origine), le chiffrement est réversible avec une clé."
  - "MD5 et SHA1, même répétés ou salés à la main, ne sont **plus acceptables** pour des mots de passe : trop rapides à calculer, donc trop faciles à casser par force brute. Utilisez `password_hash()` (bcrypt/Argon2) qui gère salage et coût automatiquement."
  - "Un identifiant de session doit être **régénéré** après toute élévation de privilège (connexion, changement de rôle) pour empêcher la fixation de session — et les cookies de session doivent porter `HttpOnly`, `Secure` et `SameSite`."
interviewQuestions:
  - q: "Pourquoi ne jamais stocker un mot de passe en clair, même sur un projet interne ?"
    a: "Parce qu'une fuite de base de données expose alors directement tous les mots de passe, pour tous les comptes — et la plupart des utilisateurs réutilisent le même mot de passe ailleurs, ce qui étend la compromission à d'autres services. Le hachage garantit qu'une fuite de la base ne révèle pas les mots de passe eux-mêmes, seulement leur empreinte, très coûteuse à inverser si un algorithme adapté est utilisé."
  - q: "Pourquoi MD5 ou SHA1 sont-ils déconseillés pour hacher des mots de passe ?"
    a: "Ce sont des fonctions de hachage rapides, conçues à l'origine pour vérifier l'intégrité de données, pas pour protéger des secrets. Leur rapidité est justement le problème : elle permet à un attaquant de tester des milliards de combinaisons par seconde sur du matériel courant. Des algorithmes comme bcrypt ou Argon2 sont volontairement lents et paramétrables en coût, ce qui rend une attaque par force brute impraticable à grande échelle."
  - q: "Qu'est-ce que la fixation de session et comment s'en protéger ?"
    a: "C'est une attaque où l'attaquant impose à la victime un identifiant de session qu'il connaît déjà (par exemple via un lien contenant l'ID de session), puis attend qu'elle s'authentifie avec cet identifiant. Une fois connectée, l'attaquant réutilise le même identifiant de session pour accéder au compte. La protection consiste à régénérer systématiquement l'identifiant de session (session_regenerate_id) à chaque changement de niveau de privilège, notamment juste après une connexion réussie."
---

## Le problème

Une base de données d'utilisateurs finit presque toujours, tôt ou tard, par fuiter — une mauvaise configuration, une dépendance vulnérable, une erreur humaine. La question n'est pas *si* ça arrivera, mais *ce que cette fuite révélera*. Si les mots de passe sont stockés en clair, ou hachés avec un algorithme trop faible, la fuite d'une base de données devient immédiatement la compromission de tous les comptes utilisateurs — et souvent de comptes sur d'autres services, à cause de la réutilisation de mots de passe.

Le même risque existe côté session : une fois qu'un utilisateur est authentifié, son identifiant de session devient l'équivalent de son mot de passe pour la durée de la session. Si cet identifiant peut être volé (via un cookie mal protégé) ou imposé à l'avance par un attaquant (fixation de session), toute la robustesse du système d'authentification en amont ne sert plus à rien.

## L'idée générale

Une authentification sécurisée repose sur trois piliers distincts, qui doivent tous être corrects simultanément :

**1. Le hachage du mot de passe.** Un mot de passe ne doit jamais être stocké en clair, ni chiffré de façon réversible. Il doit être **haché** avec un algorithme conçu spécifiquement pour ça — en PHP, `password_hash()` utilise par défaut bcrypt, et prend en charge Argon2 si on le précise explicitement. Ces algorithmes intègrent un sel aléatoire automatique (deux utilisateurs avec le même mot de passe obtiennent des hachages différents) et un facteur de coût réglable, qui ralentit volontairement le calcul pour rendre une attaque par force brute trop coûteuse.

**2. Le cycle de vie de la session.** Un identifiant de session doit être imprévisible, régénéré après chaque élévation de privilège (connexion, passage en mode administrateur), et invalidé à la déconnexion ou après une période d'inactivité. Ne pas régénérer l'identifiant après connexion expose à la fixation de session.

**3. Les attributs du cookie de session.** Le cookie qui transporte l'identifiant de session doit porter les attributs `HttpOnly` (inaccessible en JavaScript, donc inutile à voler même en cas de XSS), `Secure` (transmis uniquement en HTTPS) et `SameSite` (limite l'envoi automatique du cookie depuis un site tiers, en défense complémentaire contre le CSRF).

Ces trois piliers sont indépendants : renforcer l'un ne compense pas une faiblesse sur un autre. Un mot de passe parfaitement haché ne sert à rien si le cookie de session peut être volé par un XSS faute d'attribut `HttpOnly`.

## Analogie du quotidien

Sécuriser l'authentification, c'est comme sécuriser l'accès à un immeuble avec un digicode, un badge et une caméra. Le digicode (le hachage du mot de passe) doit être conçu pour résister à quelqu'un qui essaierait toutes les combinaisons possibles — pas un simple cadenas à trois chiffres cassable en quelques minutes. Le badge (l'identifiant de session) doit être réémis à chaque fois qu'on change de niveau d'accès, pour qu'un ancien badge égaré ou copié ne donne plus accès à rien.

Et même avec un digicode solide et un badge à jour, si le gardien laisse la porte de service grande ouverte (un cookie de session sans `HttpOnly` ni `Secure`), toute la sécurité en amont devient inutile : il existe un chemin plus simple pour entrer, qui contourne complètement les protections mises en place ailleurs.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant U as Utilisateur
    participant App as Application PHP
    participant DB as Base de données

    Note over U,DB: Inscription
    U->>App: Mot de passe en clair (via HTTPS)
    App->>App: password_hash() -> hachage bcrypt/Argon2
    App->>DB: Stocke uniquement le hachage
    Note over DB: Aucun mot de passe en clair, jamais

    Note over U,DB: Connexion
    U->>App: Email + mot de passe
    App->>DB: Récupère le hachage stocké
    App->>App: password_verify(motDePasse, hachage)
    alt Mot de passe valide
        App->>App: session_regenerate_id(true)
        App-->>U: Cookie de session (HttpOnly, Secure, SameSite)
    else Mot de passe invalide
        App-->>U: Erreur générique, sans préciser email ou mot de passe
    end
{{< /mermaid >}}

## Exemple de code

### Code vulnérable

```php
<?php
// Inscription : hachage faible et non salé
function creerUtilisateur(PDO $pdo, string $email, string $motDePasse): void
{
    $hash = md5($motDePasse); // rapide à calculer, donc rapide à casser
    $stmt = $pdo->prepare('INSERT INTO utilisateurs (email, mot_de_passe) VALUES (?, ?)');
    $stmt->execute([$email, $hash]);
}

// Connexion : session non régénérée, cookie non protégé
session_start();

function connecter(PDO $pdo, string $email, string $motDePasse): bool
{
    $stmt = $pdo->prepare('SELECT id, mot_de_passe FROM utilisateurs WHERE email = ?');
    $stmt->execute([$email]);
    $utilisateur = $stmt->fetch();

    if ($utilisateur && md5($motDePasse) === $utilisateur['mot_de_passe']) {
        $_SESSION['user_id'] = $utilisateur['id']; // pas de regénération d'ID
        return true;
    }
    return false;
}
```

### Code corrigé

```php
<?php
// Inscription : password_hash gère le sel et le coût automatiquement
function creerUtilisateur(PDO $pdo, string $email, string $motDePasse): void
{
    $hash = password_hash($motDePasse, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare('INSERT INTO utilisateurs (email, mot_de_passe) VALUES (?, ?)');
    $stmt->execute([$email, $hash]);
}

// Configuration du cookie de session AVANT session_start()
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => true,      // envoyé uniquement en HTTPS
    'httponly' => true,    // inaccessible en JavaScript
    'samesite' => 'Lax',   // limite l'envoi depuis un site tiers
]);
session_start();

function connecter(PDO $pdo, string $email, string $motDePasse): bool
{
    $stmt = $pdo->prepare('SELECT id, mot_de_passe FROM utilisateurs WHERE email = ?');
    $stmt->execute([$email]);
    $utilisateur = $stmt->fetch();

    if ($utilisateur && password_verify($motDePasse, $utilisateur['mot_de_passe'])) {
        // Régénère l'identifiant de session : protège contre la fixation de session
        session_regenerate_id(true);
        $_SESSION['user_id'] = $utilisateur['id'];

        // Ré-hache si l'algorithme ou le coût par défaut a changé depuis l'inscription
        if (password_needs_rehash($utilisateur['mot_de_passe'], PASSWORD_BCRYPT)) {
            $nouveauHash = password_hash($motDePasse, PASSWORD_BCRYPT);
            $upd = $pdo->prepare('UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?');
            $upd->execute([$nouveauHash, $utilisateur['id']]);
        }

        return true;
    }
    return false;
}
```

## Quand s'en préoccuper ?

- Dès la conception du système d'inscription, avant même d'écrire la première ligne de code de connexion : le choix de l'algorithme de hachage n'est presque jamais reconsidéré une fois le projet lancé et des utilisateurs inscrits.
- À chaque connexion réussie et à chaque changement de rôle ou de privilège (passage en mode administrateur, par exemple) : c'est le moment où l'identifiant de session doit être régénéré.
- Dès qu'un site est servi en HTTPS (ce qui devrait être systématique aujourd'hui) : l'attribut `Secure` sur les cookies n'a aucun coût et empêche leur transmission accidentelle en clair.
- Lors d'un audit de sécurité ou d'une migration : vérifier qu'aucun mot de passe historique n'a été stocké avec un algorithme aujourd'hui obsolète (MD5, SHA1 seul, voire en clair sur de très vieux systèmes), et prévoir une migration progressive via `password_needs_rehash()`.

## Points importants

- `password_hash()` et `password_verify()` sont les fonctions PHP natives recommandées : elles gèrent le sel, le coût, et l'algorithme sans que le développeur ait à réinventer une logique cryptographique — ce qui est toujours risqué.
- Un message d'erreur de connexion doit rester générique ("email ou mot de passe incorrect"), sans préciser lequel des deux est en cause : préciser "email inconnu" permet à un attaquant de vérifier si une adresse est déjà inscrite (énumération de comptes).
- La déconnexion doit détruire la session côté serveur (`session_destroy()`) en plus d'expirer le cookie côté client — sinon un identifiant de session encore valide en base reste utilisable si l'attaquant l'a intercepté avant la déconnexion.
- L'authentification à deux facteurs (2FA) et la limitation du nombre de tentatives de connexion (*rate limiting*) sont des couches complémentaires : elles réduisent l'impact d'un mot de passe compromis ou faible, mais ne remplacent jamais un hachage correct.
