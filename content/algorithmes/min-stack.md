---
title: "Min Stack"
description: "Conçois une pile qui supporte push, pop, top, ET getMin (le minimum de la pile) — chaque opération en O(1) constant."
category: "Algorithmes & Structures de données"
pattern: "Stack"
difficulty: "Facile"
number: 36
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "stack"]
summary: "Conçois une pile qui supporte push, pop, top, ET getMin (le minimum de la pile) — chaque opération en O(1) constant."
---

## C'est quoi le problème, en clair ?

On vous demande de construire une pile — une structure où on empile et on dépile toujours par le dessus, comme une pile d'assiettes (voir le [glossaire](/glossaire-algorithmes/)) — mais avec un pouvoir en plus : à tout moment, elle doit pouvoir vous dire instantanément quel est son plus petit élément, même après plusieurs empilages et dépilages. Imaginez une pile d'assiettes où chaque assiette, en plus de son propre contenu, garde en mémoire « quelle était la plus petite assiette de la pile au moment où je suis arrivée ». Ainsi, peu importe combien d'assiettes on retire du dessus, l'assiette qui redevient visible sait immédiatement quel est le minimum actuel de toute la pile restante, sans avoir à tout revérifier.

## L'idée clé

Le piège : après un pop, quel est le nouveau minimum ? Réponse : chaque élément mémorise « le minimum au moment où j'ai été empilé ». Une seconde pile parallèle (minStack) stocke ce minimum courant : son sommet est TOUJOURS le min, et il se dépile en même temps que la pile principale.

## Pourquoi cette solution ?

Deux ArrayDeque synchronisées : la simplicité prime sur la micro-optimisation (on pourrait n'empiler dans minStack que les nouveaux minima, à mentionner). Ce problème teste le design de structure, pas l'algorithmique — soigner l'API.

## Solution Java

```java
class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();    // les valeurs
    private Deque<Integer> minStack = new ArrayDeque<>(); // le min courant a chaque etage

    public void push(int val) {
        stack.push(val);
        // Le nouveau min est le plus petit entre val et l'ancien min
        int newMin = minStack.isEmpty() ? val : Math.min(val, minStack.peek());
        minStack.push(newMin);
    }

    public void pop() {
        stack.pop();
        minStack.pop(); // les deux piles restent synchronisees
    }

    public int top()    { return stack.peek(); }
    public int getMin() { return minStack.peek(); } // O(1) garanti
}
```

## Complexité

Temps O(1) pour les quatre opérations. Espace O(N) : la pile des minima double la mémoire — le prix du getMin constant.
