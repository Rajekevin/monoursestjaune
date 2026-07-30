---
title: "Same Tree"
description: "Deux arbres binaires sont-ils identiques : même structure ET mêmes valeurs à chaque position ?"
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Facile"
number: 29
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Deux arbres binaires sont-ils identiques : même structure ET mêmes valeurs à chaque position ?"
---

## C'est quoi le problème, en clair ?

On vous donne deux arbres binaires (une structure où chaque élément peut avoir jusqu'à deux « enfants », voir [le glossaire](/glossaire-algorithmes/)) et il faut vérifier s'ils sont parfaitement identiques : même forme et mêmes valeurs à chaque position. C'est comme comparer deux arbres généalogiques dessinés sur deux feuilles différentes : on vérifie d'abord que la personne tout en haut est la même sur les deux, puis on descend récursivement comparer chaque branche gauche entre elles, et chaque branche droite entre elles.

## L'idée clé

Décomposition récursive : deux arbres sont identiques si leurs racines ont la même valeur, ET leurs sous-arbres gauches sont identiques, ET leurs sous-arbres droits aussi. Trois cas de base : deux null (vrai), un seul null (faux), valeurs différentes (faux).

## Pourquoi cette solution ?

La récursion à DEUX arbres en parallèle est un mini-pattern qui resurgit dans [Symmetric Tree](/algorithmes/symmetric-tree/) et [Subtree of Another Tree](/algorithmes/subtree-of-another-tree/). L'ordre des vérifications (null d'abord) évite les NullPointerException — l'interviewer y sera attentif.

## Solution Java

```java
class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        // Les deux vides : identiques
        if (p == null && q == null) return true;

        // Un seul vide, ou valeurs differentes : non identiques
        if (p == null || q == null || p.val != q.val) return false;

        // Meme valeur ici : verifier les deux paires de sous-arbres
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
```

## Complexité

Temps O(N) : chaque paire de nœuds est comparée une fois. Espace O(H) de pile de récursion.
