---
title: "Koko Eating Bananas"
description: "Koko a des tas de bananes (piles[i]) et h heures. Chaque heure, elle mange k bananes d'UN seul tas (si le tas en a moins, l'heure est quand ..."
category: "Algorithmes & Structures de données"
pattern: "Binary Search"
difficulty: "Moyen"
number: 53
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "binary-search"]
summary: "Koko a des tas de bananes (piles[i]) et h heures. Chaque heure, elle mange k bananes d'UN seul tas (si le tas en a moins, l'heure est quand même consommée). Trouve la vitesse k MINIMALE pour tout finir en h heures."
---

## C'est quoi le problème, en clair ?

Koko a plusieurs tas de bananes devant elle et un nombre d'heures fixé pour tout manger. Chaque heure, elle choisit un seul tas et mange jusqu'à k bananes dedans (si le tas contient moins que k, elle le termine et l'heure est quand même passée). Il faut trouver la vitesse k la plus lente possible qui lui permette quand même de finir à temps — inutile de manger plus vite que nécessaire. C'est comme régler la vitesse d'un tapis roulant : vous cherchez le réglage minimal qui garantit que tout est traité avant la fin du service, sans le pousser plus vite qu'il ne faut.

## L'idée clé

Recherche binaire sur la RÉPONSE : la fonction « peut-elle finir à la vitesse k ? » est monotone (si k marche, k+1 marche aussi). On cherche donc la frontière faux→vrai entre k=1 et k=max(piles) : tester un k coûte O(N), et la dichotomie ne fait que O(log max) tests.

## Pourquoi cette solution ?

Le calcul d'heures par tas est un plafond : ceil(pile / k), qui s'écrit sans flottants en Java : (pile + k - 1) / k. Le pattern « binary search on answer » (déjà vu au [Sqrt(x)](/algorithmes/sqrt-x/)) résout des dizaines de problèmes d'optimisation min/max — un incontournable Amazon/Google.

## Solution Java

```java
class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int left = 1, right = 0;
        for (int p : piles) {
            right = Math.max(right, p); // vitesse max utile : le plus gros tas
        }

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canFinish(piles, mid, h)) {
                right = mid;     // mid suffit : essayer plus lent
            } else {
                left = mid + 1;  // trop lent : accelerer
            }
        }
        return left; // la plus petite vitesse qui marche
    }

    private boolean canFinish(int[] piles, int speed, int h) {
        long hours = 0;
        for (int pile : piles) {
            hours += (pile + speed - 1) / speed; // ceil sans flottant
        }
        return hours <= h;
    }
}
```

## Complexité

Temps O(N log M) où M = max(piles) : log M vitesses testées, chaque test en O(N). Espace O(1).
