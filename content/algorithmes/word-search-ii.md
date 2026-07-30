---
title: "Word Search II"
description: "Trouve TOUS les mots d'une liste présents dans une grille de lettres (règles du Word Search). Lancer Word Search une fois par mot serait beaucoup tr..."
category: "Algorithmes & Structures de données"
pattern: "Backtracking"
difficulty: "Difficile"
number: 92
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "backtracking"]
summary: "Trouve TOUS les mots d'une liste présents dans une grille de lettres (règles du Word Search). Lancer Word Search une fois par mot serait beaucoup trop lent : il faut chercher tous les mots EN MÊME TEMPS."
---

## C'est quoi le problème, en clair ?

On vous donne une grille de lettres et une LISTE de mots à rechercher, en reliant des lettres voisines sans réutiliser une case — et il faut trouver tous les mots présents, sans relancer une recherche complète pour chaque mot un par un (ce serait beaucoup trop lent). L'astuce est de fusionner tous les mots de la liste en une seule structure en forme d'arbre où les débuts communs sont partagés (un « trie », un peu comme un annuaire où toutes les entrées commençant par « MA » partagent la même branche), puis d'explorer la grille une seule fois en suivant cette structure : dès qu'un chemin ne correspond plus au début d'aucun mot, on l'abandonne immédiatement.

## L'idée clé

Fusionner tous les mots dans un TRIE ([Implement Trie (Prefix Tree)](/algorithmes/implement-trie-prefix-tree/)), puis UN SEUL DFS sur la grille qui descend dans le trie en parallèle du chemin : si la lettre courante n'a pas d'enfant dans le trie, toute la branche est coupée immédiatement. Chaque nœud terminal croisé = un mot trouvé.

## Pourquoi cette solution ?

Le combo Trie + backtracking est la raison d'être de ce problème. Deux finitions de pro : stocker le mot COMPLET dans le nœud terminal (évite de reconstruire le chemin) et le remettre à null une fois trouvé (déduplication + élagage progressif du trie). Un des hards les plus posés chez Amazon et Uber.

## Solution Java

```java
class Solution {
    private class TrieNode {
        TrieNode[] children = new TrieNode[26];
        String word = null; // mot complet stocke au noeud terminal
    }

    public List<String> findWords(char[][] board, String[] words) {
        // 1. Construire le trie de tous les mots
        TrieNode root = new TrieNode();
        for (String w : words) {
            TrieNode node = root;
            for (char c : w.toCharArray()) {
                int i = c - 'a';
                if (node.children[i] == null) node.children[i] = new TrieNode();
                node = node.children[i];
            }
            node.word = w;
        }

        // 2. Un seul DFS par case, guide par le trie
        List<String> result = new ArrayList<>();
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                dfs(board, r, c, root, result);
            }
        }
        return result;
    }

    private void dfs(char[][] board, int r, int c, TrieNode node, List<String> result) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;

        char ch = board[r][c];
        if (ch == '#' || node.children[ch - 'a'] == null) return; // branche morte

        node = node.children[ch - 'a'];
        if (node.word != null) {
            result.add(node.word); // mot trouve
            node.word = null;      // deduplication : ne plus le signaler
        }

        board[r][c] = '#'; // marquer la case
        dfs(board, r + 1, c, node, result);
        dfs(board, r - 1, c, node, result);
        dfs(board, r, c + 1, node, result);
        dfs(board, r, c - 1, node, result);
        board[r][c] = ch;  // restaurer (backtrack)
    }
}
```

## Complexité

Temps O(N×M × 3^L) au pire (L = mot le plus long), mais le trie élague massivement en pratique. Espace O(total des caractères) pour le trie + O(L) de récursion.
