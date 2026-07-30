---
title: "Flood Fill"
description: "Une image est une grille d'entiers (couleurs). À partir du pixel (sr, sc), applique le « pot de peinture » : remplace sa couleur et celle de..."
category: "Algorithmes & Structures de données"
pattern: "Graphs"
difficulty: "Facile"
number: 9
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "graphs"]
summary: "Une image est une grille d'entiers (couleurs). À partir du pixel (sr, sc), applique le « pot de peinture » : remplace sa couleur et celle de tous ses voisins connectés (haut/bas/gauche/droite) de la même couleur d'origine par une nouvelle couleur."
---

## C'est quoi le problème, en clair ?

Vous cliquez sur un pixel d'une image avec l'outil « pot de peinture » d'un logiciel de dessin, et toute la zone connectée de la même couleur autour de ce pixel doit se remplir avec la nouvelle couleur — exactement comme dans Paint ou Photoshop. Le problème consiste à écrire cette fonction : partir d'un point, regarder ses voisins immédiats (haut, bas, gauche, droite), et continuer à repeindre tant qu'on reste sur la couleur d'origine. C'est une tache d'encre qui se propage de proche en proche et s'arrête net dès qu'elle rencontre une couleur différente.

## L'idée clé

C'est un parcours de graphe déguisé : chaque pixel est un nœud, chaque voisin de même couleur est une arête. Un DFS récursif suffit : peindre le pixel, puis se propager dans les 4 directions tant que la couleur d'origine est là. Le pixel repeint sert lui-même de marqueur « visité ».

## Pourquoi cette solution ?

DFS récursif = 10 lignes. Garde-fou indispensable : si la nouvelle couleur est égale à l'ancienne, on retourne immédiatement, sinon la récursion tourne en boucle infinie. Ce mini-problème est l'échauffement idéal avant [Number of Islands](/algorithmes/number-of-islands/).

## Solution Java

```java
class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int oldColor = image[sr][sc];
        // Piege : si la couleur ne change pas, ne rien faire (sinon boucle infinie)
        if (oldColor != color) {
            dfs(image, sr, sc, oldColor, color);
        }
        return image;
    }

    private void dfs(int[][] img, int r, int c, int oldColor, int newColor) {
        // Stop si on sort de la grille ou si la couleur ne correspond pas
        if (r < 0 || r >= img.length || c < 0 || c >= img[0].length
            || img[r][c] != oldColor) {
            return;
        }
        img[r][c] = newColor;   // peindre = marquer comme visite
        dfs(img, r + 1, c, oldColor, newColor); // bas
        dfs(img, r - 1, c, oldColor, newColor); // haut
        dfs(img, r, c + 1, oldColor, newColor); // droite
        dfs(img, r, c - 1, oldColor, newColor); // gauche
    }
}
```

## Complexité

Temps O(N×M) : chaque pixel est visité au plus une fois. Espace O(N×M) au pire pour la pile de récursion (image entièrement de la même couleur).
