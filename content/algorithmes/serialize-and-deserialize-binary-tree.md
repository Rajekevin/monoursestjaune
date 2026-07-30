---
title: "Serialize and Deserialize Binary Tree"
description: "Conçois serialize(root) qui transforme un arbre binaire en chaîne, et deserialize(data) qui reconstruit l'arbre EXACT depuis cette chaîne. L..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Difficile"
number: 89
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Conçois serialize(root) qui transforme un arbre binaire en chaîne, et deserialize(data) qui reconstruit l'arbre EXACT depuis cette chaîne. Le format est libre : seul l'aller-retour compte."
---

## C'est quoi le problème, en clair ?

Un arbre binaire (une structure où chaque case, ou « nœud », a au plus deux cases enfants) vit en mémoire avec plein de flèches entre les cases : impossible de l'envoyer tel quel dans un fichier ou sur le réseau. Il faut donc l'« aplatir » en une simple chaîne de texte, un peu comme une notice de montage, puis être capable de reconstruire EXACTEMENT le même arbre à partir de ce texte, y compris ses branches vides. C'est comme démonter un meuble, écrire la notice, puis vérifier qu'un inconnu peut le remonter à l'identique juste en la suivant.

## L'idée clé

Un preorder AVEC marqueurs de null (« # ») capture toute la structure sans ambiguïté — c'est ce qui manquait au preorder seul du [Construct Binary Tree from Preorder and Inorder](/algorithmes/construct-binary-tree-from-preorder-and-inorder/). La désérialisation rejoue le même preorder : lire un jeton, créer le nœud, construire récursivement gauche puis droite ; « # » = sous-arbre vide.

## Pourquoi cette solution ?

StringBuilder pour la sérialisation (concaténation O(N), pas O(N²)), split(",") + un index partagé (ou une ArrayDeque de jetons) pour la lecture séquentielle. La SYMÉTRIE parfaite entre les deux fonctions — même parcours, un en écriture, un en lecture — est ce qui rend la solution belle et robuste.

## Solution Java

```java
public class Codec {
    private static final String NULL = "#";
    private static final String SEP = ",";

    // Serialisation : preorder avec marqueurs de null
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append(NULL).append(SEP);
            return;
        }
        sb.append(node.val).append(SEP);
        buildString(node.left, sb);
        buildString(node.right, sb);
    }

    // Deserialisation : rejouer le meme preorder en lecture
    public TreeNode deserialize(String data) {
        Deque<String> tokens = new ArrayDeque<>(Arrays.asList(data.split(SEP)));
        return buildTree(tokens);
    }

    private TreeNode buildTree(Deque<String> tokens) {
        String token = tokens.poll();
        if (NULL.equals(token)) return null; // sous-arbre vide

        TreeNode node = new TreeNode(Integer.parseInt(token));
        node.left = buildTree(tokens);   // meme ordre qu'a l'ecriture
        node.right = buildTree(tokens);
        return node;
    }
}
```

## Complexité

Temps O(N) dans les deux sens : chaque nœud écrit/lu une fois. Espace O(N) : la chaîne + la récursion.
