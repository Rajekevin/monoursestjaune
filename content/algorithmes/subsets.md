---
title: "Subsets"
description: "Génère TOUS les sous-ensembles possibles d'un tableau d'éléments distincts (le « power set »). Ex : [1,2,3] → [[],[1],[2],[3],[1,2],[1,3],[2..."
category: "Algorithmes & Structures de données"
pattern: "Backtracking"
difficulty: "Moyen"
number: 65
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "backtracking"]
summary: "Génère TOUS les sous-ensembles possibles d'un tableau d'éléments distincts (le « power set »). Ex : [1,2,3] → [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]."
---

## C'est quoi le problème, en clair ?

On vous donne une liste d'éléments et vous devez lister TOUS les sous-ensembles possibles, du plus petit (vide) au plus grand (la liste entière). Imaginez que vous préparez un sac de voyage avec quelques objets disponibles : pour chaque objet, vous avez le choix de le prendre ou de le laisser, et vous voulez lister toutes les combinaisons de bagages possibles. La technique utilisée, le « backtracking » (essayer un choix, explorer où il mène, puis l'annuler pour tester le choix suivant — voir le [glossaire](/glossaire-algorithmes/)), revient à essayer chaque objet un par un, explorer toutes les suites possibles, puis le reposer avant d'essayer autre chose.

## L'idée clé

Backtracking : à chaque position de départ, on choisit un élément à AJOUTER, on explore récursivement la suite, puis on RETIRE l'élément (le « backtrack ») pour essayer le choix suivant. Chaque état intermédiaire du chemin est lui-même un sous-ensemble valide → on l'enregistre à chaque appel.

## Pourquoi cette solution ?

Une List<Integer> partagée comme chemin courant + le trio sacré : add → recurse → remove(size-1). Copier le chemin (new ArrayList<>(path)) au moment de l'enregistrer, sinon toutes les entrées du résultat pointent vers la même liste mutée — LE bug classique du backtracking Java.

## Solution Java

```java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> path,
                           List<List<Integer>> result) {
        // Chaque etat du chemin est un sous-ensemble valide : COPIER avant d'ajouter
        result.add(new ArrayList<>(path));

        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);                       // 1. choisir
            backtrack(nums, i + 1, path, result);    // 2. explorer la suite
            path.remove(path.size() - 1);            // 3. annuler (backtrack)
        }
    }
}
```

## Complexité

Temps O(N × 2^N) : 2^N sous-ensembles, copie en O(N) chacun. Espace O(N) pour le chemin et la récursion (hors sortie).
