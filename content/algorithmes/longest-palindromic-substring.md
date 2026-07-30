---
title: "Longest Palindromic Substring"
description: "Trouve la plus longue sous-chaîne palindrome d'une chaîne. Ex : \"babad\" → \"bab\" (ou \"aba\")."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Moyen"
number: 76
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Trouve la plus longue sous-chaîne palindrome d'une chaîne. Ex : \"babad\" → \"bab\" (ou \"aba\")."
---

## C'est quoi le problème, en clair ?

On vous donne un mot ou une phrase, et vous devez trouver le plus long morceau CONTIGU (donc sans sauter de lettres) qui se lit pareil à l'endroit et à l'envers, comme « kayak » ou « radar ». Par exemple, dans "babad", la réponse est "bab" (ou "aba", les deux sont valides). Pensez à un mot qu'on plierait en deux sur lui-même comme une feuille de papier : le pli doit tomber pile au centre du morceau recherché, et les lettres de chaque côté doivent se superposer parfaitement. L'astuce consiste justement à essayer, pour chaque position possible, si un tel pli fonctionne, puis à l'agrandir tant que ça continue de matcher.

## L'idée clé

Expansion depuis le centre : un palindrome a un centre — soit un caractère (longueur impaire), soit un espace entre deux caractères (longueur paire). Pour chacun des 2N-1 centres possibles, on étend vers l'extérieur tant que les caractères coïncident, en gardant le plus long trouvé.

## Pourquoi cette solution ?

O(N²) temps / O(1) espace, plus simple ET plus économe que la table DP 2D (O(N²) espace). Bien penser aux DEUX types de centres (i,i) et (i,i+1) — oublier les centres pairs est l'erreur classique. Manacher fait O(N) mais n'est jamais exigé : le citer suffit.

## Solution Java

```java
class Solution {
    private int start = 0, maxLen = 0;

    public String longestPalindrome(String s) {
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);     // centre impair : un caractere
            expand(s, i, i + 1); // centre pair : entre deux caracteres
        }
        return s.substring(start, start + maxLen);
    }

    private void expand(String s, int left, int right) {
        // Etendre tant que le miroir tient
        while (left >= 0 && right < s.length()
               && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        // On a depasse d'un cran : le palindrome est (left+1 .. right-1)
        int len = right - left - 1;
        if (len > maxLen) {
            maxLen = len;
            start = left + 1;
        }
    }
}
```

## Complexité

Temps O(N²) : 2N-1 centres × expansion O(N) au pire. Espace O(1) hors sous-chaîne renvoyée.
