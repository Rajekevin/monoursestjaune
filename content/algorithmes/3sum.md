---
title: "3Sum"
description: "Trouve tous les triplets UNIQUES (i≠j≠k) dont la somme vaut zéro. Ex : [-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]. Le défi principal : éviter l..."
category: "Algorithmes & Structures de données"
pattern: "Two Pointers"
difficulty: "Moyen"
number: 46
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "two-pointers"]
summary: "Trouve tous les triplets UNIQUES (i≠j≠k) dont la somme vaut zéro. Ex : [-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]. Le défi principal : éviter les doublons proprement."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres, et vous devez trouver tous les trios de nombres différents qui, additionnés, donnent zéro — sans jamais renvoyer deux fois le même trio sous un ordre différent. Imaginez trois amis qui piochent chacun un jeton (positif ou négatif) dans un sac commun, et qui doivent former des groupes de trois dont la somme des jetons tombe pile à zéro. La vraie difficulté n'est pas de trouver un seul trio qui marche, mais de les trouver tous, proprement, sans doublons ni oublis.

## L'idée clé

Trier le tableau, puis fixer le premier élément nums[i] et résoudre un Two Sum sur le reste avec DEUX POINTEURS (le tri permet de les faire converger : somme trop petite → left++, trop grande → right--). Les doublons se sautent en avançant tant que la valeur est identique à la précédente.

## Pourquoi cette solution ?

Le tri (O(N log N)) est ce qui débloque tout : deux pointeurs ET déduplication sans HashSet de triplets. Trois points de saut de doublons (sur i, sur left après un match, sur right après un match) : c'est LE détail qui sépare une solution correcte d'une solution acceptée.

## Solution Java

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            if (nums[i] > 0) break;                       // tout est positif apres : aucune somme nulle possible
            if (i > 0 && nums[i] == nums[i - 1]) continue; // sauter les doublons du premier element

            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];

                if (sum < 0) {
                    left++;              // somme trop petite : augmenter
                } else if (sum > 0) {
                    right--;             // somme trop grande : diminuer
                } else {
                    result.add(List.of(nums[i], nums[left], nums[right]));
                    left++;
                    right--;
                    // Sauter les doublons des deux autres elements
                    while (left < right && nums[left] == nums[left - 1]) left++;
                    while (left < right && nums[right] == nums[right + 1]) right--;
                }
            }
        }
        return result;
    }
}
```

## Complexité

Temps O(N²) : N choix du premier élément × balayage à deux pointeurs en O(N). Espace O(1) hors résultat (le tri est en place).
