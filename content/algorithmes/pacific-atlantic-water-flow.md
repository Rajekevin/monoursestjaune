---
title: "Pacific Atlantic Water Flow"
description: "Une grille d'altitudes est bordée par le Pacifique (haut/gauche) et l'Atlantique (bas/droite). L'eau coule vers une case d'altitude inférieu..."
category: "Algorithmes & Structures de données"
pattern: "Graphs"
difficulty: "Moyen"
number: 72
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "graphs"]
summary: "Une grille d'altitudes est bordée par le Pacifique (haut/gauche) et l'Atlantique (bas/droite). L'eau coule vers une case d'altitude inférieure ou égale. Trouve toutes les cases d'où l'eau peut atteindre LES DEUX océans."
---

## C'est quoi le problème, en clair ?

On vous donne une grille de terrain avec des altitudes, bordée par l'océan Pacifique d'un côté et l'Atlantique de l'autre ; l'eau de pluie coule toujours vers une case de même altitude ou plus basse. Il faut trouver toutes les cases d'où une goutte d'eau peut ruisseler jusqu'aux DEUX océans à la fois. Plutôt que de faire couler l'eau depuis chaque case une par une (ce qui serait très long), on part des bords des océans et on remonte le courant vers les sommets — comme si on remontait une rivière à contre-courant pour voir jusqu'où elle peut mener.

## L'idée clé

Renversement de perspective : au lieu de simuler l'écoulement depuis chaque case (O(N²M²)), on part DES océans et on REMONTE le courant (vers des altitudes ≥). Deux DFS : les cases atteignables depuis le Pacifique, celles depuis l'Atlantique. La réponse = l'intersection des deux ensembles.

## Pourquoi cette solution ?

Deux boolean[][] comme ensembles visités, DFS lancé depuis toutes les cases de bordure de chaque océan. Le pattern « inverser le sens du parcours pour passer de N sources à 1 » est un des déclics les plus élégants du niveau moyen — à raconter explicitement à l'interviewer.

## Solution Java

```java
class Solution {
    private int rows, cols;

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        rows = heights.length;
        cols = heights[0].length;
        boolean[][] pacific = new boolean[rows][cols];
        boolean[][] atlantic = new boolean[rows][cols];

        // Partir des bordures de chaque ocean et remonter le courant
        for (int r = 0; r < rows; r++) {
            dfs(heights, pacific, r, 0);            // bord gauche (Pacifique)
            dfs(heights, atlantic, r, cols - 1);    // bord droit (Atlantique)
        }
        for (int c = 0; c < cols; c++) {
            dfs(heights, pacific, 0, c);            // bord haut (Pacifique)
            dfs(heights, atlantic, rows - 1, c);    // bord bas (Atlantique)
        }

        // Intersection : atteignable depuis les DEUX oceans
        List<List<Integer>> result = new ArrayList<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (pacific[r][c] && atlantic[r][c]) {
                    result.add(List.of(r, c));
                }
            }
        }
        return result;
    }

    private void dfs(int[][] h, boolean[][] visited, int r, int c) {
        visited[r][c] = true;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            // On REMONTE : le voisin doit etre plus haut ou egal
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && !visited[nr][nc] && h[nr][nc] >= h[r][c]) {
                dfs(h, visited, nr, nc);
            }
        }
    }
}
```

## Complexité

Temps O(N×M) : chaque case est visitée au plus deux fois (une par océan). Espace O(N×M) pour les deux grilles visited.
