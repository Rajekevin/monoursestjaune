---
title: "Subtree of Another Tree"
description: "L'arbre subRoot apparaît-il quelque part comme sous-arbre COMPLET de l'arbre root (même structure, mêmes valeurs, jusqu'aux feuilles) ?"
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Facile"
number: 31
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "L'arbre subRoot apparaît-il quelque part comme sous-arbre COMPLET de l'arbre root (même structure, mêmes valeurs, jusqu'aux feuilles) ?"
---

## C'est quoi le problème, en clair ?

On vous donne deux arbres (une structure où chaque case a des cases enfants, comme une généalogie) et vous devez vérifier si le petit arbre apparaît quelque part, à l'identique, comme un morceau complet du grand arbre. C'est comme comparer une photo découpée d'une branche avec un grand arbre réel : il faut poser la photo sur chaque branche possible du grand arbre et vérifier si elle correspond exactement, feuille par feuille, pas seulement à sa racine. Dès qu'une branche colle parfaitement, on a trouvé la réponse.

## L'idée clé

Deux niveaux de récursion : (1) parcourir root et, à CHAQUE nœud, (2) tester si l'arbre qui commence ici est identique à subRoot — en réutilisant exactement [Same Tree](/algorithmes/same-tree/). Composer deux problèmes déjà résolus : le réflexe d'ingénieur que l'entretien valorise.

## Pourquoi cette solution ?

isSameTree est copiée telle quelle : la modularité montre que tu reconnais les sous-problèmes. Complexité honnête à annoncer : O(N×M) au pire — mentionner l'existence d'optimisations (sérialisation + recherche de sous-chaîne) est un bonus.

## Solution Java

```java
class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (root == null) return false; // plus rien a explorer

        // L'arbre ancre ici est-il exactement subRoot ?
        if (isSameTree(root, subRoot)) return true;

        // Sinon, chercher plus bas, a gauche ou a droite
        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }

    private boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null || p.val != q.val) return false;
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
```

## Complexité

Temps O(N×M) au pire : pour chacun des N nœuds de root, une comparaison pouvant coûter O(M). Espace O(H) de récursion.
