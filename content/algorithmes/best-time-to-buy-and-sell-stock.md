---
title: "Best Time to Buy and Sell Stock"
description: "prices[i] est le prix d'une action le jour i. Tu dois acheter UN jour puis vendre UN jour plus tard. Renvoie le profit maximum possible (0 s..."
category: "Algorithmes & Structures de données"
pattern: "Arrays"
difficulty: "Facile"
number: 4
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "arrays"]
summary: "prices[i] est le prix d'une action le jour i. Tu dois acheter UN jour puis vendre UN jour plus tard. Renvoie le profit maximum possible (0 si aucun profit n'est possible)."
---

## C'est quoi le problème, en clair ?

On vous donne le prix d'une action jour après jour, et vous devez l'acheter un jour puis la revendre un jour plus tard, en maximisant votre profit. Imaginez que vous regardez un graphique de prix en direct et que vous devez choisir le meilleur point bas pour acheter, puis le meilleur point haut après lui pour vendre, sans jamais pouvoir deviner l'avenir. Chaque jour, vous vous posez juste une question : « si je vendais aujourd'hui, avec le prix le plus bas vu jusqu'ici, quel serait mon gain ? »

## L'idée clé

En parcourant les jours dans l'ordre, il suffit de retenir deux choses : le prix minimum vu jusqu'ici (le meilleur jour d'achat passé) et le meilleur profit obtenu en vendant aujourd'hui à ce prix minimum. Une seule passe, pas besoin de tester toutes les paires.

## Pourquoi cette solution ?

Deux simples variables int suffisent — pas de structure de données. C'est une forme dégénérée de fenêtre glissante / DP : l'état utile du passé est compressé en un seul nombre (minPrice). Math.min et Math.max gardent le code lisible.

## Solution Java

```java
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE; // prix d'achat le plus bas vu jusqu'ici
        int maxProfit = 0;                // meilleur profit realisable

        for (int price : prices) {
            // Soit ce jour est un meilleur jour d'achat...
            minPrice = Math.min(minPrice, price);
            // ...soit c'est un bon jour de vente par rapport au min passe
            maxProfit = Math.max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
}
```

## Complexité

Temps O(N) : un seul parcours du tableau. Espace O(1) : deux variables, quelle que soit la taille de l'entrée.
