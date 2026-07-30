---
title: "Roman to Integer"
description: "Convertis un nombre romain (I, V, X, L, C, D, M) en entier. Subtilité : IV = 4 et IX = 9 — un symbole plus petit AVANT un plus grand se sous..."
category: "Algorithmes & Structures de données"
pattern: "Strings"
difficulty: "Facile"
number: 26
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "strings"]
summary: "Convertis un nombre romain (I, V, X, L, C, D, M) en entier. Subtilité : IV = 4 et IX = 9 — un symbole plus petit AVANT un plus grand se soustrait."
---

## C'est quoi le problème, en clair ?

Il faut convertir un nombre écrit en chiffres romains (I, V, X, L, C, D, M) en un nombre entier classique. La subtilité, c'est que quand un petit symbole est placé juste avant un plus grand, comme le I avant le V dans « IV », il faut le SOUSTRAIRE au lieu de l'additionner (IV = 5 - 1 = 4). C'est comme lire une facture à l'ancienne : on additionne chaque symbole à sa valeur, sauf quand on remarque qu'un petit vient juste avant un grand, où on comprend qu'il faut plutôt le retrancher.

## L'idée clé

Règle unique qui couvre tous les cas : on parcourt de gauche à droite, et si la valeur du symbole courant est INFÉRIEURE à celle du suivant, on la SOUSTRAIT ; sinon on l'AJOUTE. Ex : I(1) < V(5) dans "IV" → -1 + 5 = 4.

## Pourquoi cette solution ?

Une Map<Character,Integer> (ou un switch) pour les valeurs, puis une seule passe avec un regard « un cran devant » (lookahead). Pas besoin de coder les 6 paires spéciales (IV, IX, XL...) : la règle < les génère toutes.

## Solution Java

```java
class Solution {
    public int romanToInt(String s) {
        Map<Character, Integer> val = Map.of(
            'I', 1, 'V', 5, 'X', 10, 'L', 50,
            'C', 100, 'D', 500, 'M', 1000
        );

        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            int current = val.get(s.charAt(i));

            // Regarder le symbole suivant : plus grand ? -> cas soustractif (IV, IX...)
            if (i + 1 < s.length() && current < val.get(s.charAt(i + 1))) {
                total -= current;
            } else {
                total += current;
            }
        }
        return total;
    }
}
```

## Complexité

Temps O(N) : une passe sur la chaîne. Espace O(1) : la map a toujours 7 entrées.
