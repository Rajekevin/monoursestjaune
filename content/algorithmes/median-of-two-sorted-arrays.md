---
title: "Median of Two Sorted Arrays"
description: "Deux tableaux triés de tailles m et n : trouve la MÉDIANE de leur union en O(log(min(m,n))) — la complexité imposée interdit la fusion. Répu..."
category: "Algorithmes & Structures de données"
pattern: "Binary Search"
difficulty: "Difficile"
number: 84
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "binary-search"]
summary: "Deux tableaux triés de tailles m et n : trouve la MÉDIANE de leur union en O(log(min(m,n))) — la complexité imposée interdit la fusion. Réputé le hard « mathématique » par excellence."
---

## C'est quoi le problème, en clair ?

On vous donne deux listes de nombres déjà triées, et vous devez trouver la médiane de l'ensemble des deux réunies — la valeur qui se trouverait exactement au milieu si on fusionnait et triait tout. La contrainte, c'est qu'il est interdit de vraiment fusionner les deux listes : il faut trouver la réponse beaucoup plus vite que ça. Imaginez deux files d'attente déjà triées par taille, et vous devez deviner où se trouverait la personne du milieu si les deux files n'en formaient qu'une, sans avoir le droit de les mélanger physiquement pour vérifier. La solution consiste à deviner intelligemment où « couper » chacune des deux listes, un peu comme dans un jeu où l'on affine sa réponse par élimination, jusqu'à trouver la coupe qui sépare exactement la bonne moitié de l'autre.

## L'idée clé

On cherche une COUPE : k éléments pris au début de A, le reste au début de B, telle que (moitié gauche totale) ≤ (moitié droite totale). Recherche binaire sur la position de coupe dans le PETIT tableau (la coupe de l'autre s'en déduit). La validité se teste avec 4 valeurs frontières : maxGauche(A/B) ≤ minDroite(B/A).

## Pourquoi cette solution ?

Sentinelles ±∞ (Integer.MIN_VALUE / MAX_VALUE) quand une coupe touche un bord : elles suppriment tous les cas particuliers. Toujours binariser sur le plus PETIT tableau (garantit la complexité et des coupes valides). Un problème à préparer À L'AVANCE : quasi impossible à improviser en 45 minutes.

## Solution Java

```java
class Solution {
    public double findMedianSortedArrays(int[] A, int[] B) {
        // Toujours binariser sur le plus petit tableau
        if (A.length > B.length) return findMedianSortedArrays(B, A);

        int m = A.length, n = B.length;
        int half = (m + n + 1) / 2; // taille de la moitie gauche
        int left = 0, right = m;

        while (left <= right) {
            int i = left + (right - left) / 2; // elements pris dans A
            int j = half - i;                  // elements pris dans B

            // Valeurs frontieres, avec sentinelles infinies aux bords
            int aLeft  = (i == 0) ? Integer.MIN_VALUE : A[i - 1];
            int aRight = (i == m) ? Integer.MAX_VALUE : A[i];
            int bLeft  = (j == 0) ? Integer.MIN_VALUE : B[j - 1];
            int bRight = (j == n) ? Integer.MAX_VALUE : B[j];

            if (aLeft <= bRight && bLeft <= aRight) {
                // Coupe valide : toute la gauche <= toute la droite
                if ((m + n) % 2 == 1) {
                    return Math.max(aLeft, bLeft); // impair : max de la gauche
                }
                return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2.0;
            } else if (aLeft > bRight) {
                right = i - 1; // trop pris dans A : reculer la coupe
            } else {
                left = i + 1;  // pas assez pris dans A : avancer la coupe
            }
        }
        throw new IllegalArgumentException();
    }
}
```

## Complexité

Temps O(log(min(m, n))) : dichotomie sur la coupe du petit tableau. Espace O(1).
