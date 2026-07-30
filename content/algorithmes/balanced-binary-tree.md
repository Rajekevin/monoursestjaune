---
title: "Balanced Binary Tree"
description: "Un arbre est « équilibré en hauteur » si, pour CHAQUE nœud, les hauteurs de ses deux sous-arbres diffèrent d'au plus 1. Vérifie cette propri..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Facile"
number: 33
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Un arbre est « équilibré en hauteur » si, pour CHAQUE nœud, les hauteurs de ses deux sous-arbres diffèrent d'au plus 1. Vérifie cette propriété."
---

## C'est quoi le problème, en clair ?

Un arbre binaire est une structure où chaque élément (un « nœud ») peut avoir jusqu'à deux enfants, un à gauche et un à droite. On dit qu'il est « équilibré » si, à chaque étage de l'arbre, les deux côtés ne sont jamais très inégaux en hauteur — comme une balance qui ne penche jamais trop d'un côté. Le but ici est simplement de vérifier que cette règle est respectée partout dans l'arbre, pas seulement en regardant le sommet.

## L'idée clé

Version naïve : pour chaque nœud, recalculer les hauteurs → O(N²). L'astuce : un seul DFS ascendant qui renvoie la hauteur, mais renvoie -1 comme signal « déséquilibré ». Dès qu'un sous-arbre renvoie -1, on propage -1 immédiatement jusqu'en haut sans rien recalculer.

## Pourquoi cette solution ?

Utiliser la valeur de retour comme canal double (hauteur OU code d'erreur -1) évite un objet wrapper ou un champ de classe : c'est idiomatique et rapide. Le court-circuit « si gauche == -1, remonter tout de suite » garantit le O(N).

## Solution Java

```java
class Solution {
    public boolean isBalanced(TreeNode root) {
        return checkHeight(root) != -1;
    }

    // Renvoie la hauteur du sous-arbre, ou -1 si desequilibre detecte
    private int checkHeight(TreeNode node) {
        if (node == null) return 0;

        int left = checkHeight(node.left);
        if (left == -1) return -1;               // propager l'echec sans recalcul

        int right = checkHeight(node.right);
        if (right == -1) return -1;

        if (Math.abs(left - right) > 1) return -1; // desequilibre ICI

        return 1 + Math.max(left, right);          // hauteur normale
    }
}
```

## Complexité

Temps O(N) : chaque nœud calculé une seule fois grâce au signal -1. Espace O(H) de récursion.
