---
title: "Sliding Window Maximum"
description: "Une fenêtre de taille k glisse sur un tableau : renvoie le MAXIMUM de chaque position de la fenêtre. Ex : nums=[1,3,-1,-3,5,3,6,7], k=3 → [3..."
category: "Algorithmes & Structures de données"
pattern: "Sliding Window"
difficulty: "Difficile"
number: 83
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "sliding-window"]
summary: "Une fenêtre de taille k glisse sur un tableau : renvoie le MAXIMUM de chaque position de la fenêtre. Ex : nums=[1,3,-1,-3,5,3,6,7], k=3 → [3,3,5,5,6,7]. Contrainte : O(N)."
---

## C'est quoi le problème, en clair ?

On fait glisser une fenêtre de taille fixe k sur une liste de nombres, case par case, et à chaque position on veut connaître le plus grand nombre actuellement visible dans cette fenêtre. Imaginez que vous regardez par une lucarne mobile qui ne montre que k coureurs à la fois sur une piste : à chaque déplacement de la lucarne, vous devez annoncer le plus rapide des coureurs visibles, sans reprendre la course depuis le début à chaque fois. Le défi est de le faire vite, sans revérifier tous les coureurs de la fenêtre à chaque déplacement.

## L'idée clé

Deque MONOTONE décroissante d'indices : le front est toujours le max de la fenêtre. À chaque pas : (1) évacuer par l'ARRIÈRE tous les indices dont la valeur est ≤ à la nouvelle (ils ne seront plus jamais un max — dominés), (2) évacuer par l'AVANT l'indice sorti de la fenêtre, (3) lire le max au front.

## Pourquoi cette solution ?

ArrayDeque utilisé par ses DEUX bouts (offerLast/pollLast/pollFirst/peekFirst) : c'est le seul problème classique qui exige vraiment une deque, d'où sa réputation. Stocker des INDICES (pas des valeurs) permet de détecter l'expiration hors fenêtre. Le tas ferait O(N log N) — insuffisant ici.

## Solution Java

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>(); // indices, valeurs decroissantes

        for (int i = 0; i < n; i++) {
            // 1. Evacuer par l'arriere les valeurs dominees par nums[i]
            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }
            deque.offerLast(i);

            // 2. Evacuer par l'avant l'indice sorti de la fenetre
            if (deque.peekFirst() <= i - k) {
                deque.pollFirst();
            }

            // 3. Fenetre complete : le front est le maximum
            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }
        return result;
    }
}
```

## Complexité

Temps O(N) amorti : chaque indice entre et sort de la deque au plus une fois. Espace O(k) pour la deque.
