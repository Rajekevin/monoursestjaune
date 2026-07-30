---
title: "Word Search"
description: "Un mot existe-t-il dans une grille de lettres, en enchaînant des cases ADJACENTES (haut/bas/gauche/droite), sans réutiliser une case ?"
category: "Algorithmes & Structures de données"
pattern: "Backtracking"
difficulty: "Moyen"
number: 68
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "backtracking"]
summary: "Un mot existe-t-il dans une grille de lettres, en enchaînant des cases ADJACENTES (haut/bas/gauche/droite), sans réutiliser une case ?"
---

## C'est quoi le problème, en clair ?

On vous donne une grille de lettres et un mot, et vous devez dire si ce mot peut être formé en reliant des lettres voisines (haut, bas, gauche, droite), sans jamais réutiliser deux fois la même case. C'est exactement le principe des mots mêlés dans un magazine : on part d'une lettre qui correspond au début du mot, puis on trace un chemin serpentant de case en case vers les lettres suivantes, en faisant attention à ne jamais repasser par une case déjà utilisée dans ce même chemin. Si un chemin essayé ne mène nulle part, on revient en arrière pour tenter une autre direction.

## L'idée clé

DFS + backtracking sur la grille : depuis chaque case qui matche la première lettre, on explore les 4 directions pour la lettre suivante. Pour interdire la réutilisation, on marque la case AVANT de descendre puis on la RESTAURE en remontant — le backtracking spatial.

## Pourquoi cette solution ?

Astuce zéro-mémoire : marquer en écrasant board[r][c] = '#' puis restaurer, au lieu d'un tableau visited[][] séparé. La restauration est OBLIGATOIRE : sans elle, un chemin raté « brûle » des cases pour les chemins suivants — le bug n°1 de ce problème.

## Solution Java

```java
class Solution {
    public boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int r, int c, int i) {
        if (i == word.length()) return true; // toutes les lettres trouvees

        // Hors grille, case deja utilisee ('#') ou mauvaise lettre
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length
            || board[r][c] != word.charAt(i)) {
            return false;
        }

        char saved = board[r][c];
        board[r][c] = '#'; // marquer : interdit de repasser ici

        boolean found = dfs(board, word, r + 1, c, i + 1)
                     || dfs(board, word, r - 1, c, i + 1)
                     || dfs(board, word, r, c + 1, i + 1)
                     || dfs(board, word, r, c - 1, i + 1);

        board[r][c] = saved; // RESTAURER en remontant (backtrack)
        return found;
    }
}
```

## Complexité

Temps O(N×M × 3^L) : chaque case de départ lance une exploration à 3 directions utiles sur L lettres. Espace O(L) de récursion.
