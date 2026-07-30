---
title: "Move Zeroes"
description: "Déplace tous les zéros d'un tableau à la fin, en conservant l'ordre relatif des éléments non nuls, EN PLACE et sans copie du tableau. Ex : [..."
category: "Algorithmes & Structures de données"
pattern: "Two Pointers"
difficulty: "Facile"
number: 18
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "two-pointers"]
summary: "Déplace tous les zéros d'un tableau à la fin, en conservant l'ordre relatif des éléments non nuls, EN PLACE et sans copie du tableau. Ex : [0,1,0,3,12] → [1,3,12,0,0]."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres mélangés avec des zéros, et vous devez pousser tous ces zéros à la fin, sans changer l'ordre des autres nombres entre eux — et sans créer une nouvelle liste à côté. C'est comme trier une file de spectateurs devant un cinéma : on garde ceux qui ont un billet valide (les nombres non nuls) dans l'ordre où ils sont arrivés, et on repousse ceux qui n'en ont pas (les zéros) tout au bout de la file, en les faisant simplement changer de place avec les spectateurs valides.

## L'idée clé

Pattern « lecteur/écrivain » : un pointeur write marque la prochaine place pour un élément non nul. On parcourt le tableau : chaque non-zéro est échangé vers la position write, qui avance. Les zéros se retrouvent mécaniquement poussés vers la fin.

## Pourquoi cette solution ?

Le swap garantit qu'on ne perd aucune valeur et que l'opération reste en place. Ce pattern à deux pointeurs sur le MÊME tableau (partitionnement stable) revient dans Remove Duplicates ([Remove Duplicates from Sorted Array](/algorithmes/remove-duplicates-from-sorted-array/)) et dans le partitionnement du quicksort.

## Solution Java

```java
class Solution {
    public void moveZeroes(int[] nums) {
        int write = 0; // prochaine position pour un element non nul

        for (int read = 0; read < nums.length; read++) {
            if (nums[read] != 0) {
                // Echanger l'element non nul vers l'avant
                int temp = nums[write];
                nums[write] = nums[read];
                nums[read] = temp;
                write++;
            }
            // Si nums[read] == 0 : on ne fait rien, write reste bloque dessus
        }
    }
}
```

## Complexité

Temps O(N) : une seule passe. Espace O(1) : échanges en place uniquement.
