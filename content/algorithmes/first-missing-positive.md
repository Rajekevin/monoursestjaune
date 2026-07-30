---
title: "First Missing Positive"
description: "Trouve le plus petit entier POSITIF (≥ 1) absent d'un tableau non trié — en O(N) temps et O(1) espace supplémentaire. Ces contraintes interd..."
category: "Algorithmes & Structures de données"
pattern: "Arrays"
difficulty: "Difficile"
number: 99
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "arrays"]
summary: "Trouve le plus petit entier POSITIF (≥ 1) absent d'un tableau non trié — en O(N) temps et O(1) espace supplémentaire. Ces contraintes interdisent le tri ET le HashSet."
---

## C'est quoi le problème, en clair ?

On vous donne un tas de nombres en désordre, avec des négatifs, des doublons, parfois des trous, et vous devez trouver le plus petit entier positif (1, 2, 3...) qui n'apparaît nulle part dedans. La difficulté, c'est que vous n'avez pas le droit de trier le tableau ni d'utiliser une structure de mémoire supplémentaire pour « cocher » les nombres déjà vus. Imaginez une salle de classe avec des chaises numérotées de 1 à N : vous voulez savoir quel est le premier numéro de chaise vide, en utilisant uniquement les chaises elles-mêmes — pas de feuille à part — pour noter qui est passé où.

## L'idée clé

Observation clé : la réponse est forcément dans [1, N+1] (N = taille du tableau). Le tableau lui-même peut donc servir de « HashSet » : on replace chaque valeur v ∈ [1, N] dans SA case nums[v-1] par échanges (cycle sort). Ensuite, la première case i où nums[i] != i+1 révèle le manquant.

## Pourquoi cette solution ?

La boucle while (pas if !) d'échanges est le cœur : on échange tant que la valeur courante n'est pas à sa place ET que sa place cible ne contient pas déjà la bonne valeur (garde anti-boucle infinie sur les doublons). Chaque échange place définitivement un élément → O(N) amorti malgré le while imbriqué.

## Solution Java

```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;

        // Phase 1 : placer chaque valeur v de [1, n] dans sa case nums[v-1]
        for (int i = 0; i < n; i++) {
            // Echanger tant que nums[i] est placable et pas deja bien place
            while (nums[i] >= 1 && nums[i] <= n
                   && nums[nums[i] - 1] != nums[i]) {
                int target = nums[i] - 1;
                int temp = nums[target];
                nums[target] = nums[i];
                nums[i] = temp;
            }
        }

        // Phase 2 : la premiere case incoherente revele le manquant
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                return i + 1;
            }
        }
        return n + 1; // tableau parfait [1..n] : le manquant est n+1
    }
}
```

## Complexité

Temps O(N) amorti : chaque échange met un élément à sa place définitive, au plus N échanges au total. Espace O(1) : le tableau d'entrée sert de table de hachage.
