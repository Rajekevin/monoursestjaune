---
title: "Construct Binary Tree from Preorder and Inorder"
description: "Reconstruis l'arbre binaire unique à partir de ses parcours preorder et inorder (valeurs distinctes). Ex : preorder=[3,9,20,15,7], inorder=[..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Moyen"
number: 61
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Reconstruis l'arbre binaire unique à partir de ses parcours preorder et inorder (valeurs distinctes). Ex : preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]."
---

## C'est quoi le problème, en clair ?

On vous donne deux façons différentes de parcourir un même arbre binaire (le « préordre » et l'« inordre », deux ordres de lecture classiques des nœuds d'un arbre), et vous devez reconstruire l'arbre original à partir de ces deux listes de valeurs. C'est un peu comme reconstituer un arbre généalogique à partir de deux listes de noms lues dans des ordres de visite différents : chaque liste ne donne qu'une information partielle, mais ensemble, elles suffisent à retrouver la structure exacte, sans aucune ambiguïté.

## L'idée clé

Le PREMIER élément du preorder est toujours la RACINE. Sa position dans l'inorder coupe ce dernier en deux : tout ce qui est à gauche = sous-arbre gauche, à droite = sous-arbre droit. On recurse sur chaque moitié — le preorder se consomme dans l'ordre via un simple index global.

## Pourquoi cette solution ?

Une HashMap<valeur, indice inorder> précalculée rend la localisation de la racine O(1) (au lieu de O(N) par recherche linéaire → O(N²) total). L'index preorder partagé (champ de classe) évite de découper des tableaux : on ne passe que des BORNES d'inorder.

## Solution Java

```java
class Solution {
    private int preIndex = 0;                       // curseur dans preorder
    private Map<Integer, Integer> inPos = new HashMap<>(); // valeur -> indice inorder

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        for (int i = 0; i < inorder.length; i++) {
            inPos.put(inorder[i], i);
        }
        return build(preorder, 0, inorder.length - 1);
    }

    // Construit le sous-arbre couvrant inorder[inLeft..inRight]
    private TreeNode build(int[] preorder, int inLeft, int inRight) {
        if (inLeft > inRight) return null; // segment vide

        int rootVal = preorder[preIndex++];   // prochaine racine dans preorder
        TreeNode root = new TreeNode(rootVal);

        int mid = inPos.get(rootVal);         // coupe l'inorder en deux

        // IMPORTANT : gauche d'abord (l'ordre du preorder l'impose)
        root.left = build(preorder, inLeft, mid - 1);
        root.right = build(preorder, mid + 1, inRight);

        return root;
    }
}
```

## Complexité

Temps O(N) : chaque nœud construit une fois, localisation O(1) via la map. Espace O(N) : la map + O(H) de récursion.
