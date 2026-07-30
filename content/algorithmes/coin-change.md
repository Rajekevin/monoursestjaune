---
title: "Coin Change"
description: "Avec des pièces de valeurs données (quantité illimitée), quel est le NOMBRE MINIMAL de pièces pour atteindre exactement un montant ? (-1 si ..."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Moyen"
number: 77
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Avec des pièces de valeurs données (quantité illimitée), quel est le NOMBRE MINIMAL de pièces pour atteindre exactement un montant ? (-1 si impossible). Ex : coins=[1,2,5], amount=11 → 3 (5+5+1)."
---

## C'est quoi le problème, en clair ?

Vous avez des pièces de plusieurs valeurs, en quantité illimitée, et un montant précis à atteindre. On vous demande le plus petit nombre de pièces possible pour y arriver, ou de dire que c'est impossible. Le piège classique est de croire qu'il suffit de toujours prendre la plus grosse pièce disponible, comme un caissier qui rend la monnaie sans réfléchir : ça ne marche pas toujours, et il faut en réalité calculer, montant par montant, la meilleure combinaison possible.

## L'idée clé

Le glouton (prendre la plus grosse pièce) ÉCHOUE : coins=[1,3,4], amount=6 → glouton donne 4+1+1 (3 pièces) au lieu de 3+3 (2). Il faut la DP : dp[m] = nombre minimal de pièces pour le montant m = 1 + min(dp[m - pièce]) sur toutes les pièces utilisables. On remplit de 0 à amount.

## Pourquoi cette solution ?

Tableau dp[amount+1] initialisé à amount+1 (valeur « infini » sûre, sans overflow d'Integer.MAX_VALUE + 1). Montrer le contre-exemple du glouton AVANT de coder la DP est un moment fort d'entretien : ça prouve que tu testes tes intuitions.

## Solution Java

```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int INF = amount + 1; // "infini" : plus que le pire cas possible
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0; // 0 piece pour le montant 0

        for (int m = 1; m <= amount; m++) {
            for (int coin : coins) {
                if (coin <= m) {
                    // Utiliser cette piece + la meilleure solution du reste
                    dp[m] = Math.min(dp[m], dp[m - coin] + 1);
                }
            }
        }
        return dp[amount] == INF ? -1 : dp[amount];
    }
}
```

## Complexité

Temps O(amount × nb de pièces) : double boucle. Espace O(amount) pour le tableau dp.
