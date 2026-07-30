---
title: "Combination Sum"
description: "Avec des candidats distincts et une cible, trouve toutes les combinaisons UNIQUES dont la somme vaut la cible — chaque candidat est réutilis..."
category: "Algorithmes & Structures de données"
pattern: "Backtracking"
difficulty: "Moyen"
number: 66
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "backtracking"]
summary: "Avec des candidats distincts et une cible, trouve toutes les combinaisons UNIQUES dont la somme vaut la cible — chaque candidat est réutilisable à volonté. Ex : [2,3,6,7], target=7 → [[2,2,3],[7]]."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres (les candidats) et un total à atteindre. Vous devez lister toutes les combinaisons possibles de ces nombres qui, additionnées, donnent exactement ce total — sachant que vous pouvez réutiliser un même nombre plusieurs fois. Imaginez que vous devez payer une somme précise avec des pièces de valeurs fixes, piochées autant de fois que vous voulez dans un tas illimité de chaque valeur : il faut explorer tous les assemblages possibles, en abandonnant en cours de route (c'est le principe du « backtracking » : essayer un choix, puis l'annuler pour en tester un autre, voir le [glossaire](/glossaire-algorithmes/)) ceux qui dépassent déjà le total visé.

## L'idée clé

Backtracking sur la cible restante : à chaque étape, essayer chaque candidat à partir de l'indice start ; le réutiliser = recurser avec le MÊME indice i (pas i+1). Garder start empêche de regénérer [2,3] et [3,2] : les combinaisons restent ordonnées, donc uniques par construction.

## Pourquoi cette solution ?

Trier les candidats permet de COUPER la branche (break) dès qu'un candidat dépasse la cible restante — un pruning simple qui accélère énormément. La différence i vs i+1 dans l'appel récursif est LE réglage qui distingue toute la famille (Subsets, Combination Sum, Permutations).

## Solution Java

```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates); // permet le pruning
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] candidates, int remaining, int start,
                           List<Integer> path, List<List<Integer>> result) {
        if (remaining == 0) {
            result.add(new ArrayList<>(path)); // cible atteinte : combinaison valide
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break; // trop grand (tableau trie) : couper

            path.add(candidates[i]);
            // MEME indice i : le candidat est reutilisable
            backtrack(candidates, remaining - candidates[i], i, path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

## Complexité

Temps O(N^(T/m)) au pire (T = cible, m = plus petit candidat) : arbre de décision exponentiel, borné par le pruning. Espace O(T/m) de profondeur de récursion.
