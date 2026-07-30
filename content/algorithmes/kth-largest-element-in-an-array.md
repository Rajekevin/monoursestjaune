---
title: "Kth Largest Element in an Array"
description: "Trouve le K-ième plus GRAND élément d'un tableau non trié (pas le K-ième distinct). Ex : [3,2,1,5,6,4], k=2 → 5."
category: "Algorithmes & Structures de données"
pattern: "Heap"
difficulty: "Moyen"
number: 63
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "heap"]
summary: "Trouve le K-ième plus GRAND élément d'un tableau non trié (pas le K-ième distinct). Ex : [3,2,1,5,6,4], k=2 → 5."
---

## C'est quoi le problème, en clair ?

On vous donne un tableau de nombres en désordre et un nombre K, et vous devez trouver quel serait le K-ième plus grand nombre si le tableau était trié — sans forcément le trier en entier, ce qui serait un travail superflu. Par exemple, dans [3,2,1,5,6,4] avec K=2, le plus grand est 6 et le deuxième plus grand est 5, donc la réponse est 5. Imaginez que vous cherchiez la deuxième meilleure note d'une classe : pas besoin de classer tous les élèves du premier au dernier, il suffit de garder de côté les meilleures notes vues au fur et à mesure.

## L'idée clé

Le même min-heap de taille K que le [Kth Largest Element in a Stream](/algorithmes/kth-largest-element-in-a-stream/) : on y verse tout le tableau en éjectant le plus petit dès que la taille dépasse K. À la fin, le sommet est le K-ième plus grand. Trier entier serait du gâchis : on ne veut qu'UN élément, pas l'ordre complet.

## Pourquoi cette solution ?

PriorityQueue min-heap par défaut → O(N log K), excellent quand K « N. À évoquer pour le niveau supérieur : Quickselect (partitionnement façon quicksort) atteint O(N) en moyenne — le mentionner et expliquer son principe vaut de gros points chez Meta/Google.

## Solution Java

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Min-heap contenant en permanence les k plus grands vus
        PriorityQueue<Integer> heap = new PriorityQueue<>();

        for (int num : nums) {
            heap.offer(num);
            if (heap.size() > k) {
                heap.poll(); // ejecter le plus petit : hors du top k
            }
        }
        // Le sommet du min-heap = le k-ieme plus grand
        return heap.peek();
    }
}
```

## Complexité

Temps O(N log K) : N insertions dans un tas borné à K. Espace O(K). (Quickselect : O(N) moyen, O(1) espace.)
