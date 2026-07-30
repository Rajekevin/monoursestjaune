---
title: "Lowest Common Ancestor of a BST"
description: "Dans un arbre binaire de RECHERCHE (BST), trouve le plus petit ancêtre commun (LCA) de deux nœuds p et q : le nœud le plus profond qui a p e..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Facile"
number: 34
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Dans un arbre binaire de RECHERCHE (BST), trouve le plus petit ancêtre commun (LCA) de deux nœuds p et q : le nœud le plus profond qui a p et q dans sa descendance (un nœud est son propre ancêtre)."
---

## C'est quoi le problème, en clair ?

On vous donne un arbre binaire de recherche (BST) — une structure en forme d'arbre où, à chaque étage, tout ce qui est à gauche d'un nœud est plus petit que lui et tout ce qui est à droite est plus grand — ainsi que deux de ses nœuds, p et q. Vous devez trouver leur plus proche ancêtre commun : le nœud le plus profond de l'arbre qui compte à la fois p et q parmi ses descendants (un nœud est considéré comme son propre ancêtre). Pensez à un arbre généalogique : le plus proche ancêtre commun de deux cousins, c'est le grand-parent qu'ils partagent, pas un arrière-arrière-grand-parent plus lointain qu'ils ont aussi en commun mais qui est « trop haut » dans l'arbre. Ici, la particularité du BST — les valeurs sont rangées — permet de retrouver ce point de séparation sans avoir à explorer tout l'arbre.

## L'idée clé

Exploiter la propriété du BST : gauche < racine < droite. Si p et q sont tous deux plus petits que le nœud courant, le LCA est à gauche ; tous deux plus grands, à droite. Sinon, p et q se « séparent » ici (ou l'un des deux EST le nœud) → c'est le LCA. Pas besoin d'explorer les deux côtés !

## Pourquoi cette solution ?

La version itérative (une simple boucle qui descend) tient en 8 lignes et coûte O(1) d'espace — mieux que la récursion. Attention : ceci ne marche QUE pour un BST ; la version arbre binaire quelconque exige un vrai DFS (à mentionner en entretien).

## Solution Java

```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode node = root;

        while (node != null) {
            if (p.val < node.val && q.val < node.val) {
                node = node.left;        // les deux sont a gauche : descendre a gauche
            } else if (p.val > node.val && q.val > node.val) {
                node = node.right;       // les deux sont a droite : descendre a droite
            } else {
                return node;             // separation (ou egalite) : c'est le LCA
            }
        }
        return null;
    }
}
```

## Complexité

Temps O(H) : on descend une seule branche (O(log N) si équilibré). Espace O(1) : version itérative sans pile.
