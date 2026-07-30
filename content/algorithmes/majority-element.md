---
title: "Majority Element"
description: "Trouve l'élément qui apparaît PLUS de N/2 fois dans le tableau (il existe toujours). Ex : [2,2,1,1,1,2,2] → 2."
category: "Algorithmes & Structures de données"
pattern: "Arrays"
difficulty: "Facile"
number: 19
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "arrays"]
summary: "Trouve l'élément qui apparaît PLUS de N/2 fois dans le tableau (il existe toujours). Ex : [2,2,1,1,1,2,2] → 2."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres, avec la garantie qu'un nombre y apparaît strictement plus de la moitié du temps (plus de N/2 fois). Vous devez retrouver ce nombre majoritaire. Par exemple, dans [2,2,1,1,1,2,2], c'est 2. Imaginez un vote où chaque personne exprime un choix : si un candidat a plus de la moitié des voix, il en a forcément plus que tous les autres réunis — l'astuce consiste à laisser les votes s'annuler deux par deux (un pour, un contre) et à regarder qui reste debout à la fin.

## L'idée clé

Vote de Boyer-Moore : on maintient un candidat et un compteur. Chaque élément identique au candidat vote +1, chaque élément différent vote -1. À zéro, on change de candidat. Comme le majoritaire a plus de voix que TOUS les autres réunis, il survit forcément à la fin.

## Pourquoi cette solution ?

HashMap de comptage = O(N) d'espace ; tri puis élément du milieu = O(N log N). Boyer-Moore fait O(N) temps / O(1) espace — c'est l'algorithme « wow » que l'interviewer espère, et il s'explique en une phrase avec l'image des votes qui s'annulent.

## Solution Java

```java
class Solution {
    public int majorityElement(int[] nums) {
        int candidate = nums[0];
        int count = 0;

        for (int num : nums) {
            if (count == 0) {
                candidate = num; // nouveau candidat quand le score retombe a zero
            }
            count += (num == candidate) ? 1 : -1; // vote pour ou contre
        }
        // L'element majoritaire (> n/2) survit toujours a ce jeu d'annulations
        return candidate;
    }
}
```

## Complexité

Temps O(N) : une passe. Espace O(1) : deux variables — imbattable.
