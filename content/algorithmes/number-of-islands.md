---
title: "Number of Islands"
description: "Une grille contient '1' (terre) et '0' (eau). Compte les îles : groupes de terres connectées horizontalement ou verticalement. LE problème d..."
category: "Algorithmes & Structures de données"
pattern: "Graphs"
difficulty: "Moyen"
number: 69
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "graphs"]
summary: "Une grille contient '1' (terre) et '0' (eau). Compte les îles : groupes de terres connectées horizontalement ou verticalement. LE problème de graphe le plus posé chez Amazon."
---

## C'est quoi le problème, en clair ?

Vous avez une carte en grille où chaque case est soit de la terre, soit de l'eau, et des terres côte à côte (pas en diagonale) forment une même île — le but est de compter combien d'îles il y a au total. C'est comme regarder une carte satellite en noir et blanc et entourer chaque groupe de terres connectées au feutre : dès qu'on tombe sur une nouvelle case de terre pas encore entourée, on sait qu'on a trouvé une nouvelle île, et on colorie tout le morceau connecté pour ne pas le recompter plus tard.

## L'idée clé

Parcourir la grille : chaque '1' pas encore visité est le début d'une NOUVELLE île → compteur +1, puis un DFS « coule » toute l'île (transforme ses '1' en '0') pour ne jamais la recompter. C'est le principe du [Flood Fill](/algorithmes/flood-fill/), appliqué en série avec un compteur.

## Pourquoi cette solution ?

Le marquage destructif ('1' → '0') évite tout tableau visited — à signaler à l'interviewer (« je modifie l'entrée, ok ? »). BFS avec ArrayDeque en alternative si la grille est immense (évite le débordement de pile de récursion) : bon réflexe système à mentionner.

## Solution Java

```java
class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;

        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;          // nouvelle ile decouverte
                    sink(grid, r, c); // la couler entierement
                }
            }
        }
        return count;
    }

    // DFS : transforme toute l'ile connectee en eau
    private void sink(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length
            || grid[r][c] != '1') {
            return;
        }
        grid[r][c] = '0'; // marquer comme visite
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
}
```

## Complexité

Temps O(N×M) : chaque case est visitée un nombre constant de fois. Espace O(N×M) au pire pour la pile de récursion (grille pleine de terre).
