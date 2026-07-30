---
title: "Validate Binary Search Tree"
description: "Vérifie qu'un arbre binaire est un BST valide : pour CHAQUE nœud, tout son sous-arbre gauche est strictement inférieur, tout son sous-arbre ..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Moyen"
number: 59
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Vérifie qu'un arbre binaire est un BST valide : pour CHAQUE nœud, tout son sous-arbre gauche est strictement inférieur, tout son sous-arbre droit strictement supérieur."
---

## C'est quoi le problème, en clair ?

On vous donne un arbre binaire (chaque case a au plus deux cases enfants) et vous devez vérifier qu'il respecte bien la règle d'un arbre de recherche : à chaque étage, tout ce qui est à gauche doit être plus petit, tout ce qui est à droite plus grand. Le piège, c'est qu'il ne suffit pas de comparer chaque case à son parent direct : un petit-enfant peut respecter son parent tout en violant une règle posée plus haut par son grand-parent, comme une règle de famille qui doit s'appliquer à toute la lignée, pas seulement d'une génération à l'autre. Il faut donc faire descendre, à chaque étape, une fourchette de valeurs autorisées de plus en plus étroite.

## L'idée clé

Le piège célèbre : comparer chaque nœud à son seul parent NE SUFFIT PAS (un petit-fils peut violer la règle d'un grand-parent). La solution : propager un INTERVALLE (min, max) autorisé. En descendant à gauche, le max se resserre à la valeur du parent ; à droite, c'est le min.

## Pourquoi cette solution ?

On passe les bornes en Integer (nullable) plutôt qu'en int : null = « pas de borne », ce qui évite le piège des valeurs égales à Integer.MIN_VALUE/MAX_VALUE présentes dans l'arbre. Alternative élégante : un parcours in-order doit produire une suite strictement croissante.

## Solution Java

```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    // min et max sont les bornes STRICTES autorisees (null = pas de borne)
    private boolean validate(TreeNode node, Integer min, Integer max) {
        if (node == null) return true;

        // La valeur doit rester strictement dans l'intervalle herite
        if (min != null && node.val <= min) return false;
        if (max != null && node.val >= max) return false;

        // A gauche : le plafond devient node.val ; a droite : le plancher
        return validate(node.left, min, node.val)
            && validate(node.right, node.val, max);
    }
}
```

## Complexité

Temps O(N) : chaque nœud validé une fois. Espace O(H) de récursion.
