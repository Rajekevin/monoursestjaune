---
title: "Climbing Stairs"
description: "Tu montes un escalier de N marches. À chaque pas tu montes 1 ou 2 marches. Combien de façons distinctes d'atteindre le sommet ? Ex : N=3 → 3..."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Facile"
number: 14
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Tu montes un escalier de N marches. À chaque pas tu montes 1 ou 2 marches. Combien de façons distinctes d'atteindre le sommet ? Ex : N=3 → 3 façons (1+1+1, 1+2, 2+1)."
---

## C'est quoi le problème, en clair ?

Vous montez un escalier de N marches, et à chaque pas vous pouvez monter soit une marche, soit deux. On vous demande de combien de façons différentes vous pouvez atteindre le sommet. C'est un peu comme compter les chemins possibles sur un jeu de plateau très simple : pour savoir de combien de façons on peut arriver à une marche donnée, il suffit de regarder d'où on pouvait venir juste avant — la marche du dessous, ou celle d'encore en dessous.

## L'idée clé

Pour arriver à la marche N, on venait forcément de la marche N-1 (pas de 1) ou de la marche N-2 (pas de 2). Donc ways(N) = ways(N-1) + ways(N-2) : c'est Fibonacci déguisé ! Ta toute première relation de récurrence DP.

## Pourquoi cette solution ?

La récursion naïve recalcule les mêmes valeurs de façon exponentielle O(2^N). Comme chaque étape ne dépend que des DEUX précédentes, deux variables qui « glissent » suffisent : la DP la plus compacte qui existe, sans même un tableau.

## Solution Java

```java
class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n; // 1 marche -> 1 facon, 2 marches -> 2 facons

        int twoBack = 1;  // nb de facons d'atteindre la marche i-2
        int oneBack = 2;  // nb de facons d'atteindre la marche i-1

        for (int i = 3; i <= n; i++) {
            int current = oneBack + twoBack; // relation de recurrence
            twoBack = oneBack;               // on fait glisser la fenetre
            oneBack = current;
        }
        return oneBack;
    }
}
```

## Complexité

Temps O(N) : une boucle simple. Espace O(1) : deux variables au lieu d'un tableau dp[N] — l'optimisation classique à mentionner.
