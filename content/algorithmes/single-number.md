---
title: "Single Number"
description: "Chaque élément du tableau apparaît exactement deux fois, sauf UN qui apparaît une seule fois. Trouve-le en temps linéaire et SANS mémoire su..."
category: "Algorithmes & Structures de données"
pattern: "Math & Bits"
difficulty: "Facile"
number: 15
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "math-bits"]
summary: "Chaque élément du tableau apparaît exactement deux fois, sauf UN qui apparaît une seule fois. Trouve-le en temps linéaire et SANS mémoire supplémentaire."
---

## C'est quoi le problème, en clair ?

Dans une liste de nombres, chacun apparaît exactement deux fois, sauf un seul intrus qui n'apparaît qu'une fois — il faut le retrouver. Imaginez une pile de chaussettes qui devraient toutes être par paires : vous devez repérer la chaussette solitaire, mais sans le droit de poser un carnet pour noter celles déjà vues (c'est la contrainte « pas de mémoire supplémentaire »). L'astuce consiste à utiliser une opération mathématique un peu spéciale qui fait disparaître automatiquement tout ce qui va par paire, ne laissant que l'élément seul à la fin.

## L'idée clé

Le XOR (^) a deux propriétés magiques : a ^ a = 0 (un nombre s'annule avec lui-même) et a ^ 0 = a. En XORant tout le tableau, toutes les paires s'annulent : il ne reste que l'élément unique. Ordre indifférent car XOR est commutatif.

## Pourquoi cette solution ?

La contrainte « O(1) d'espace » élimine la HashMap et force le bit-trick — l'interviewer teste ta connaissance des opérateurs binaires. Une boucle, une variable, zéro structure : la réponse la plus courte de cette liste.

## Solution Java

```java
class Solution {
    public int singleNumber(int[] nums) {
        int result = 0; // 0 est neutre pour le XOR

        for (int num : nums) {
            result ^= num; // les paires s'annulent (a ^ a = 0)
        }
        // Il ne reste que l'element apparu une seule fois
        return result;
    }
}
```

## Complexité

Temps O(N) : une passe. Espace O(1) : une seule variable — exactement ce que la contrainte exige.
