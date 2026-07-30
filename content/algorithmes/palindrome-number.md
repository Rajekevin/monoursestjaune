---
title: "Palindrome Number"
description: "Un entier est-il un palindrome (se lit pareil dans les deux sens) SANS le convertir en chaîne ? Ex : 121 → vrai, -121 → faux (le signe casse..."
category: "Algorithmes & Structures de données"
pattern: "Math & Bits"
difficulty: "Facile"
number: 25
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "math-bits"]
summary: "Un entier est-il un palindrome (se lit pareil dans les deux sens) SANS le convertir en chaîne ? Ex : 121 → vrai, -121 → faux (le signe casse la symétrie)."
---

## C'est quoi le problème, en clair ?

Un palindrome, c'est un nombre qui se lit pareil à l'endroit et à l'envers, comme 121 ou 1331 — le but est de vérifier ça sans transformer le nombre en texte. Imaginez que vous lisez le nombre à voix haute avec un ami : vous commencez chacun d'un bout, lui à gauche et vous à droite, et vous avancez vers le milieu en comparant les chiffres un par un. Si tout correspond jusqu'à ce que vous vous croisiez, c'est un palindrome.

## L'idée clé

On reconstruit la MOITIÉ inversée du nombre : à chaque étape on extrait le dernier chiffre (x % 10) et on l'empile dans reversed (reversed * 10 + chiffre). Quand reversed rattrape x, on a traité la moitié : x doit être égal à reversed (pair) ou à reversed/10 (impair, chiffre du milieu ignoré).

## Pourquoi cette solution ?

Inverser seulement la moitié évite tout risque d'overflow (inverser 2147483647 en entier dépasserait la capacité d'un int). Filtres rapides : les négatifs et les multiples de 10 (sauf 0) ne sont jamais palindromes.

## Solution Java

```java
class Solution {
    public boolean isPalindrome(int x) {
        // Negatif, ou termine par 0 sans etre 0 : jamais palindrome
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;

        int reversed = 0;
        // On inverse les chiffres jusqu'a la moitie du nombre
        while (x > reversed) {
            reversed = reversed * 10 + x % 10; // empiler le dernier chiffre
            x /= 10;                            // le retirer de x
        }
        // Longueur paire : x == reversed
        // Longueur impaire : le chiffre du milieu (reversed % 10) s'ignore
        return x == reversed || x == reversed / 10;
    }
}
```

## Complexité

Temps O(log₁₀ N) : une itération par chiffre (on s'arrête à la moitié). Espace O(1).
