---
title: "Merge K Sorted Lists"
description: "Fusionne K listes chaînées triées en une seule liste triée. La généralisation directe de Merge Two Sorted Lists (Merge Two Sorted Lists)."
category: "Algorithmes & Structures de données"
pattern: "Heap"
difficulty: "Difficile"
number: 85
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "heap"]
summary: "Fusionne K listes chaînées triées en une seule liste triée. La généralisation directe de Merge Two Sorted Lists (Merge Two Sorted Lists)."
---

## C'est quoi le problème, en clair ?

On vous donne K listes chaînées — chacune une suite de valeurs reliées entre elles comme des wagons de train, où chaque valeur pointe vers la suivante (voir le [glossaire](/glossaire-algorithmes/)) — et chacune déjà triée. Vous devez toutes les fusionner en une seule grande liste, elle aussi triée. Imaginez K piles de cartes à jouer, chacune déjà triée du plus petit au plus grand : pour construire une seule pile triée avec toutes les cartes, vous regardez à chaque fois la carte du dessus de chaque pile et vous prenez la plus petite parmi elles, encore et encore, jusqu'à ce que toutes les piles soient vides. C'est la généralisation du problème plus simple qui ne fusionne que deux listes, [Merge Two Sorted Lists](/algorithmes/merge-two-sorted-lists/).

## L'idée clé

À chaque instant, le prochain nœud du résultat est le plus petit parmi les K têtes courantes → un MIN-HEAP des têtes. On extrait le minimum, on l'accroche au résultat, et on insère son successeur dans le tas. Le tas ne contient jamais plus de K nœuds.

## Pourquoi cette solution ?

PriorityQueue<ListNode> avec Comparator.comparingInt(node -> node.val) — trier des objets par un champ, la syntaxe à connaître. Alternative de même complexité : fusion deux à deux « en tournoi » (divide & conquer), qui réutilise le [Merge Two Sorted Lists](/algorithmes/merge-two-sorted-lists/) tel quel. Comparer les deux approches à voix haute est un excellent réflexe.

## Solution Java

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Min-heap des tetes courantes, triees par valeur
        PriorityQueue<ListNode> heap =
            new PriorityQueue<>(Comparator.comparingInt(node -> node.val));

        for (ListNode head : lists) {
            if (head != null) heap.offer(head);
        }

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (!heap.isEmpty()) {
            ListNode smallest = heap.poll(); // plus petit des K candidats
            tail.next = smallest;
            tail = smallest;

            if (smallest.next != null) {
                heap.offer(smallest.next);   // son successeur devient candidat
            }
        }
        return dummy.next;
    }
}
```

## Complexité

Temps O(N log K) : N nœuds au total, chaque opération de tas sur K éléments coûte O(log K). Espace O(K) pour le tas.
