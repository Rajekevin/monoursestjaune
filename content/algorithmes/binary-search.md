---
title: "Binary Search"
description: "Dans un tableau TRIÉ d'entiers, trouve l'indice de target, ou renvoie -1 s'il est absent. Contrainte implicite : le faire en O(log N), pas e..."
category: "Algorithmes & Structures de données"
pattern: "Binary Search"
difficulty: "Facile"
number: 8
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "binary-search"]
summary: "Dans un tableau TRIÉ d'entiers, trouve l'indice de target, ou renvoie -1 s'il est absent. Contrainte implicite : le faire en O(log N), pas en balayant tout le tableau."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres déjà triée, et vous devez trouver la position d'un nombre précis le plus vite possible. C'est la technique qu'on utilise naturellement pour chercher un mot dans un dictionnaire papier : on l'ouvre au milieu, on regarde si le mot cherché vient avant ou après, puis on ne garde que la bonne moitié et on recommence. Cette méthode élimine la moitié des possibilités à chaque étape, bien plus vite que de tout lire page par page.

## L'idée clé

Comme chercher dans un dictionnaire : on regarde le milieu, et selon que la cible est plus petite ou plus grande, on élimine TOUTE une moitié. On répète sur la moitié restante. Chaque étape divise l'espace de recherche par deux → log₂(N) étapes.

## Pourquoi cette solution ?

Trois variables (left, right, mid) suffisent. Détail de pro : mid = left + (right - left) / 2 au lieu de (left + right) / 2 pour éviter l'overflow d'int quand left + right dépasse 2³¹-1 — un classique des questions pièges d'entretien.

## Solution Java

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            // Milieu sans risque d'overflow (piege classique d'entretien)
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;               // trouve !
            } else if (nums[mid] < target) {
                left = mid + 1;           // la cible est a droite : on elimine la moitie gauche
            } else {
                right = mid - 1;          // la cible est a gauche : on elimine la moitie droite
            }
        }
        return -1; // espace de recherche vide : absent
    }
}
```

## Complexité

Temps O(log N) : l'espace de recherche est divisé par 2 à chaque itération. Espace O(1) : version itérative, aucune pile de récursion.
