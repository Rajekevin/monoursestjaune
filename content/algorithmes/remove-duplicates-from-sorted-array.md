---
title: "Remove Duplicates from Sorted Array"
description: "Un tableau est trié : supprime les doublons EN PLACE pour que chaque valeur n'apparaisse qu'une fois, et renvoie k, le nombre d'éléments uni..."
category: "Algorithmes & Structures de données"
pattern: "Two Pointers"
difficulty: "Facile"
number: 20
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "two-pointers"]
summary: "Un tableau est trié : supprime les doublons EN PLACE pour que chaque valeur n'apparaisse qu'une fois, et renvoie k, le nombre d'éléments uniques (les k premières cases doivent contenir le résultat)."
---

## C'est quoi le problème, en clair ?

Vous avez une liste de nombres déjà triée, avec des valeurs qui se répètent, et il faut supprimer les doublons pour qu'il ne reste qu'une seule fois chaque valeur — le tout directement dans la liste d'origine, sans en créer une nouvelle. Comme la liste est triée, les doublons sont forcément côte à côte, un peu comme des chaussettes identiques déjà rangées ensemble dans un tiroir : il suffit de parcourir le tiroir et de ne garder que la première chaussette de chaque paire identique rencontrée.

## L'idée clé

Le tri met tous les doublons côte à côte. Pattern lecteur/écrivain : le lecteur parcourt tout, l'écrivain n'avance que quand il voit une valeur DIFFÉRENTE de la dernière écrite. Tout ce qui est avant l'écrivain est propre et trié.

## Pourquoi cette solution ?

Même squelette que [Move Zeroes](/algorithmes/move-zeroes/) : deux indices sur un seul tableau, zéro allocation. Comprendre ce duo lecteur/écrivain une fois pour toutes débloque toute la famille des problèmes « in-place ».

## Solution Java

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;

        int write = 1; // nums[0] est toujours garde

        for (int read = 1; read < nums.length; read++) {
            // Nouvelle valeur (differente de la derniere ecrite) ?
            if (nums[read] != nums[write - 1]) {
                nums[write] = nums[read];
                write++;
            }
        }
        return write; // nombre d'elements uniques
    }
}
```

## Complexité

Temps O(N) : une passe. Espace O(1) : réécriture en place.
