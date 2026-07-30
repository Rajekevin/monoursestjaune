---
title: "Clone Graph"
description: "Clone en profondeur un graphe non orienté connexe : chaque nœud a une valeur et une liste de voisins. Renvoie la copie du nœud donné."
category: "Algorithmes & Structures de données"
pattern: "Graphs"
difficulty: "Moyen"
number: 70
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "graphs"]
summary: "Clone en profondeur un graphe non orienté connexe : chaque nœud a une valeur et une liste de voisins. Renvoie la copie du nœud donné."
---

## C'est quoi le problème, en clair ?

On vous donne un graphe (un ensemble d'éléments reliés entre eux par des connexions, comme un plan de métro où les nœuds sont les stations et les arêtes les lignes qui les relient — voir le [glossaire](/glossaire-algorithmes/) si le mot est nouveau pour vous), et vous devez en créer une copie complète et indépendante, avec exactement les mêmes connexions. Le piège, c'est que ce graphe peut contenir des boucles (A est relié à B qui est relié à A) : copier naïvement de proche en proche, sans se souvenir de ce qui a déjà été copié, fait tourner en rond indéfiniment. C'est comme recopier un plan de métro circulaire sans jamais noter les stations déjà dessinées — il faut absolument garder une trace de ce qui existe déjà.

## L'idée clé

Le danger : les CYCLES (A voisin de B, B voisin de A) feraient boucler une copie naïve à l'infini. Parade : une HashMap<original, clone> qui sert à la fois de mémoire « déjà cloné » et d'annuaire pour recâbler les voisins. Si le clone existe déjà, on le renvoie au lieu de recréer.

## Pourquoi cette solution ?

DFS récursif + la map : créer le clone AVANT de cloner ses voisins (sinon récursion infinie sur les cycles). Ce pattern « map original→copie » est exactement celui de Copy List with Random Pointer — deux problèmes pour le prix d'un.

## Solution Java

```java
class Solution {
    private Map<Node, Node> cloned = new HashMap<>(); // original -> copie

    public Node cloneGraph(Node node) {
        if (node == null) return null;

        // Deja clone ? Renvoyer la copie existante (gere les cycles)
        if (cloned.containsKey(node)) {
            return cloned.get(node);
        }

        // 1. Creer le clone et l'enregistrer AVANT de traiter les voisins
        Node copy = new Node(node.val);
        cloned.put(node, copy);

        // 2. Cloner recursivement chaque voisin
        for (Node neighbor : node.neighbors) {
            copy.neighbors.add(cloneGraph(neighbor));
        }
        return copy;
    }
}
```

## Complexité

Temps O(V + E) : chaque nœud et chaque arête traités une fois. Espace O(V) : la map + la récursion.
