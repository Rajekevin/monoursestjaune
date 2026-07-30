---
title: "Product of Array Except Self"
description: "Renvoie un tableau où result[i] est le produit de TOUS les éléments SAUF nums[i] — sans utiliser la division, en O(N)."
category: "Algorithmes & Structures de données"
pattern: "Arrays"
difficulty: "Moyen"
number: 43
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "arrays"]
summary: "Renvoie un tableau où result[i] est le produit de TOUS les éléments SAUF nums[i] — sans utiliser la division, en O(N)."
---

## C'est quoi le problème, en clair ?

Pour chaque nombre d'une liste, il faut calculer le produit (la multiplication) de TOUS les autres nombres de la liste, sauf lui-même — et sans utiliser la division. Imaginez une rangée d'ampoules dont la luminosité dépend du produit de toutes les autres : pour chaque ampoule, on multiplie d'abord tout ce qui est à sa gauche, puis on multiplie le résultat par tout ce qui est à sa droite, comme si on éclairait la scène depuis les deux côtés.

## L'idée clé

Le produit « sauf moi » = (produit de tout ce qui est à ma GAUCHE) × (produit de tout ce qui est à ma DROITE). Deux passes : la première remplit result avec les produits-préfixes gauche ; la seconde, en sens inverse, multiplie au vol par un accumulateur des produits-suffixes droite.

## Pourquoi cette solution ?

L'astuce d'espace : le tableau résultat lui-même stocke les préfixes, et le suffixe tient dans UNE variable qui glisse — O(1) d'espace auxiliaire (hors sortie), le niveau de finition attendu. La division est interdite précisément pour forcer ce raisonnement préfixe/suffixe (et à cause des zéros).

## Solution Java

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];

        // Passe 1 : result[i] = produit de tous les elements a GAUCHE de i
        result[0] = 1;
        for (int i = 1; i < n; i++) {
            result[i] = result[i - 1] * nums[i - 1];
        }

        // Passe 2 : multiplier par le produit de tous les elements a DROITE
        int rightProduct = 1; // accumulateur qui glisse de droite a gauche
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= rightProduct;
            rightProduct *= nums[i];
        }
        return result;
    }
}
```

## Complexité

Temps O(N) : deux passes linéaires. Espace O(1) auxiliaire (le tableau de sortie ne compte pas, par convention de l'énoncé).
