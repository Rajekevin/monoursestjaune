---
title: "Valid Palindrome"
description: "Une phrase est un palindrome si, après avoir retiré tout ce qui n'est pas alphanumérique et ignoré la casse, elle se lit pareil dans les deu..."
category: "Algorithmes & Structures de données"
pattern: "Two Pointers"
difficulty: "Facile"
number: 5
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "two-pointers"]
summary: "Une phrase est un palindrome si, après avoir retiré tout ce qui n'est pas alphanumérique et ignoré la casse, elle se lit pareil dans les deux sens. Ex : \"A man, a plan, a canal: Panama\" → vrai."
---

## C'est quoi le problème, en clair ?

On vous donne une phrase et vous devez dire si elle se lit pareil à l'endroit et à l'envers, en ignorant les espaces, la ponctuation et les majuscules ou minuscules. C'est le principe des palindromes classiques comme « Ésope reste ici et se repose » : pour vérifier, on compare le premier caractère utile avec le dernier, puis le deuxième avec l'avant-dernier, et ainsi de suite en se rapprochant du centre, en sautant simplement tout ce qui n'est ni une lettre ni un chiffre.

## L'idée clé

Deux pointeurs qui partent des deux extrémités et avancent l'un vers l'autre en sautant les caractères non alphanumériques. Si à un moment les deux caractères diffèrent, ce n'est pas un palindrome. Pas besoin de construire une chaîne nettoyée.

## Pourquoi cette solution ?

Character.isLetterOrDigit() et Character.toLowerCase() font le nettoyage à la volée en O(1) par caractère. La version « nettoyer puis comparer avec une chaîne inversée » marche aussi, mais coûte O(N) d'espace ; les deux pointeurs font le job en O(1).

## Solution Java

```java
class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;

        while (left < right) {
            // Sauter tout ce qui n'est ni lettre ni chiffre, des deux cotes
            while (left < right && !Character.isLetterOrDigit(s.charAt(left)))  left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;

            // Comparaison insensible a la casse
            if (Character.toLowerCase(s.charAt(left)) !=
                Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}
```

## Complexité

Temps O(N) : chaque caractère est examiné au plus une fois par un des deux pointeurs. Espace O(1) : aucune copie de la chaîne.
