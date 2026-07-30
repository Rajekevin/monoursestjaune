---
title: "Two Sum"
description: "On te donne un tableau d'entiers nums et une cible target. Trouve les indices de DEUX nombres dont la somme vaut exactement target. Il y a t..."
category: "Algorithmes & Structures de données"
pattern: "Hashing"
difficulty: "Facile"
number: 1
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "hashing"]
summary: "On te donne un tableau d'entiers nums et une cible target. Trouve les indices de DEUX nombres dont la somme vaut exactement target. Il y a toujours exactement une solution, et tu ne peux pas utiliser deux fois le même élément."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres et un total à atteindre. Vous devez trouver deux nombres de cette liste qui, additionnés, donnent exactement ce total — et dire à quelles positions ils se trouvent.

Imaginez une caisse de supermarché : vous avez 7€ en poche et vous voulez payer avec exactement deux pièces. Plutôt que de tester toutes les paires de pièces une par une, vous vous souvenez de chaque pièce déjà vue et vous vérifiez simplement si "la pièce qui complèterait 7€" est déjà dans votre poche. C'est exactement l'astuce utilisée ici.

## L'idée clé

Le déclic : au lieu de chercher deux nombres qui s'additionnent, pour chaque nombre x on cherche son COMPLÉMENT (target - x). Si on a déjà croisé ce complément avant, c'est gagné. Une seule passe suffit si on mémorise ce qu'on a vu.

## Pourquoi cette solution ?

On utilise une HashMap<valeur, indice> : vérifier si le complément existe coûte O(1) grâce à containsKey(). La version naïve à deux boucles coûte O(N²) ; la HashMap échange un peu de mémoire contre un gain de temps massif — c'est LE trade-off classique des entretiens.

## Solution Java

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Map : valeur deja vue -> son indice
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            // Le nombre qu'il nous faudrait pour completer la somme
            int complement = target - nums[i];

            // L'a-t-on deja rencontre plus tot dans le tableau ?
            if (seen.containsKey(complement)) {
                // Oui : on renvoie l'indice memorise + l'indice courant
                return new int[]{ seen.get(complement), i };
            }

            // Non : on memorise le nombre courant pour les prochains tours
            seen.put(nums[i], i);
        }
        return new int[]{}; // jamais atteint (une solution existe toujours)
    }
}
```

## Complexité

Temps O(N) : une seule passe, chaque get/put de HashMap est en O(1) amorti. Espace O(N) : dans le pire cas la map stocke les N éléments avant de trouver la paire.
