---
title: "Missing Number"
description: "Un tableau contient N nombres distincts pris dans l'intervalle [0, N]. Un seul nombre de l'intervalle manque : trouve-le. Ex : [3,0,1] → 2."
category: "Algorithmes & Structures de données"
pattern: "Math & Bits"
difficulty: "Facile"
number: 13
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "math-bits"]
summary: "Un tableau contient N nombres distincts pris dans l'intervalle [0, N]. Un seul nombre de l'intervalle manque : trouve-le. Ex : [3,0,1] → 2."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres qui devrait normalement contenir tous les entiers de 0 jusqu'à N, mais un seul manque à l'appel — à vous de le retrouver. Imaginez une salle de classe numérotée de 0 à 30 : vous faites l'appel, presque tout le monde répond, et vous devez deviner qui est absent sans reprendre la liste depuis le début. Au lieu de comparer élève par élève, il existe une astuce plus rapide : on connaît la somme que tout le monde devrait donner ensemble, et il suffit de comparer avec la somme réellement obtenue — la différence, c'est l'absent.

## L'idée clé

La somme de 0 à N vaut N×(N+1)/2 (formule de Gauss). Le nombre manquant est simplement cette somme attendue moins la somme réelle du tableau. Élégant, O(1) d'espace, aucune structure.

## Pourquoi cette solution ?

Pure arithmétique : pas de HashSet (qui marcherait mais en O(N) d'espace). Variante bit-trick à connaître : XOR de tous les indices et de toutes les valeurs — les paires s'annulent, il ne reste que le manquant, et zéro risque d'overflow.

## Solution Java

```java
class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;

        // Somme attendue de 0 a n : formule de Gauss
        int expected = n * (n + 1) / 2;

        // Somme reelle des elements presents
        int actual = 0;
        for (int num : nums) {
            actual += num;
        }

        // La difference est exactement le nombre manquant
        return expected - actual;
    }
}
```

## Complexité

Temps O(N) : une passe pour sommer. Espace O(1) : deux entiers.
