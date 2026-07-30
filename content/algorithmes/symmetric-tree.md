---
title: "Symmetric Tree"
description: "Un arbre binaire est-il symétrique, c'est-à-dire son propre miroir autour de son axe central ?"
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Facile"
number: 30
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Un arbre binaire est-il symétrique, c'est-à-dire son propre miroir autour de son axe central ?"
---

## C'est quoi le problème, en clair ?

On vous donne un arbre binaire et vous devez dire s'il est symétrique, c'est-à-dire si sa moitié gauche est exactement le reflet miroir de sa moitié droite, comme une tache d'encre de Rorschach ou les ailes d'un papillon. Il ne suffit pas que les deux côtés se ressemblent vaguement : il faut que la case tout à gauche corresponde à la case tout à droite, celle en bas à gauche à celle en bas à droite, et ainsi de suite, comme si on pliait l'arbre en deux au milieu et que tout devait se superposer parfaitement.

## L'idée clé

Un arbre est symétrique si son sous-arbre gauche est le MIROIR de son sous-arbre droit. Miroir signifie : mêmes valeurs de racines, et le gauche de l'un correspond au DROIT de l'autre (les appels récursifs sont croisés — c'est tout le sel du problème).

## Pourquoi cette solution ?

Fonction auxiliaire isMirror(a, b) à deux arguments, structurée comme [Same Tree](/algorithmes/same-tree/) mais avec les appels croisés : isMirror(a.left, b.right) et isMirror(a.right, b.left). Un seul détail change, tout le comportement change — belle question de compréhension.

## Solution Java

```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) return true;
        return isMirror(root.left, root.right);
    }

    private boolean isMirror(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;   // deux vides : miroir ok
        if (a == null || b == null) return false;  // un seul vide : rate
        if (a.val != b.val) return false;          // valeurs differentes : rate

        // Appels CROISES : gauche de a contre droite de b, et inversement
        return isMirror(a.left, b.right) && isMirror(a.right, b.left);
    }
}
```

## Complexité

Temps O(N) : chaque nœud est visité une fois. Espace O(H) de récursion.
