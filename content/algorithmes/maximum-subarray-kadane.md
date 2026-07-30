---
title: "Maximum Subarray (Kadane)"
description: "Trouve le sous-tableau CONTIGU dont la somme est maximale, et renvoie cette somme. Ex : [-2,1,-3,4,-1,2,1,-5,4] → 6 (le sous-tableau [4,-1,2..."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Moyen"
number: 44
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Trouve le sous-tableau CONTIGU dont la somme est maximale, et renvoie cette somme. Ex : [-2,1,-3,4,-1,2,1,-5,4] → 6 (le sous-tableau [4,-1,2,1])."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres, positifs et négatifs mélangés, et vous devez trouver la portion CONTIGUE (des nombres qui se suivent, sans saut) dont la somme est la plus grande possible. Par exemple, dans [-2,1,-3,4,-1,2,1,-5,4], la meilleure portion est [4,-1,2,1], qui donne 6. Imaginez que vous suivez votre solde en banque jour après jour, avec des jours où vous gagnez de l'argent et des jours où vous en perdez : vous cherchez la meilleure période consécutive pour ce solde cumulé. L'astuce est de se demander, à chaque jour, s'il vaut mieux continuer la période en cours ou repartir de zéro à partir d'aujourd'hui, dès que le passé récent plombe plus qu'il n'aide.

## L'idée clé

Algorithme de Kadane : en avançant, on maintient la meilleure somme d'un sous-tableau qui SE TERMINE ici. Décision locale à chaque élément : soit on étend le sous-tableau courant (current + num), soit on repart de zéro (num seul) — on repart dès que le passé cumulé est un fardeau négatif.

## Pourquoi cette solution ?

Deux variables : currentSum (meilleur finissant ici) et maxSum (meilleur global). C'est une DP compressée à O(1) d'espace : dp[i] ne dépend que de dp[i-1]. Kadane est cité dans quasiment tous les guides d'entretien — à savoir dériver, pas juste réciter.

## Solution Java

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int currentSum = nums[0]; // meilleure somme d'un sous-tableau finissant ici
        int maxSum = nums[0];     // meilleure somme globale

        for (int i = 1; i < nums.length; i++) {
            // Etendre le sous-tableau courant, ou repartir a neuf ?
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
}
```

## Complexité

Temps O(N) : une seule passe. Espace O(1) : la DP tabulaire dp[N] est compressée en deux variables.
