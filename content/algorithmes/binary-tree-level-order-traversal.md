---
title: "Binary Tree Level Order Traversal"
description: "Renvoie les valeurs d'un arbre binaire niveau par niveau, de haut en bas, chaque niveau dans sa propre liste. Ex : [3,9,20,null,null,15,7] →..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Moyen"
number: 58
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Renvoie les valeurs d'un arbre binaire niveau par niveau, de haut en bas, chaque niveau dans sa propre liste. Ex : [3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]."
---

## C'est quoi le problème, en clair ?

On vous donne un arbre binaire (une structure où chaque élément a jusqu'à deux enfants), et vous devez lister ses valeurs étage par étage, de haut en bas. C'est comme prendre une photo de classe organisée par rangées : d'abord tous les élèves du premier rang, puis ceux du deuxième, etc., sans mélanger les rangées entre elles. La difficulté technique est de savoir précisément où s'arrête un étage pour commencer proprement le suivant.

## L'idée clé

BFS avec une file : le secret pour séparer les niveaux est de capturer la TAILLE de la file au début de chaque tour — c'est exactement le nombre de nœuds du niveau courant. On les défile tous en enfilant leurs enfants, qui formeront le niveau suivant.

## Pourquoi cette solution ?

ArrayDeque comme file (offer/poll). Ce squelette « BFS par niveaux » est réutilisé tel quel dans Right Side View, Zigzag Traversal, Rotting Oranges ([Rotting Oranges](/algorithmes/rotting-oranges/)), Word Ladder ([Word Ladder](/algorithmes/word-ladder/))... L'apprendre une fois = résoudre dix problèmes.

## Solution Java

```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Deque<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int levelSize = queue.size(); // fige : nb de noeuds de CE niveau
            List<Integer> level = new ArrayList<>();

            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}
```

## Complexité

Temps O(N) : chaque nœud est enfilé/défilé une fois. Espace O(N) : la file peut contenir tout le dernier niveau (~N/2 nœuds).
