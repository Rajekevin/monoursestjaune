---
title: "N-Queens"
description: "Place N reines sur un échiquier N×N sans qu'aucune n'en menace une autre (ligne, colonne, diagonales). Renvoie TOUTES les configurations val..."
category: "Algorithmes & Structures de données"
pattern: "Backtracking"
difficulty: "Difficile"
number: 93
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "backtracking"]
summary: "Place N reines sur un échiquier N×N sans qu'aucune n'en menace une autre (ligne, colonne, diagonales). Renvoie TOUTES les configurations valides. Le grand classique historique du backtracking."
---

## C'est quoi le problème, en clair ?

Il faut placer N reines du jeu d'échecs sur un échiquier de N cases sur N, sans qu'aucune reine ne puisse en menacer une autre (rappel : une reine attaque toute sa ligne, sa colonne et ses diagonales) — et il faut trouver TOUTES les façons d'y arriver. Imaginez que vous placez les reines une par une, ligne après ligne : à chaque ligne vous essayez une colonne, et si elle est menacée par une reine déjà posée, vous l'annulez et essayez la colonne suivante — un peu comme résoudre un sudoku par tâtonnement, en revenant en arrière dès qu'on se trompe (cette technique d'essai-erreur-annulation s'appelle le « backtracking », voir [le glossaire](/glossaire-algorithmes/)).

## L'idée clé

Une reine par ligne, forcément : on place ligne par ligne, en essayant chaque colonne. La détection de conflit en O(1) : trois HashSet — colonnes occupées, diagonales ↘ (identifiées par row - col, constant le long d'une diagonale) et diagonales ↙ (row + col). Placer, descendre, retirer : le trio du backtracking.

## Pourquoi cette solution ?

Les identifiants de diagonales (r-c et r+c) sont LA connaissance clé — sans eux, vérifier une diagonale coûte O(N). Le plateau char[][] rempli de '.' n'est mis à jour que pour la construction du résultat. Trois sets + une récursion : élégance maximale pour un problème réputé effrayant.

## Solution Java

```java
class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');

        backtrack(board, 0, new HashSet<>(), new HashSet<>(), new HashSet<>(), result);
        return result;
    }

    private void backtrack(char[][] board, int row, Set<Integer> cols,
                           Set<Integer> diag1, Set<Integer> diag2,
                           List<List<String>> result) {
        int n = board.length;
        if (row == n) {
            // Toutes les reines placees : capturer la configuration
            List<String> config = new ArrayList<>();
            for (char[] r : board) config.add(new String(r));
            result.add(config);
            return;
        }

        for (int col = 0; col < n; col++) {
            // Conflit de colonne ou de diagonale ? (tests O(1))
            if (cols.contains(col) || diag1.contains(row - col)
                || diag2.contains(row + col)) {
                continue;
            }

            // 1. Placer la reine
            cols.add(col); diag1.add(row - col); diag2.add(row + col);
            board[row][col] = 'Q';

            backtrack(board, row + 1, cols, diag1, diag2, result); // 2. ligne suivante

            // 3. Retirer la reine (backtrack)
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col);
            board[row][col] = '.';
        }
    }
}
```

## Complexité

Temps O(N!) : N choix en ligne 0, au plus N-1 en ligne 1, etc. Espace O(N) pour les sets et la récursion (hors résultat).
