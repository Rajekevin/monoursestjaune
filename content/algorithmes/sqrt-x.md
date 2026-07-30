---
title: "Sqrt(x)"
description: "Calcule la racine carrée ENTIÈRE de x (partie entière, arrondi vers le bas), sans utiliser Math.sqrt(). Ex : sqrt(8) → 2."
category: "Algorithmes & Structures de données"
pattern: "Binary Search"
difficulty: "Facile"
number: 28
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "binary-search"]
summary: "Calcule la racine carrée ENTIÈRE de x (partie entière, arrondi vers le bas), sans utiliser Math.sqrt(). Ex : sqrt(8) → 2."
---

## C'est quoi le problème, en clair ?

On veut calculer la racine carrée d'un nombre, mais arrondie à l'entier inférieur, sans avoir le droit d'utiliser la fonction toute faite du langage. Imaginez un jeu où vous devez deviner le plus grand nombre entier possible dont le carré ne dépasse pas une cible donnée : plutôt que d'essayer 1, puis 2, puis 3 un par un, vous encadrez la réponse et resserrez cet encadrement par deux à chaque essai, comme dans un jeu du « plus grand / plus petit ».

## L'idée clé

On cherche le plus grand entier m tel que m² ≤ x. Les candidats 1..x sont « triés » par rapport à cette condition (vrai, vrai, ..., vrai, faux, faux) : recherche binaire sur la RÉPONSE, pas sur un tableau ! C'est l'introduction au pattern « binary search on answer » (revu dans [Koko Eating Bananas](/algorithmes/koko-eating-bananas/)).

## Pourquoi cette solution ?

Piège d'overflow : mid * mid peut dépasser un int. Deux parades : caster en long, ou comparer mid ≤ x / mid. On mémorise le dernier mid valide dans answer au lieu de jongler avec les bornes finales.

## Solution Java

```java
class Solution {
    public int mySqrt(int x) {
        if (x < 2) return x;

        int left = 1, right = x / 2; // sqrt(x) <= x/2 pour x >= 2
        int answer = 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            long square = (long) mid * mid; // long : evite l'overflow

            if (square <= x) {
                answer = mid;      // mid est un candidat valide
                left = mid + 1;    // essayer plus grand
            } else {
                right = mid - 1;   // trop grand
            }
        }
        return answer;
    }
}
```

## Complexité

Temps O(log x) : dichotomie sur l'intervalle des candidats. Espace O(1).
