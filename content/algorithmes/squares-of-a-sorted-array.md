---
title: "Squares of a Sorted Array"
description: "Un tableau trié peut contenir des négatifs. Renvoie le tableau des CARRÉS, trié croissant, en O(N). Ex : [-4,-1,0,3,10] → [0,1,9,16,100]."
category: "Algorithmes & Structures de données"
pattern: "Two Pointers"
difficulty: "Facile"
number: 21
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "two-pointers"]
summary: "Un tableau trié peut contenir des négatifs. Renvoie le tableau des CARRÉS, trié croissant, en O(N). Ex : [-4,-1,0,3,10] → [0,1,9,16,100]."
---

## C'est quoi le problème, en clair ?

On vous donne une liste déjà triée qui peut contenir des nombres négatifs, et vous devez renvoyer la liste de leurs carrés, elle aussi triée — mais sans repasser par un tri classique. Le piège : un grand nombre négatif comme -10 devient 100 une fois au carré, donc les plus grandes valeurs finales se cachent aux deux extrémités de la liste de départ (les grands négatifs à gauche, les grands positifs à droite), jamais au milieu. C'est un peu comme comparer deux poids aux deux bouts d'une balance : on regarde d'abord les extrêmes plutôt que de tout repeser depuis le début.

## L'idée clé

Après mise au carré, les plus GRANDES valeurs sont aux deux EXTRÉMITÉS (les grands négatifs et les grands positifs). Deux pointeurs aux deux bouts : on compare les carrés, on écrit le plus grand à la FIN du tableau résultat, et on rentre vers le centre.

## Pourquoi cette solution ?

Mettre au carré puis Arrays.sort() marche mais coûte O(N log N) — la question teste justement si tu sais exploiter le tri existant. Le remplissage par la fin évite tout décalage : même astuce que [Merge Sorted Array](/algorithmes/merge-sorted-array/).

## Solution Java

```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        int left = 0, right = n - 1;

        // On remplit le resultat par la FIN (les plus grands carres d'abord)
        for (int write = n - 1; write >= 0; write--) {
            int leftSq = nums[left] * nums[left];
            int rightSq = nums[right] * nums[right];

            if (leftSq > rightSq) {
                result[write] = leftSq;
                left++;
            } else {
                result[write] = rightSq;
                right--;
            }
        }
        return result;
    }
}
```

## Complexité

Temps O(N) : chaque élément est traité une fois. Espace O(N) pour le tableau de sortie (obligatoire), O(1) en plus.
