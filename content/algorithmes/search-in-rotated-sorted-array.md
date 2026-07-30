---
title: "Search in Rotated Sorted Array"
description: "Un tableau trié a été « tourné » à un pivot inconnu (ex : [4,5,6,7,0,1,2]). Trouve l'indice de target en O(log N)."
category: "Algorithmes & Structures de données"
pattern: "Binary Search"
difficulty: "Moyen"
number: 51
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "binary-search"]
summary: "Un tableau trié a été « tourné » à un pivot inconnu (ex : [4,5,6,7,0,1,2]). Trouve l'indice de target en O(log N)."
---

## C'est quoi le problème, en clair ?

Imaginez un dictionnaire trié de A à Z, mais quelqu'un a coupé le livre à une page au hasard et a recollé la fin avant le début : l'ensemble n'est plus trié globalement, mais chaque moitié reste bien triée à l'intérieur d'elle-même. Vous devez retrouver un mot précis sans tout feuilleter, en profitant du fait qu'au moins une moitié est toujours triée pour savoir de quel côté chercher. C'est la « recherche binaire » (diviser l'espace de recherche par deux à chaque étape, comme deviner un nombre en demandant sans cesse « plus grand ou plus petit ? ») — sauf qu'ici il faut d'abord repérer quelle moitié est fiable avant de trancher.

## L'idée clé

À chaque coupe au milieu, UNE des deux moitiés est forcément parfaitement triée (comparer nums[left] et nums[mid] le révèle). On regarde alors si target est dans l'intervalle de la moitié triée : oui → on y va, non → on va dans l'autre. On garde ainsi la division par deux malgré la rotation.

## Pourquoi cette solution ?

Recherche binaire pure avec une logique de branchement enrichie — aucune structure. Le point délicat : les inégalités larges/strictes (nums[left] <= nums[mid] pour classer la moitié gauche comme triée). Écrire les 3 cas au brouillon avant de coder évite 20 minutes de debug en live.

## Solution Java

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;

            if (nums[left] <= nums[mid]) {
                // La moitie GAUCHE est triee
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1; // target est dans cette moitie triee
                } else {
                    left = mid + 1;  // sinon il est dans l'autre
                }
            } else {
                // La moitie DROITE est triee
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }
}
```

## Complexité

Temps O(log N) : on élimine bien une moitié à chaque tour. Espace O(1).
