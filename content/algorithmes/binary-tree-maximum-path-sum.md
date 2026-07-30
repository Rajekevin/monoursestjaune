---
title: "Binary Tree Maximum Path Sum"
description: "Trouve la somme maximale d'un CHEMIN dans un arbre binaire (suite de nœuds connectés, chaque nœud au plus une fois, pas besoin de passer par..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Difficile"
number: 88
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Trouve la somme maximale d'un CHEMIN dans un arbre binaire (suite de nœuds connectés, chaque nœud au plus une fois, pas besoin de passer par la racine, valeurs possiblement négatives)."
---

## C'est quoi le problème, en clair ?

Dans un arbre binaire (une structure où chaque élément a jusqu'à deux enfants), un « chemin » est une suite d'éléments voisins reliés entre eux, qui peut zigzaguer n'importe où dans l'arbre — pas forcément en partant du sommet. On vous demande de trouver le chemin dont la somme des valeurs est la plus grande possible, sachant que certaines valeurs peuvent être négatives. Imaginez une carte au trésor où chaque case rapporte ou coûte des points : vous devez tracer le meilleur trajet possible entre deux cases quelconques, en évitant les détours qui vous feraient perdre plus qu'ils ne rapportent.

## L'idée clé

C'est Diameter ([Diameter of Binary Tree](/algorithmes/diameter-of-binary-tree/)) version sommes : en chaque nœud, le meilleur chemin qui « plie » ici vaut node.val + gain(gauche) + gain(droite). Mais ce qu'on REMONTE au parent est différent : node.val + max(gain gauche, gain droite) — un chemin qui continue ne peut prendre qu'UNE branche. Les gains négatifs se coupent à 0.

## Pourquoi cette solution ?

Le Math.max(gain, 0) est l'idée décisive : une branche qui rapporte négatif est simplement ignorée. Dissociation retour/effet de bord (champ maxSum) comme dans [Diameter of Binary Tree](/algorithmes/diameter-of-binary-tree/). Ce problème est un favori de Meta car il teste EXACTEMENT la compréhension fine de « ce que la récursion renvoie vs ce qu'elle enregistre ».

## Solution Java

```java
class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        maxGain(root);
        return maxSum;
    }

    // Renvoie le meilleur gain d'un chemin qui PART de node et descend d'un seul cote
    private int maxGain(TreeNode node) {
        if (node == null) return 0;

        // Gains des branches ; une branche negative est ignoree (max avec 0)
        int leftGain = Math.max(maxGain(node.left), 0);
        int rightGain = Math.max(maxGain(node.right), 0);

        // Meilleur chemin qui PLIE ici : les deux branches + le noeud
        maxSum = Math.max(maxSum, node.val + leftGain + rightGain);

        // Ce qu'on remonte au parent : le noeud + UNE seule branche
        return node.val + Math.max(leftGain, rightGain);
    }
}
```

## Complexité

Temps O(N) : un seul DFS. Espace O(H) de récursion.
