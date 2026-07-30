---
title: "CSRF expliqué simplement"
description: "Le CSRF force un utilisateur authentifié à exécuter une action à son insu, depuis un site tiers. Comment ça marche, comment un token CSRF s'en protège."
date: 2026-07-30
category: "Sécurité & Performance"
difficulty: "Intermédiaire"
tags: ["securite", "owasp", "csrf", "php", "sessions"]
summary: "Le CSRF (Cross-Site Request Forgery) exploite le fait que le navigateur envoie automatiquement les cookies de session avec chaque requête, même déclenchée depuis un site tiers. Résultat : un site malveillant peut faire exécuter une action à un utilisateur authentifié, sans qu'il s'en rende compte."
bearMemory:
  - "Le CSRF ne vole aucune donnée et ne casse aucun mot de passe : il abuse d'une action **déjà autorisée** en la déclenchant à l'insu de la victime."
  - "La faille repose sur un fait technique précis : le navigateur envoie automatiquement les cookies de session, même pour une requête initiée depuis un site totalement différent."
  - "La protection standard est le **token CSRF** : une valeur imprévisible, unique par session (ou par formulaire), vérifiée côté serveur avant d'exécuter toute action sensible."
interviewQuestions:
  - q: "Quelle différence entre XSS et CSRF ?"
    a: "Le XSS exécute du code malveillant directement dans le navigateur de la victime, sur le site légitime lui-même — l'attaquant contrôle ce qui s'exécute. Le CSRF, lui, ne fait exécuter aucun code sur le site ciblé : il fait simplement envoyer, depuis un site tiers, une requête que le navigateur enrichit automatiquement des cookies de session de la victime, faisant croire au serveur que c'est elle qui agit volontairement."
  - q: "Pourquoi le navigateur envoie-t-il les cookies même depuis un site tiers ?"
    a: "Parce que les cookies sont associés à un domaine, pas à l'origine de la requête : si une page malveillante sur site-a.test déclenche une requête vers site-b.test, le navigateur joint automatiquement les cookies stockés pour site-b.test, y compris le cookie de session, sans se soucier de qui a initié la requête."
  - q: "Comment un token CSRF empêche-t-il l'attaque ?"
    a: "Le serveur génère une valeur secrète et imprévisible, liée à la session de l'utilisateur, et l'inclut dans chaque formulaire sensible. Un site tiers ne peut pas lire cette valeur (les cookies d'un domaine ne sont pas accessibles à un autre domaine), donc il ne peut pas la joindre à la requête forgée. Sans le bon token, le serveur rejette la requête même si les cookies de session sont valides."
---

## Le problème

Imaginez un utilisateur connecté sur le site de sa banque, dans un onglet. Dans un autre onglet, il visite un site quelconque, qui contient (à son insu) un formulaire caché déclenchant automatiquement une requête vers `banque.test/virement?montant=5000&vers=attaquant`. Le navigateur envoie cette requête avec les cookies de session de la banque, parce que ces cookies sont associés au domaine `banque.test`, peu importe quel site a initié la requête.

Si le serveur de la banque ne vérifie que la présence d'une session valide — sans vérifier que la requête provient réellement d'une action volontaire de l'utilisateur sur son propre site — il exécute le virement. L'utilisateur n'a rien cliqué de suspect, n'a rien téléchargé, n'a même pas conscience qu'une requête est partie en son nom.

## L'idée générale

Le CSRF (*Cross-Site Request Forgery*, littéralement "falsification de requête intersite") exploite un fait technique simple : les cookies sont automatiquement joints par le navigateur à chaque requête vers le domaine auquel ils appartiennent, sans considération de la page qui a déclenché cette requête.

Contrairement à l'injection SQL ou au XSS, le CSRF n'injecte aucun code et ne vole aucune donnée directement. Il détourne une action **légitime** que l'application autoriserait de toute façon si l'utilisateur l'avait déclenchée volontairement — changer un email, poster un message, valider un virement, supprimer un compte.

La protection standard consiste à ajouter, à chaque action sensible, une preuve que la requête provient bien du site lui-même et non d'un tiers : le **token CSRF**. C'est une valeur générée côté serveur, imprévisible, incluse dans chaque formulaire, et vérifiée à la réception de la requête. Un site tiers peut forcer l'envoi d'une requête avec les bons cookies, mais il ne peut pas deviner ni lire ce token — les cookies d'un domaine ne sont jamais accessibles en lecture par un autre domaine.

## Analogie du quotidien

Le CSRF, c'est comme un chèque déjà signé qui traîne dans votre portefeuille. Le simple fait de le sortir et de le présenter suffit à ce qu'il soit encaissé — la banque ne vérifie que la signature, pas qui a rempli le montant ni qui l'a physiquement déposé au guichet. Si quelqu'un glisse subrepticement un chèque pré-rempli dans votre portefeuille et le fait présenter à votre insu, la signature (votre cookie de session, toujours valide) suffit à ce que l'opération passe.

