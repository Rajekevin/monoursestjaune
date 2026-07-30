---
title: "Kth Smallest Element in a BST"
description: "Renvoie le K-ième plus petit élément d'un arbre binaire de recherche (K commence à 1)."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Moyen"
number: 60
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Renvoie le K-ième plus petit élément d'un arbre binaire de recherche (K commence à 1)."
---

## C'est quoi le problème, en clair ?

Un arbre binaire de recherche (BST) range ses valeurs selon une règle précise : pour chaque nœud, tout ce qui est à gauche est plus petit, tout ce qui est à droite est plus grand — comme un annuaire déjà bien organisé. Vous devez trouver la K-ième plus petite valeur de cet arbre, c'est-à-dire ce qu'on obtiendrait en listant toutes les valeurs de la plus petite à la plus grande et en prenant la K-ième de cette liste. La bonne nouvelle : si on visite l'arbre « gauche, puis nœud, puis droite » à chaque étape, les valeurs sortent naturellement dans l'ordre croissant, comme lire un annuaire page après page sans avoir besoin de le retrier.

## L'idée clé

Propriété d'or du BST : un parcours IN-ORDER (gauche → nœud → droite) visite les valeurs en ordre CROISSANT. Le K-ième plus petit est donc simplement le K-ième nœud visité. Version itérative avec une pile : on peut s'arrêter net au K-ième, sans parcourir le reste.

## Pourquoi cette solution ?

La pile explicite (ArrayDeque) remplace la récursion et permet l'arrêt anticipé — impossible proprement en récursif sans exception ou compteur global. Le squelette « in-order itératif » (descendre tout à gauche, dépiler, aller à droite) est un classique à mémoriser tel quel.

## Solution Java

```java
class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode node = root;

        while (node != null || !stack.isEmpty()) {
            // 1. Descendre tout a gauche en empilant
            while (node != null) {
                stack.push(node);
                node = node.left;
            }

            // 2. Depiler : c'est la prochaine plus petite valeur
            node = stack.pop();
            if (--k == 0) return node.val; // k-ieme visite : trouve !

            // 3. Passer au sous-arbre droit
            node = node.right;
        }
        return -1; // k invalide
    }
}
```

## Complexité

Temps O(H + K) : descente initiale puis K étapes. Espace O(H) pour la pile.
