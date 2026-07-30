---
title: "House Robber"
description: "Un voleur longe une rue de maisons contenant nums[i] euros, mais ne peut pas cambrioler deux maisons ADJACENTES. Quel butin maximal ?"
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Moyen"
number: 74
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Un voleur longe une rue de maisons contenant nums[i] euros, mais ne peut pas cambrioler deux maisons ADJACENTES. Quel butin maximal ?"
---

## C'est quoi le problème, en clair ?

Un cambrioleur longe une rue où chaque maison contient une somme d'argent différente, mais il ne peut jamais voler deux maisons voisines la même nuit (trop risqué, l'alarme se déclencherait). Il doit choisir quelles maisons cambrioler pour repartir avec le plus d'argent possible, sachant qu'à chaque maison il n'a que deux choix : la voler, ou la laisser pour pouvoir voler tranquillement la suivante. C'est un peu comme composer un menu où deux plats côte à côte s'excluent mutuellement : il faut sauter judicieusement pour maximiser le total.

## L'idée clé

À chaque maison, décision binaire : la voler (son montant + le meilleur butin jusqu'à la maison i-2) ou la sauter (le meilleur butin jusqu'à i-1). dp[i] = max(nums[i] + dp[i-2], dp[i-1]). Comme Climbing Stairs ([Climbing Stairs](/algorithmes/climbing-stairs/)) : seuls les deux états précédents comptent → deux variables glissantes.

## Pourquoi cette solution ?

C'est LE problème-école pour formuler une DP : définir l'état (« meilleur butin sur les i premières maisons »), la transition, les cas de base. Savoir le raconter dans cet ordre — état, transition, base, réponse — est exactement la grille d'évaluation des interviewers.

## Solution Java

```java
class Solution {
    public int rob(int[] nums) {
        int prev2 = 0; // meilleur butin jusqu'a la maison i-2
        int prev1 = 0; // meilleur butin jusqu'a la maison i-1

        for (int amount : nums) {
            // Voler cette maison (amount + prev2) ou la sauter (prev1) ?
            int current = Math.max(amount + prev2, prev1);
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
}
```

## Complexité

Temps O(N) : une passe. Espace O(1) : DP compressée en deux variables.
