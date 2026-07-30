---
title: "Maximum Depth of Binary Tree"
description: "Renvoie la profondeur maximale d'un arbre binaire : le nombre de nœuds sur le plus long chemin de la racine jusqu'à une feuille. Un arbre vi..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Facile"
number: 10
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Renvoie la profondeur maximale d'un arbre binaire : le nombre de nœuds sur le plus long chemin de la racine jusqu'à une feuille. Un arbre vide a une profondeur de 0."
---

## C'est quoi le problème, en clair ?

On vous donne un arbre binaire (une structure où chaque élément, ou « nœud », a au maximum deux enfants, un à gauche et un à droite), et vous devez trouver sa profondeur maximale : le nombre de nœuds sur le chemin le plus long entre la racine (le sommet de l'arbre) et la feuille (un nœud sans enfant) la plus éloignée. Imaginez un arbre généalogique et demandez-vous combien de générations séparent, au maximum, l'ancêtre fondateur de son descendant le plus lointain. La façon la plus naturelle de répondre est de se poser la question à chaque nœud — « ma profondeur, c'est 1 (moi) plus la plus grande profondeur de mes deux enfants » — et de laisser la réponse remonter depuis le bas de l'arbre.

## L'idée clé

Définition récursive naturelle : la profondeur d'un arbre = 1 (la racine) + la profondeur du plus profond de ses deux sous-arbres. C'est LE problème pour comprendre comment une réponse « remonte » depuis les feuilles.

## Pourquoi cette solution ?

Une ligne de logique avec Math.max. Alternative itérative : un BFS avec ArrayDeque en comptant les niveaux — utile à mentionner si l'interviewer demande « et sans récursion ? ».

## Solution Java

```java
class Solution {
    public int maxDepth(TreeNode root) {
        // Cas de base : arbre vide, profondeur nulle
        if (root == null) return 0;

        // Profondeur = 1 (moi) + le plus profond de mes deux enfants
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

## Complexité

Temps O(N) : chaque nœud est visité une fois. Espace O(H) : hauteur de la pile de récursion, entre O(log N) (équilibré) et O(N) (liste dégénérée).