Le token CSRF, c'est l'équivalent d'un code à usage unique que la banque exige en plus de la signature, un code que seul le vrai propriétaire du chéquier connaît au moment de remplir le chèque — impossible pour quelqu'un d'extérieur de le deviner ou de le glisser dans le portefeuille à votre place.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant V as Victime (navigateur)
    participant M as Site malveillant
    participant B as Site de la banque

    Note over V,B: Sans protection CSRF
    V->>B: Connexion (cookie de session stocké)
    V->>M: Visite le site malveillant (dans un autre onglet)
    M-->>V: Page avec formulaire caché auto-soumis
    V->>B: POST /virement (cookie de session envoyé automatiquement)
    Note over B: Session valide -> requête acceptée
    B-->>V: Virement exécuté à l'insu de la victime

    Note over V,B: Avec protection par token CSRF
    V->>B: Connexion, récupère un token CSRF unique
    V->>M: Visite le site malveillant
    M-->>V: Page avec formulaire caché auto-soumis (sans le bon token)
    V->>B: POST /virement (cookie envoyé, mais token absent ou invalide)
    Note over B: Token manquant/invalide -> requête rejetée
    B-->>V: 403 - action refusée
{{< /mermaid >}}

## Exemple de code

### Code vulnérable

```php
<?php
// traitement-virement.php : aucune vérification autre que la session
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

$montant = $_POST['montant'];
$destinataire = $_POST['vers'];

effectuerVirement($_SESSION['user_id'], $destinataire, $montant);
```

```html
<!-- formulaire-virement.php : aucun token -->
<form method="POST" action="/traitement-virement.php">
    <input type="number" name="montant">
    <input type="text" name="vers">
    <button type="submit">Virer</button>
</form>
```

Ce formulaire peut être reproduit à l'identique sur n'importe quel autre site : le navigateur de la victime enverra quand même le cookie de session valide.

### Code corrigé

```php
<?php
// formulaire-virement.php : génération d'un token lié à la session
session_start();

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['csrf_token'];
?>

<form method="POST" action="/traitement-virement.php">
    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
    <input type="number" name="montant">
    <input type="text" name="vers">
    <button type="submit">Virer</button>
</form>
```

```php
<?php
// traitement-virement.php : vérification stricte du token avant d'agir
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

$tokenRecu = $_POST['csrf_token'] ?? '';
$tokenAttendu = $_SESSION['csrf_token'] ?? '';

if (!hash_equals($tokenAttendu, $tokenRecu)) {
    http_response_code(403);
    exit('Requête refusée : jeton CSRF invalide.');
}

$montant = $_POST['montant'];
$destinataire = $_POST['vers'];

effectuerVirement($_SESSION['user_id'], $destinataire, $montant);
```

`hash_equals()` compare les deux chaînes en temps constant, pour éviter qu'un attaquant ne devine le token par une attaque de type *timing*.

## Quand s'en préoccuper ?

- Sur **toute action qui modifie un état** côté serveur : changement de mot de passe ou d'email, virement, suppression de compte, publication de contenu — dès qu'une requête `POST`, `PUT`, `PATCH` ou `DELETE` a un effet de bord.
- Moins critique sur les requêtes `GET` en lecture seule, à condition qu'elles ne déclenchent réellement aucune modification côté serveur (une requête `GET` qui modifie des données est de toute façon une mauvaise pratique en soi, indépendamment du CSRF).
- Sur les applications qui exposent une API consommée par un frontend séparé : la protection prend alors une forme différente (vérification de l'en-tête `Origin`/`Referer`, tokens dans un en-tête personnalisé plutôt qu'un champ de formulaire), car les cookies de session classiques sont parfois remplacés par des tokens d'authentification transmis explicitement.
- Dès la mise en place de l'authentification d'un projet : la plupart des frameworks PHP modernes (Symfony, Laravel) génèrent et vérifient les tokens CSRF automatiquement — il faut surtout veiller à ne pas désactiver cette protection par erreur ou par gain de temps.

## Points importants

- L'attribut de cookie `SameSite` (à `Lax` ou `Strict`) est une deuxième ligne de défense efficace : il empêche le navigateur d'envoyer le cookie de session lors d'une requête initiée depuis un autre site, dans la majorité des cas. Il complète le token CSRF, mais ne le remplace pas entièrement selon le contexte.
- Un token CSRF doit être généré avec une source aléatoire cryptographiquement sûre (`random_bytes()` en PHP), jamais avec `rand()` ou `uniqid()`, qui sont prévisibles.
- La comparaison du token reçu doit toujours utiliser une fonction en temps constant (`hash_equals()`), pas l'opérateur `==` ou `===`, pour éviter les attaques par mesure de temps.
- CSRF et XSS sont souvent confondus car tous deux impliquent un site tiers ou un contenu injecté, mais leurs mécanismes et leurs protections sont complètement différents : l'un force une action à l'insu de la victime, l'autre exécute du code dans son navigateur.
