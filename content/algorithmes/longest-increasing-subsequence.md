---
title: "Longest Increasing Subsequence"
description: "Trouve la longueur de la plus longue sous-suite STRICTEMENT croissante (pas forcément contiguë : on peut sauter des éléments en gardant l'or..."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Moyen"
number: 79
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Trouve la longueur de la plus longue sous-suite STRICTEMENT croissante (pas forcément contiguë : on peut sauter des éléments en gardant l'ordre). Ex : [10,9,2,5,3,7,101,18] → 4 ([2,3,7,101])."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres, et vous devez trouver la plus longue suite de nombres strictement croissants qu'on peut extraire en gardant leur ordre d'origine, sans obligation qu'ils soient côte à côte dans la liste de départ. Par exemple, dans [10,9,2,5,3,7,101,18], la suite [2,3,7,101] est valide et compte 4 éléments. Imaginez une file de personnes de tailles variées : vous cherchez le plus grand groupe de personnes qui, prises dans l'ordre où elles sont alignées, sont chacune plus grande que la précédente — quitte à en ignorer beaucoup au passage. C'est un problème classique de programmation dynamique (une technique qui construit la réponse à partir de sous-problèmes plus petits déjà résolus, voir le [glossaire](/glossaire-algorithmes/)).

## L'idée clé

DP quadratique d'abord : dp[i] = longueur de la meilleure sous-suite qui SE TERMINE en i = 1 + max(dp[j]) pour tout j < i avec nums[j] < nums[i]. Puis la version experte O(N log N) : maintenir un tableau tails où tails[k] = plus petite fin possible d'une sous-suite de longueur k+1, mis à jour par recherche binaire.

## Pourquoi cette solution ?

La version O(N log N) exploite que tails est TRIÉ → binarySearch pour trouver où remplacer/étendre. Subtilité à assumer : tails n'est PAS la sous-suite elle-même, seulement ses meilleures « fins » — sa longueur est la réponse. Présenter O(N²) puis optimiser est le déroulé idéal en live.

## Solution Java

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        // tails[k] = la plus petite valeur de fin d'une sous-suite de longueur k+1
        int[] tails = new int[nums.length];
        int size = 0; // longueur actuelle de la meilleure sous-suite

        for (int num : nums) {
            // Recherche binaire de la position de num dans tails[0..size)
            int left = 0, right = size;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails[mid] < num) left = mid + 1;
                else right = mid;
            }

            tails[left] = num;              // remplacer par une fin plus petite...
            if (left == size) size++;       // ...ou etendre la sous-suite d'un cran
        }
        return size;
    }
}
```

## Complexité

Temps O(N log N) : une recherche binaire par élément. Espace O(N) pour tails. (Version DP simple : O(N²) / O(N).)
