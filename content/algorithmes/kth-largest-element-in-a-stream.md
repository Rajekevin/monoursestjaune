---
title: "Kth Largest Element in a Stream"
description: "Conçois une classe qui reçoit des nombres en continu (un flux) et sait renvoyer à tout moment le K-ième plus GRAND élément vu jusqu'ici. add..."
category: "Algorithmes & Structures de données"
pattern: "Heap"
difficulty: "Facile"
number: 39
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "heap"]
summary: "Conçois une classe qui reçoit des nombres en continu (un flux) et sait renvoyer à tout moment le K-ième plus GRAND élément vu jusqu'ici. add(val) insère et renvoie ce K-ième."
---

## C'est quoi le problème, en clair ?

Des nombres arrivent un par un, sans fin annoncée, et à chaque nouvel arrivage vous devez pouvoir répondre immédiatement à la question : « quel est actuellement le K-ième plus grand nombre reçu depuis le début ? ». Retrier toute la liste à chaque fois serait bien trop lent. Imaginez un classement des K meilleurs scores d'un jeu vidéo qui reçoit sans cesse de nouveaux joueurs : vous ne gardez que le petit groupe des K meilleurs scores, et le moins bon d'entre eux vous donne directement la réponse — pas besoin de connaître le classement complet.

## L'idée clé

Idée contre-intuitive : pour suivre les K plus grands, on garde un MIN-heap de taille K. Son sommet (le plus petit des K gardés) est exactement le K-ième plus grand ! À chaque insertion, si le tas dépasse K, on éjecte le plus petit — les intrus trop faibles sont évacués automatiquement.

## Pourquoi cette solution ?

Le duo « min-heap de taille K pour les K plus grands » (et inversement) est un des patterns les plus rentables des entretiens : [Top K Frequent Elements](/algorithmes/top-k-frequent-elements/), [Kth Largest Element in an Array](/algorithmes/kth-largest-element-in-an-array/)... PriorityQueue par défaut est déjà un min-heap : zéro comparateur à écrire ici.

## Solution Java

```java
class KthLargest {
    private PriorityQueue<Integer> minHeap = new PriorityQueue<>(); // min-heap
    private int k;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int num : nums) {
            add(num); // reutiliser la logique d'insertion
        }
    }

    public int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) {
            minHeap.poll(); // ejecter le plus petit : il ne fait pas partie du top K
        }
        // Le sommet du min-heap de taille k = le k-ieme plus grand
        return minHeap.peek();
    }
}
```

## Complexité

Temps O(log K) par add (tas borné à K éléments). Espace O(K) : on ne stocke jamais tout le flux — c'est le point clé.
