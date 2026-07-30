---
title: "Trapping Rain Water"
description: "height[i] est la hauteur d'un mur. Après la pluie, combien d'unités d'eau restent piégées entre les murs ? Ex : [0,1,0,2,1,0,1,3,2,1,2,1] → ..."
category: "Algorithmes & Structures de données"
pattern: "Two Pointers"
difficulty: "Difficile"
number: 81
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "two-pointers"]
summary: "height[i] est la hauteur d'un mur. Après la pluie, combien d'unités d'eau restent piégées entre les murs ? Ex : [0,1,0,2,1,0,1,3,2,1,2,1] → 6. Un très grand classique difficile."
---

## C'est quoi le problème, en clair ?

On vous donne une suite de murs de hauteurs différentes, côte à côte, et vous devez calculer combien d'eau resterait piégée entre eux après une averse. Imaginez la silhouette d'une ville vue de profil : la pluie tombe partout, mais l'eau ne peut s'accumuler au-dessus d'un immeuble bas que si des immeubles plus hauts l'encadrent des deux côtés — sinon elle s'écoule. Pour chaque position, la hauteur d'eau dépend donc du plus haut mur croisé à gauche ET à droite, le plus bas des deux fixant la limite.

## L'idée clé

L'eau au-dessus de la position i vaut min(plus haut mur à gauche, plus haut mur à droite) - height[i]. Version experte à deux pointeurs : on avance toujours du côté du mur le plus BAS, car son eau est déjà déterminée par le maxLeft/maxRight de son propre côté (l'autre côté a forcément mieux).

## Pourquoi cette solution ?

Trois niveaux de solution à dérouler : (1) préfixes maxLeft[]/maxRight[] en O(N) temps / O(N) espace, (2) deux pointeurs en O(N)/O(1), (3) variante pile monotone. Savoir naviguer entre les trois et justifier l'argument des deux pointeurs = le niveau attendu pour un « hard » chez Google.

## Solution Java

```java
class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int maxLeft = 0, maxRight = 0; // plus hauts murs vus de chaque cote
        int water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                // Le cote gauche est le plus bas : son eau ne depend que de maxLeft
                if (height[left] >= maxLeft) {
                    maxLeft = height[left];        // nouveau mur record : pas d'eau ici
                } else {
                    water += maxLeft - height[left]; // creux : l'eau monte jusqu'a maxLeft
                }
                left++;
            } else {
                // Symetrique cote droit
                if (height[right] >= maxRight) {
                    maxRight = height[right];
                } else {
                    water += maxRight - height[right];
                }
                right--;
            }
        }
        return water;
    }
}
```

## Complexité

Temps O(N) : chaque position traitée une fois. Espace O(1) : quatre variables — l'optimum absolu du problème.
