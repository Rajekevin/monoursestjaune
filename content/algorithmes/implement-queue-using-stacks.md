---
title: "Implement Queue using Stacks"
description: "Implémente une file FIFO (push, pop, peek, empty) en n'utilisant QUE des piles LIFO."
category: "Algorithmes & Structures de données"
pattern: "Stack"
difficulty: "Facile"
number: 37
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "stack"]
summary: "Implémente une file FIFO (push, pop, peek, empty) en n'utilisant QUE des piles LIFO."
---

## C'est quoi le problème, en clair ?

On vous demande de fabriquer une file d'attente (le premier arrivé est le premier servi) en n'ayant à disposition que des piles, où on empile et dépile toujours par le dessus, comme une pile d'assiettes (voir [le glossaire](/glossaire-algorithmes/) si le terme est nouveau pour vous). Le hic, c'est qu'une pile inverse naturellement l'ordre : la dernière assiette posée est la première reprise, l'inverse de ce qu'on veut. Imaginez que vous n'ayez que deux paniers empilables pour servir des clients dans leur ordre d'arrivée : en versant le contenu d'un panier dans l'autre au bon moment, l'ordre se remet comme par magie dans le bon sens.

## L'idée clé

Deux piles : « entrée » et « sortie ». On empile toujours dans l'entrée. Pour sortir, si la pile de sortie est vide, on y transvase TOUTE l'entrée : le double renversement remet les éléments dans l'ordre FIFO. Un élément n'est transvasé qu'une seule fois dans sa vie.

## Pourquoi cette solution ?

L'analyse AMORTIE est le vrai sujet : un pop peut coûter O(N) ponctuellement, mais chaque élément ne fait qu'un aller (2 push + 2 pop au total sur sa vie), donc O(1) amorti. Savoir expliquer « amorti » proprement est très valorisé chez Google/Meta.

## Solution Java

```java
class MyQueue {
    private Deque<Integer> in = new ArrayDeque<>();  // recoit les push
    private Deque<Integer> out = new ArrayDeque<>(); // sert les pop/peek

    public void push(int x) {
        in.push(x);
    }

    public int pop() {
        transferIfNeeded();
        return out.pop();
    }

    public int peek() {
        transferIfNeeded();
        return out.peek();
    }

    public boolean empty() {
        return in.isEmpty() && out.isEmpty();
    }

    // Transvaser seulement quand out est vide : chaque element ne voyage qu'une fois
    private void transferIfNeeded() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) {
                out.push(in.pop()); // le double renversement retablit l'ordre FIFO
            }
        }
    }
}
```

## Complexité

Temps O(1) AMORTI par opération (chaque élément est déplacé au plus une fois). Espace O(N) pour les deux piles.
