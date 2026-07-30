---
title: "Rotting Oranges"
description: "Grille : 0 = vide, 1 = orange fraîche, 2 = orange pourrie. Chaque minute, toute fraîche adjacente à une pourrie pourrit. Combien de minutes ..."
category: "Algorithmes & Structures de données"
pattern: "Graphs"
difficulty: "Moyen"
number: 71
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "graphs"]
summary: "Grille : 0 = vide, 1 = orange fraîche, 2 = orange pourrie. Chaque minute, toute fraîche adjacente à une pourrie pourrit. Combien de minutes pour tout pourrir ? (-1 si impossible)."
---

## C'est quoi le problème, en clair ?

Vous avez une grille avec des cases vides, des oranges fraîches et des oranges pourries ; chaque minute, toute orange fraîche à côté d'une pourrie pourrit à son tour, et il faut trouver au bout de combien de minutes toutes les oranges seront pourries (ou dire que c'est impossible). Imaginez une épidémie qui se propage case par case, comme une rumeur qui se répand simultanément depuis plusieurs personnes en même temps : on fait avancer toutes les oranges pourries d'un cran à chaque minute, vague après vague, jusqu'à ce que plus rien ne bouge.

## L'idée clé

BFS MULTI-SOURCES : toutes les oranges pourries démarrent DANS la file en même temps (minute 0), et le BFS se propage en vagues — chaque « niveau » de BFS = une minute. C'est le BFS par niveaux du [Binary Tree Level Order Traversal](/algorithmes/binary-tree-level-order-traversal/), transposé sur une grille avec plusieurs points de départ.

## Pourquoi cette solution ?

ArrayDeque de coordonnées int[]{r, c} + un compteur d'oranges fraîches : s'il reste des fraîches après le BFS, renvoyer -1. Le BFS (et jamais le DFS !) est l'outil des problèmes de « propagation simultanée » et de plus court chemin non pondéré.

## Solution Java

```java
class Solution {
    public int orangesRotting(int[][] grid) {
        Deque<int[]> queue = new ArrayDeque<>();
        int fresh = 0;

        // Etat initial : toutes les pourries en file, compter les fraiches
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 2) queue.offer(new int[]{r, c});
                else if (grid[r][c] == 1) fresh++;
            }
        }
        if (fresh == 0) return 0; // rien a pourrir

        int minutes = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};

        while (!queue.isEmpty() && fresh > 0) {
            int levelSize = queue.size(); // toutes les oranges de CETTE minute
            for (int i = 0; i < levelSize; i++) {
                int[] cell = queue.poll();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length
                        && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2; // pourrit : marque + n'y repassera pas
                        fresh--;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }
            minutes++; // une vague = une minute
        }
        return fresh == 0 ? minutes : -1; // fraiches inaccessibles ?
    }
}
```

## Complexité

Temps O(N×M) : chaque case entre au plus une fois dans la file. Espace O(N×M) pour la file au pire.
