---
title: "Container With Most Water"
description: "height[i] est la hauteur d'une paroi verticale en position i. Deux parois + l'axe des x forment un bac : trouve la paire qui contient le plu..."
category: "Algorithmes & Structures de données"
pattern: "Two Pointers"
difficulty: "Moyen"
number: 47
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "two-pointers"]
summary: "height[i] est la hauteur d'une paroi verticale en position i. Deux parois + l'axe des x forment un bac : trouve la paire qui contient le plus d'eau. Aire = min(h1, h2) × distance."
---

## C'est quoi le problème, en clair ?

On vous donne une série de parois verticales de hauteurs différentes, alignées les unes à côté des autres. En choisissant deux d'entre elles, vous formez un bac capable de contenir de l'eau, dont la capacité dépend de la plus petite des deux hauteurs et de la distance qui les sépare. Le but est de trouver la paire de parois qui contient le plus d'eau possible. Imaginez une rangée de piquets de hauteurs inégales plantés dans le sol : vous cherchez les deux piquets entre lesquels l'eau versée resterait piégée en plus grande quantité, sans déborder par-dessus le plus petit des deux.

## L'idée clé

Deux pointeurs aux extrémités (largeur maximale au départ). L'argument clé : c'est TOUJOURS la paroi la plus COURTE qu'il faut abandonner. Pourquoi ? Elle limite la hauteur, et rétrécir la largeur en la gardant ne peut jamais donner mieux — on peut donc l'éliminer sans rien rater.

## Pourquoi cette solution ?

Aucune structure : deux indices et un max. Le vrai livrable en entretien est la PREUVE de l'argument d'élimination (pourquoi on ne rate aucune paire optimale) — être capable de la dérouler à voix haute vaut plus que le code lui-même.

## Solution Java

```java
class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int best = 0;

        while (left < right) {
            // Aire limitee par la paroi la plus courte
            int area = Math.min(height[left], height[right]) * (right - left);
            best = Math.max(best, area);

            // Abandonner la paroi la plus courte : garder la plus haute
            // ne peut que laisser une chance a une plus grande aire
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return best;
    }
}
```

## Complexité

Temps O(N) : chaque pointeur ne bouge que vers l'intérieur, N pas au total. Espace O(1).
