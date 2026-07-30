---
title: "Merge Sorted Array"
description: "nums1 (taille m+n, avec n zéros de remplissage à la fin) et nums2 (taille n) sont triés. Fusionne nums2 DANS nums1, en place, pour que nums1..."
category: "Algorithmes & Structures de données"
pattern: "Two Pointers"
difficulty: "Facile"
number: 17
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "two-pointers"]
summary: "nums1 (taille m+n, avec n zéros de remplissage à la fin) et nums2 (taille n) sont triés. Fusionne nums2 DANS nums1, en place, pour que nums1 soit trié."
---

## C'est quoi le problème, en clair ?

On vous donne deux tableaux de nombres déjà triés : nums1, qui a de la place libre à la fin (remplie de zéros), et nums2, plus petit. Vous devez fusionner nums2 directement DANS nums1, sans utiliser de tableau supplémentaire, pour que nums1 devienne un seul tableau trié. Imaginez deux jeux de cartes déjà triés et une seule rangée de cases pour tout accueillir, avec juste assez de cases vides à la fin de la première rangée pour que tout tienne : plutôt que de commencer par le début (où vous risqueriez d'écraser des cartes pas encore rangées), vous placez les plus grandes cartes en dernier, en partant de la fin de la rangée et en reculant.

## L'idée clé

Le déclic contre-intuitif : fusionner PAR LA FIN. L'arrière de nums1 est vide, donc en plaçant d'abord les plus GRANDS éléments à la fin, on n'écrase jamais une valeur pas encore traitée. Trois pointeurs qui reculent : fin de nums1 utile, fin de nums2, position d'écriture.

## Pourquoi cette solution ?

Aucune structure auxiliaire : c'est le but du problème (fusion in-place). Fusionner par l'avant obligerait à décaler des éléments (O(N²)) ou copier nums1 (O(N) d'espace). Détail : si nums1 s'épuise avant nums2, il faut recopier le reste de nums2.

## Solution Java

```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;         // dernier element utile de nums1
        int j = n - 1;         // dernier element de nums2
        int write = m + n - 1; // position d'ecriture, tout a la fin

        // On place le plus grand des deux candidats a la fin, puis on recule
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[write--] = nums1[i--];
            } else {
                nums1[write--] = nums2[j--];
            }
        }
        // Si i >= 0 encore : ces elements sont deja a leur place dans nums1
    }
}
```

## Complexité

Temps O(m + n) : chaque élément est écrit une fois. Espace O(1) : fusion entièrement en place, aucun tableau temporaire.
