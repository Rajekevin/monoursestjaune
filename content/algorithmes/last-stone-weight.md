---
title: "Last Stone Weight"
description: "Des pierres ont des poids. À chaque tour, on fracasse les DEUX plus lourdes l'une contre l'autre : si elles sont égales, les deux disparaiss..."
category: "Algorithmes & Structures de données"
pattern: "Heap"
difficulty: "Facile"
number: 38
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "heap"]
summary: "Des pierres ont des poids. À chaque tour, on fracasse les DEUX plus lourdes l'une contre l'autre : si elles sont égales, les deux disparaissent ; sinon il reste une pierre de poids (y - x). Renvoie le poids de la dernière pierre (ou 0)."
---

## C'est quoi le problème, en clair ?

Vous avez un tas de pierres de poids différents, et à chaque tour vous prenez les deux plus lourdes pour les fracasser l'une contre l'autre. Si elles pèsent pareil, elles disparaissent toutes les deux ; sinon, il reste un fragment dont le poids est la différence entre les deux. Vous répétez ce processus jusqu'à ce qu'il ne reste plus qu'une pierre (ou aucune), et vous devez prédire le poids de cette dernière survivante. C'est un jeu de démolition où il faut suivre, tour après tour, quelles sont les deux pierres actuellement les plus lourdes.

## L'idée clé

« Toujours prendre les deux plus grandes » = accès répété au maximum = MAX-HEAP. On sort les deux plus lourdes en O(log N), on remet la différence si elle est non nulle, et on répète jusqu'à ce qu'il reste 0 ou 1 pierre.

## Pourquoi cette solution ?

PriorityQueue est un MIN-heap par défaut : le comparateur (a, b) -> b - a l'inverse en max-heap — la manipulation Java à connaître par cœur. Ce petit problème est le meilleur échauffement possible avant [Kth Largest Element in an Array](/algorithmes/kth-largest-element-in-an-array/) et [Merge K Sorted Lists](/algorithmes/merge-k-sorted-lists/).

## Solution Java

```java
class Solution {
    public int lastStoneWeight(int[] stones) {
        // Max-heap : comparateur inverse
        PriorityQueue<Integer> heap = new PriorityQueue<>((a, b) -> b - a);
        for (int s : stones) {
            heap.offer(s);
        }

        while (heap.size() > 1) {
            int heaviest = heap.poll();       // la plus lourde
            int second = heap.poll();         // la deuxieme plus lourde
            if (heaviest != second) {
                heap.offer(heaviest - second); // le reste retourne dans le tas
            }
        }
        return heap.isEmpty() ? 0 : heap.peek();
    }
}
```

## Complexité

Temps O(N log N) : au plus N-1 tours avec des opérations de tas en O(log N). Espace O(N) pour le tas.
