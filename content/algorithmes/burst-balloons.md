---
title: "Burst Balloons"
description: "Des ballons portent des nombres. Éclater le ballon i rapporte nums[gauche] × nums[i] × nums[droite] (les voisins ACTUELS). Maximise le total..."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Difficile"
number: 96
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Des ballons portent des nombres. Éclater le ballon i rapporte nums[gauche] × nums[i] × nums[droite] (les voisins ACTUELS). Maximise le total. Ex : [3,1,5,8] → 167. Considéré comme l'un des DP les plus difficiles du catalogue."
---

## C'est quoi le problème, en clair ?

Des ballons alignés portent chacun un nombre. Faire éclater un ballon rapporte un score qui dépend de ses deux voisins encore présents à ce moment précis — donc l'ordre dans lequel vous éclatez les ballons change tout le résultat final. Le but est de trouver l'ordre qui maximise le score total. Imaginez une rangée de ballons de fête : chaque fois que vous en crevez un, ses deux voisins se retrouvent côte à côte et leurs futurs scores changent — il faut donc planifier à l'avance plutôt que d'éclater au hasard.

## L'idée clé

Penser à l'ENVERS : au lieu de choisir le premier ballon éclaté (les voisins bougent, l'état devient ingérable), on choisit le DERNIER ballon de chaque intervalle. S'il éclate en dernier dans (left, right), ses voisins au moment fatidique sont exactement les bornes left et right — l'intervalle devient indépendant ! dp[l][r] = max sur k de dp[l][k] + dp[k][r] + nums[l]×nums[k]×nums[r].

## Pourquoi cette solution ?

Ajouter des ballons virtuels de valeur 1 aux deux bouts élimine les cas de bord. On itère par LONGUEUR d'intervalle croissante (interval DP) : les petits intervalles doivent être résolus avant les grands. Ce renversement « premier → dernier » est l'un des plus beaux déclics de toute l'algorithmique d'entretien.

## Solution Java

```java
class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        // Ballons virtuels de valeur 1 aux deux extremites
        int[] balloons = new int[n + 2];
        balloons[0] = 1;
        balloons[n + 1] = 1;
        for (int i = 0; i < n; i++) balloons[i + 1] = nums[i];

        // dp[l][r] = gain max en eclatant tout STRICTEMENT entre l et r
        int[][] dp = new int[n + 2][n + 2];

        // Iterer par longueur d'intervalle croissante
        for (int len = 2; len <= n + 1; len++) {
            for (int left = 0; left + len <= n + 1; left++) {
                int right = left + len;
                // k : le DERNIER ballon eclate dans (left, right)
                for (int k = left + 1; k < right; k++) {
                    int coins = dp[left][k] + dp[k][right]
                              + balloons[left] * balloons[k] * balloons[right];
                    dp[left][right] = Math.max(dp[left][right], coins);
                }
            }
        }
        return dp[0][n + 1];
    }
}
```

## Complexité

Temps O(N³) : O(N²) intervalles × O(N) choix du dernier ballon. Espace O(N²) pour la table.
