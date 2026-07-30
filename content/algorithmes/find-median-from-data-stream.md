---
title: "Find Median from Data Stream"
description: "Conçois une structure qui reçoit des nombres en continu : addNum(num) insère, findMedian() renvoie la médiane de tous les nombres vus. Les d..."
category: "Algorithmes & Structures de données"
pattern: "Heap"
difficulty: "Difficile"
number: 98
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "heap"]
summary: "Conçois une structure qui reçoit des nombres en continu : addNum(num) insère, findMedian() renvoie la médiane de tous les nombres vus. Les deux opérations doivent rester rapides malgré le flux."
---

## C'est quoi le problème, en clair ?

Des nombres arrivent un par un, sans jamais s'arrêter, et à tout moment on doit pouvoir dire quelle est la valeur « du milieu » (la médiane) parmi tous ceux déjà reçus. Le piège, c'est que retrier toute la liste à chaque nouveau nombre serait bien trop lent. Imaginez une file de personnes qu'on range en continu par taille, coupée en deux groupes — les plus petites d'un côté, les plus grandes de l'autre : tant que les deux groupes restent équilibrés, la médiane se lit directement à leur jonction, sans jamais tout reclasser.

## L'idée clé

DEUX TAS en équilibre : un MAX-heap pour la moitié basse des nombres, un MIN-heap pour la moitié haute. La médiane vit à leurs sommets : sommet du bas (tailles impaires) ou moyenne des deux sommets (tailles paires). Après chaque insertion, on rééquilibre pour que les tailles ne diffèrent jamais de plus de 1.

## Pourquoi cette solution ?

L'insertion sûre en 3 temps : toujours passer par le tas bas, transférer son max vers le tas haut, puis rapatrier si le haut devient trop gros — cette danse garantit l'invariant « tout le bas ≤ tout le haut » sans aucun if fragile. L'architecture « deux tas duals » est un pattern de design réutilisable (percentiles glissants, schedulers).

## Solution Java

```java
class MedianFinder {
    // Moitie basse : max-heap (son sommet = le plus grand des petits)
    private PriorityQueue<Integer> low = new PriorityQueue<>((a, b) -> b - a);
    // Moitie haute : min-heap (son sommet = le plus petit des grands)
    private PriorityQueue<Integer> high = new PriorityQueue<>();

    public void addNum(int num) {
        // 1. Entrer par le bas, 2. pousser le max du bas vers le haut
        low.offer(num);
        high.offer(low.poll());

        // 3. Reequilibrer : le bas garde la majorite (taille egale ou +1)
        if (high.size() > low.size()) {
            low.offer(high.poll());
        }
    }

    public double findMedian() {
        if (low.size() > high.size()) {
            return low.peek(); // nombre impair d'elements
        }
        return (low.peek() + high.peek()) / 2.0; // pair : moyenne des sommets
    }
}
```

## Complexité

Temps O(log N) par addNum (opérations de tas), O(1) pour findMedian. Espace O(N) : tous les nombres sont conservés dans les deux tas.
