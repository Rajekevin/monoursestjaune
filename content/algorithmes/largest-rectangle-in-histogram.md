---
title: "Largest Rectangle in Histogram"
description: "Un histogramme de barres de largeur 1 : trouve l'aire du plus grand RECTANGLE inscrit. Ex : [2,1,5,6,2,3] → 10 (hauteur 5 sur les barres 5 e..."
category: "Algorithmes & Structures de données"
pattern: "Stack"
difficulty: "Difficile"
number: 87
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "stack"]
summary: "Un histogramme de barres de largeur 1 : trouve l'aire du plus grand RECTANGLE inscrit. Ex : [2,1,5,6,2,3] → 10 (hauteur 5 sur les barres 5 et 6)."
---

## C'est quoi le problème, en clair ?

Un histogramme, c'est une suite de barres verticales collées les unes aux autres, toutes de largeur 1 mais de hauteurs différentes — pensez à la silhouette d'une ville vue de loin, avec des immeubles de tailles inégales côte à côte. Il faut trouver le plus grand rectangle qu'on peut dessiner à l'intérieur de cette silhouette, en utilisant une ou plusieurs barres consécutives comme largeur, sans jamais dépasser la hauteur de la barre la plus basse du groupe choisi. Le rectangle le plus large n'est pas forcément le plus haut, et inversement : il faut trouver le meilleur compromis entre largeur et hauteur.

## L'idée clé

Pour chaque barre : jusqu'où son rectangle de hauteur h s'étend-il ? Jusqu'à la première barre PLUS BASSE de chaque côté. Pile monotone CROISSANTE : quand une barre plus basse arrive, elle « clôture » les barres plus hautes de la pile — au dépilement, on connaît leurs deux frontières et donc leur aire.

## Pourquoi cette solution ?

Le calcul de largeur au dépilement est LE point délicat : largeur = i - indice_sous_le_sommet - 1 (pile vide → largeur = i). Une barre sentinelle de hauteur 0 en fin de parcours force le dépilement final et évite une boucle de vidange séparée. Cousin direct de [Daily Temperatures](/algorithmes/daily-temperatures/) en version aires.

## Solution Java

```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>(); // indices, hauteurs croissantes
        int maxArea = 0;
        int n = heights.length;

        for (int i = 0; i <= n; i++) {
            // Sentinelle : hauteur 0 apres la fin, pour tout depiler
            int h = (i == n) ? 0 : heights[i];

            // La barre courante cloture toutes les barres plus hautes
            while (!stack.isEmpty() && heights[stack.peek()] > h) {
                int height = heights[stack.pop()];
                // Frontiere gauche : la barre sous le sommet ; droite : i
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }
}
```

## Complexité

Temps O(N) amorti : chaque barre est empilée et dépilée une fois. Espace O(N) pour la pile.
