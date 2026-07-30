---
title: "Plus One"
description: "Un grand entier est représenté par un tableau de chiffres (chiffre de poids fort en premier). Ajoute 1 et renvoie le tableau résultat. Ex : ..."
category: "Algorithmes & Structures de données"
pattern: "Arrays"
difficulty: "Facile"
number: 27
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "arrays"]
summary: "Un grand entier est représenté par un tableau de chiffres (chiffre de poids fort en premier). Ajoute 1 et renvoie le tableau résultat. Ex : [1,2,9] → [1,3,0], [9,9] → [1,0,0]."
---

## C'est quoi le problème, en clair ?

On vous donne un très grand nombre, écrit chiffre par chiffre dans une liste (comme 129 stocké en [1, 2, 9]), et il faut lui ajouter 1 — mais le nombre est trop grand pour tenir dans une variable numérique classique, donc on doit faire le calcul à la main, chiffre par chiffre. C'est exactement l'addition que vous posiez à l'école : vous partez du chiffre le plus à droite, vous ajoutez 1, et si ça fait 10, vous notez 0 et vous reportez la retenue sur le chiffre suivant, comme quand 19 + 1 devient 20.

## L'idée clé

Addition posée à la main, de droite à gauche : si le chiffre est < 9, on l'incrémente et c'est FINI (aucune retenue ne se propage). Si c'est un 9, il devient 0 et la retenue continue. Si on sort de la boucle, tous les chiffres étaient des 9 : le résultat est 1 suivi de zéros.

## Pourquoi cette solution ?

Le retour anticipé dès qu'un chiffre < 9 rend la solution quasi-O(1) en moyenne. Le cas « tout 9 » exploite un détail Java pratique : new int[n+1] est initialisé à zéro, il suffit de mettre 1 en tête.

## Solution Java

```java
class Solution {
    public int[] plusOne(int[] digits) {
        // Parcours de droite a gauche (chiffre des unites d'abord)
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;      // pas de retenue : termine !
                return digits;
            }
            digits[i] = 0;        // 9 devient 0, la retenue se propage
        }

        // On arrive ici seulement si TOUS les chiffres etaient des 9 (999 -> 1000)
        int[] result = new int[digits.length + 1]; // rempli de zeros par defaut
        result[0] = 1;
        return result;
    }
}
```

## Complexité

Temps O(N) au pire (que des 9), souvent O(1). Espace O(1), sauf le cas « tout 9 » qui alloue N+1 cases.
