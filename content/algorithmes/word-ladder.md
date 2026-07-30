---
title: "Word Ladder"
description: "Transforme beginWord en endWord en changeant UNE lettre à la fois, chaque mot intermédiaire devant appartenir au dictionnaire. Renvoie la lo..."
category: "Algorithmes & Structures de données"
pattern: "Graphs"
difficulty: "Difficile"
number: 90
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "graphs"]
summary: "Transforme beginWord en endWord en changeant UNE lettre à la fois, chaque mot intermédiaire devant appartenir au dictionnaire. Renvoie la longueur de la plus courte chaîne de transformation (0 si impossible)."
---

## C'est quoi le problème, en clair ?

On part d'un mot de départ et on veut atteindre un mot d'arrivée en changeant une seule lettre à chaque étape, chaque mot intermédiaire devant exister dans un dictionnaire — et on veut le chemin le PLUS COURT possible. C'est le jeu du « mot en mot » (par exemple CHAT → CHAR → CHAI...) où chaque mot valide est une case, et deux mots reliés par une seule lettre de différence sont voisins. Trouver le chemin le plus court entre deux cases sans savoir à l'avance où elles se trouvent, c'est comme chercher le nombre minimum d'intermédiaires pour relier deux personnes dans un réseau de connaissances : on explore niveau par niveau, en s'éloignant petit à petit du point de départ, plutôt que d'explorer une seule piste à fond.

## L'idée clé

Graphe implicite : les mots sont des nœuds, une arête relie deux mots à une lettre d'écart. « Plus courte transformation » = plus court chemin non pondéré = BFS. Pour générer les voisins sans comparer tous les mots (O(N²)), on essaie les 26 lettres à chaque position et on teste l'existence dans un HashSet.

## Pourquoi cette solution ?

HashSet du dictionnaire pour le lookup O(1) + suppression des mots visités DU set (double emploi : marquage visité + rétrécissement de l'espace). char[] + new String(chars) pour muter un mot. Le BFS bidirectionnel (depuis les deux bouts) divise l'espace exploré — LA optimisation à citer pour finir fort.

## Solution Java

```java
class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(endWord)) return 0;

        Deque<String> queue = new ArrayDeque<>();
        queue.offer(beginWord);
        int steps = 1; // beginWord compte pour 1

        while (!queue.isEmpty()) {
            int levelSize = queue.size(); // BFS par niveaux
            for (int i = 0; i < levelSize; i++) {
                String word = queue.poll();
                if (word.equals(endWord)) return steps;

                // Generer tous les voisins : 26 lettres a chaque position
                char[] chars = word.toCharArray();
                for (int pos = 0; pos < chars.length; pos++) {
                    char original = chars[pos];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) continue;
                        chars[pos] = c;
                        String next = new String(chars);
                        if (dict.contains(next)) {
                            queue.offer(next);
                            dict.remove(next); // visite : ne jamais y revenir
                        }
                    }
                    chars[pos] = original; // restaurer la position
                }
            }
            steps++;
        }
        return 0; // endWord inaccessible
    }
}
```

## Complexité

Temps O(N × L × 26) : chaque mot génère 26L voisins, chacun haché en O(L). Espace O(N × L) pour le set et la file.
