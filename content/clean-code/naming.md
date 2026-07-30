---
title: "Bien nommer ses variables et fonctions"
description: "Un bon nom rend un commentaire inutile. Comment nommer variables, fonctions et booléens pour qu'un code se lise sans effort de traduction."
date: 2026-07-10
category: "Clean Code"
difficulty: "Débutant"
tags: ["clean-code", "php", "java", "javascript"]
summary: "Un nom de variable ou de fonction porte une information : pourquoi ça existe, ce que ça fait, comment s'en servir. Un mauvais nom oblige le lecteur à ouvrir le code pour comprendre ce qu'un bon nom lui aurait dit directement."
bearMemory:
  - "Un bon nom **remplace un commentaire** : s'il faut commenter pour expliquer un nom, c'est le nom qu'il faut changer."
  - "Un booléen se lit comme une **question** : `isEligible`, `hasExpired`, `canRetry` — jamais `flag` ou `status`."
  - "Un nom vague (`data`, `temp`, `list2`) signale presque toujours un **découpage manquant**, pas juste un problème de style."
interviewQuestions:
  - q: "Pourquoi le nommage est-il considéré comme une compétence technique, pas juste un détail esthétique ?"
    a: "Parce que le code est lu bien plus souvent qu'il n'est écrit. Un nom précis élimine le besoin de deviner ou de retracer la logique — il documente l'intention directement dans le code, sans risque que la documentation se désynchronise du comportement réel, contrairement à un commentaire."
  - q: "Quelle différence entre get* et find* comme préfixe de méthode ?"
    a: "Ce n'est pas universel, mais une convention répandue : get* garantit un résultat (ou lève une exception s'il est absent), tandis que find* peut renvoyer un résultat vide ou null. Le nom porte alors une promesse sur le comportement — un appelant sait s'il doit gérer l'absence de résultat sans lire l'implémentation."
---

## Le problème

Un nom de variable comme `$data`, `$temp` ou `$list2` ne dit rien. Il compile, il fonctionne, et pourtant chaque personne qui relit ce code — y compris son auteur trois semaines plus tard — doit remonter dans le fichier pour comprendre ce que cette variable représente vraiment. Multiplié par des centaines de variables et de fonctions dans une base de code, ce petit coût de traduction devient un vrai frein : on passe plus de temps à déchiffrer qu'à comprendre.

Le nommage n'est pas une question de goût. C'est le canal principal par lequel le code communique son intention — avant même qu'on lise la logique.

## L'idée générale

Un bon nom répond à trois questions sans qu'on ait besoin d'ouvrir la fonction : pourquoi cette chose existe, ce qu'elle représente ou ce qu'elle fait, et comment on est censé s'en servir.

Quelques règles concrètes qui couvrent la majorité des cas :

- **Les variables sont des noms, précis.** `$unpaidInvoices` plutôt que `$data`. `$discountedPrice` plutôt que `$val`.
- **Les fonctions sont des verbes, précis.** `chargeCustomer()` plutôt que `process()`. Un verbe vague est un aveu que la fonction fait plusieurs choses à la fois.
- **Les booléens se lisent comme une question.** `isEligibleForRefund`, `hasExpired`, `canRetry` — jamais `check` ou `flag`, qui ne disent pas ce qu'ils vérifient.
- **Pas de nombres magiques.** `if ($delay > 30)` devient `if ($delay > self::MAX_PAYMENT_DELAY_IN_DAYS)` : la règle métier devient lisible ET cherchable dans tout le projet.
- **Pas de numérotation.** `$list2` ou `$userTemp` signalent presque toujours qu'il manque un vrai découpage — deux concepts différents qui méritent deux noms différents, pas deux variantes du même nom.

## Analogie du quotidien

Un nom de variable, c'est comme l'étiquette sur une boîte de rangement. Une boîte étiquetée « Boîte 3 » oblige à l'ouvrir à chaque fois pour se souvenir de ce qu'il y a dedans. Une boîte étiquetée « Factures impayées 2026 » vous dit tout, sans l'ouvrir.

Le code fonctionne pareil : un bon nom vous évite d'ouvrir la fonction pour savoir ce qu'elle contient.

## Diagramme

{{< mermaid >}}
flowchart TD
    A["Un nom doit répondre à..."] --> B["Pourquoi ça existe ?"]
    A --> C["Ce que ça représente/fait ?"]
    A --> D["Comment s'en servir ?"]
    B --> E["Sinon : le lecteur doit\nouvrir le code pour deviner"]
    C --> E
    D --> E
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// Avant : rien ne dit ce que ces variables représentent
function process($data, $x) {
    if ($x > 30) {
        return $data * 0.9;
    }
    return $data;
}

// Après : chaque nom porte son intention
function applyLoyaltyDiscount(float $orderTotal, int $customerAgeInDays): float
{
    $isEligibleForDiscount = $customerAgeInDays > self::MIN_ACCOUNT_AGE_FOR_DISCOUNT;

    return $isEligibleForDiscount
        ? $orderTotal * self::LOYALTY_DISCOUNT_RATE
        : $orderTotal;
}
```

### Java

```java
// Avant
public double process(double data, int x) {
    if (x > 30) {
        return data * 0.9;
    }
    return data;
}

// Après
public double applyLoyaltyDiscount(double orderTotal, int customerAgeInDays) {
    boolean isEligibleForDiscount = customerAgeInDays > MIN_ACCOUNT_AGE_FOR_DISCOUNT;

    return isEligibleForDiscount
        ? orderTotal * LOYALTY_DISCOUNT_RATE
        : orderTotal;
}
```

### JavaScript

```javascript
// Avant
function process(data, x) {
  if (x > 30) {
    return data * 0.9;
  }
  return data;
}

// Après
function applyLoyaltyDiscount(orderTotal, customerAgeInDays) {
  const isEligibleForDiscount = customerAgeInDays > MIN_ACCOUNT_AGE_FOR_DISCOUNT;

  return isEligibleForDiscount
    ? orderTotal * LOYALTY_DISCOUNT_RATE
    : orderTotal;
}
```

## Quand appliquer ces règles ?

- Partout, dès qu'une variable ou une fonction vit plus longtemps qu'une boucle de quelques lignes.
- Particulièrement sur les frontières publiques d'un module (noms de méthodes publiques, paramètres exposés) : ce sont elles que les autres développeurs voient sans lire l'implémentation.
- Avec un peu plus de tolérance sur des noms très courts et très locaux (`i` dans une boucle `for` de trois lignes) : le contexte rend le nom évident, l'expliciter n'ajoute rien.

## Points importants

- Un nom se lit des dizaines de fois pour chaque fois qu'il est écrit : le temps « perdu » à bien nommer est largement rentabilisé à la lecture.
- Un renommage dans un bon IDE coûte quelques secondes : ne pas hésiter à renommer dès qu'un nom cesse de refléter ce que fait vraiment le code.
- Le nommage est le premier signal de conception : quand aucun nom court et clair ne convient à une fonction, c'est souvent que la fonction fait plus d'une chose — voir [Écrire des fonctions courtes et lisibles](/clean-code/fonctions-courtes/).
