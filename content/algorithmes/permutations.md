---
title: "Permutations"
description: "Génère toutes les permutations d'un tableau d'éléments distincts. Ex : [1,2,3] → 6 permutations."
category: "Algorithmes & Structures de données"
pattern: "Backtracking"
difficulty: "Moyen"
number: 67
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "backtracking"]
summary: "Génère toutes les permutations d'un tableau d'éléments distincts. Ex : [1,2,3] → 6 permutations."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres différents, et il faut lister TOUS les arrangements possibles de ces nombres, dans tous les ordres — c'est ce qu'on appelle les permutations. Imaginez trois amis qui doivent se mettre en file pour une photo : il y a plusieurs façons de les ordonner (Alice-Bob-Chloé, Bob-Alice-Chloé, etc.), et il faut toutes les lister. On construit chaque arrangement petit à petit, en ajoutant un nom qui n'a pas encore été utilisé, puis on revient en arrière pour essayer une autre combinaison une fois qu'un arrangement est complet.

## L'idée clé

Contrairement aux sous-ensembles, l'ORDRE compte et chaque élément doit être utilisé exactement une fois : à chaque niveau on essaie TOUS les éléments pas encore pris (pas de start). Un tableau used[] marque les éléments déjà dans le chemin.

## Pourquoi cette solution ?

boolean[] used est plus rapide et plus lisible que path.contains() (qui coûterait O(N) par test). On enregistre quand path.size() == nums.length. Même trio choisir/explorer/annuler — le squelette de backtracking est identique, seule la condition de choix change.

## Solution Java

```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> path,
                           List<List<Integer>> result) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path)); // permutation complete
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;    // deja place dans le chemin

            used[i] = true;           // 1. choisir
            path.add(nums[i]);
            backtrack(nums, used, path, result); // 2. explorer
            path.remove(path.size() - 1);        // 3. annuler
            used[i] = false;
        }
    }
}
```

## Complexité

Temps O(N × N!) : N! permutations, copie O(N) chacune. Espace O(N) pour le chemin, used et la récursion.
