---
title: "Diameter of Binary Tree"
description: "Le diamètre d'un arbre est la longueur (en ARÊTES) du plus long chemin entre deux nœuds quelconques — ce chemin ne passe pas forcément par l..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Facile"
number: 32
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Le diamètre d'un arbre est la longueur (en ARÊTES) du plus long chemin entre deux nœuds quelconques — ce chemin ne passe pas forcément par la racine."
---

## C'est quoi le problème, en clair ?

Dans un arbre binaire (une structure où chaque élément a jusqu'à deux enfants), le « diamètre » est la distance la plus longue entre deux éléments quelconques, comptée en nombre de connexions traversées — ce trajet ne passe pas forcément par le sommet de l'arbre. On vous demande de calculer cette distance maximale. Imaginez un arbre généalogique dessiné à plat : le diamètre, c'est la distance entre les deux membres de la famille les plus « éloignés » l'un de l'autre en suivant les branches, même si ce chemin passe par un cousin plutôt que par l'ancêtre commun tout en haut.

## L'idée clé

Pour chaque nœud, le plus long chemin qui « plie » chez lui vaut hauteur(gauche) + hauteur(droite). Le diamètre global est le maximum de cette somme sur tous les nœuds. Un seul DFS calcule les hauteurs ET met à jour ce maximum au passage.

## Pourquoi cette solution ?

Pattern crucial : la fonction récursive RENVOIE une chose (la hauteur, nécessaire au parent) mais MET À JOUR une autre (le diamètre, dans un champ de classe). Cette dissociation retour/effet de bord est la clé de Binary Tree Maximum Path Sum ([Binary Tree Maximum Path Sum](/algorithmes/binary-tree-maximum-path-sum/)), sa version difficile.

## Solution Java

```java
class Solution {
    private int diameter = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        height(root);
        return diameter;
    }

    // Renvoie la hauteur du sous-arbre, met a jour le diametre en passant
    private int height(TreeNode node) {
        if (node == null) return 0;

        int left = height(node.left);
        int right = height(node.right);

        // Chemin le plus long passant par CE noeud : gauche + droite (en aretes)
        diameter = Math.max(diameter, left + right);

        // La hauteur remontee au parent : 1 + le plus haut des deux cotes
        return 1 + Math.max(left, right);
    }
}
```

## Complexité

Temps O(N) : un seul DFS. Espace O(H) de pile de récursion.
