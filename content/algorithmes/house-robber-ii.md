---
title: "House Robber II"
description: "Même problème, mais les maisons forment un CERCLE : la première et la dernière sont adjacentes. Butin maximal ?"
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Moyen"
number: 75
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Même problème, mais les maisons forment un CERCLE : la première et la dernière sont adjacentes. Butin maximal ?"
---

## C'est quoi le problème, en clair ?

C'est la même histoire que le problème du voleur ([House Robber](/algorithmes/house-robber/)), sauf que cette fois les maisons sont disposées en cercle plutôt qu'en ligne droite, comme autour d'une place de village. La règle reste la même — impossible de cambrioler deux maisons voisines la même nuit — mais comme le cercle se referme, la première et la dernière maison comptent aussi comme voisines. Il faut donc trouver le butin maximal en tenant compte de cette contrainte supplémentaire aux deux extrémités.

## L'idée clé

Le cercle crée UNE seule contrainte nouvelle : maison 0 et maison n-1 incompatibles. Astuce de décomposition : résoudre DEUX problèmes linéaires — l'un sans la dernière maison (0..n-2), l'autre sans la première (1..n-1) — et prendre le max. Chaque scénario retombe sur House Robber classique.

## Pourquoi cette solution ?

On réutilise la fonction du [House Robber](/algorithmes/house-robber/) sur des bornes : « réduire un problème circulaire à deux problèmes linéaires » est une technique générale (elle ressert sur d'autres énoncés circulaires). Cas limite : une seule maison → la voler directement.

## Solution Java

```java
class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];

        // Scenario A : ignorer la derniere maison / Scenario B : ignorer la premiere
        return Math.max(robLinear(nums, 0, n - 2),
                        robLinear(nums, 1, n - 1));
    }

    // House Robber classique sur l'intervalle [start, end]
    private int robLinear(int[] nums, int start, int end) {
        int prev2 = 0, prev1 = 0;
        for (int i = start; i <= end; i++) {
            int current = Math.max(nums[i] + prev2, prev1);
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
}
```

## Complexité

Temps O(N) : deux passes linéaires. Espace O(1).
