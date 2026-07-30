---
title: "Invert Binary Tree"
description: "Inverse un arbre binaire en miroir : pour chaque nœud, son sous-arbre gauche devient son sous-arbre droit et vice-versa. Renvoie la racine. ..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Facile"
number: 6
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Inverse un arbre binaire en miroir : pour chaque nœud, son sous-arbre gauche devient son sous-arbre droit et vice-versa. Renvoie la racine. (Le fameux problème qui a recalé le créateur de Homebrew chez Google.)"
---

## C'est quoi le problème, en clair ?

Un arbre binaire, c'est une structure où chaque élément (nœud) peut avoir jusqu'à deux enfants, un « gauche » et un « droit » — comme un organigramme d'entreprise où chaque manager a au plus deux subordonnés directs. Inverser cet arbre revient à en faire l'image miroir : à chaque niveau, l'enfant de gauche et l'enfant de droite échangent leur place. Pensez à prendre une photo de l'arbre et à la retourner horizontalement comme dans un miroir : ce qui était à gauche passe à droite, et ça, à tous les étages de l'arbre.

## L'idée clé

La récursion rend ça trivial : inverser un arbre = échanger ses deux enfants, puis inverser récursivement chacun des deux sous-arbres. Le cas de base est l'arbre vide (null). Penser « que fais-je sur UN nœud ? » et laisser la récursion gérer le reste.

## Pourquoi cette solution ?

Pas de structure auxiliaire : la pile d'appels de la JVM sert de mémoire implicite. C'est le problème parfait pour ancrer le réflexe DFS récursif sur les arbres — la même ossature (cas de base null + appels gauche/droite) revient dans 80% des problèmes d'arbres.

## Solution Java

```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Cas de base : un arbre vide inverse reste vide
        if (root == null) return null;

        // Echanger les deux enfants du noeud courant
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;

        // Inverser recursivement les deux sous-arbres
        invertTree(root.left);
        invertTree(root.right);

        return root;
    }
}
```

## Complexité

Temps O(N) : chaque nœud est visité exactement une fois. Espace O(H) pour la pile de récursion, où H est la hauteur (O(log N) si équilibré, O(N) si dégénéré).
