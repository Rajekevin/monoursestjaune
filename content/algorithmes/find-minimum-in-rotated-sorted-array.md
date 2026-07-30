---
title: "Find Minimum in Rotated Sorted Array"
description: "Même tableau trié-tourné que le Search in Rotated Sorted Array, éléments uniques : trouve la valeur MINIMALE en O(log N). Ex : [4,5,6,7,0,1,2] → 0."
category: "Algorithmes & Structures de données"
pattern: "Binary Search"
difficulty: "Moyen"
number: 52
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "binary-search"]
summary: "Même tableau trié-tourné que le Search in Rotated Sorted Array, éléments uniques : trouve la valeur MINIMALE en O(log N). Ex : [4,5,6,7,0,1,2] → 0."
---

## C'est quoi le problème, en clair ?

Un tableau de nombres était trié du plus petit au plus grand, puis on a coupé un morceau à la fin et recollé au début — un peu comme un jeu de cartes trié qu'on aurait coupé en deux paquets avant de les échanger. Le tableau garde une trace de cet ordre, mais le plus petit nombre ne se trouve plus au début : il faut le retrouver sans tout parcourir. Pensez à un livre dont on aurait déplacé les 20 premières pages à la fin : vous devinez où se cache la « page 1 » en observant juste quelques pages, sans tout feuilleter.

## L'idée clé

Le minimum est le « point de cassure » de la rotation. Boussole : comparer nums[mid] à nums[right]. Si nums[mid] > nums[right], la cassure (et le min) est strictement À DROITE de mid ; sinon le min est à mid ou à sa gauche. On resserre jusqu'à left == right.

## Pourquoi cette solution ?

Comparer à droite (et non à gauche) évite les ambiguïtés quand le tableau n'est pas tourné du tout. Même patron « chercher une frontière » que dans [First Bad Version](/algorithmes/first-bad-version/) : right = mid (mid reste candidat), left = mid + 1 (mid éliminé) — l'invariant à réciter.

## Solution Java

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                // La cassure est a droite de mid : le min aussi
                left = mid + 1;
            } else {
                // nums[mid] <= nums[right] : mid peut etre le min
                right = mid;
            }
        }
        return nums[left]; // left == right : le minimum
    }
}
```

## Complexité

Temps O(log N). Espace O(1).
