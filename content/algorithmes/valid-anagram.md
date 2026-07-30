---
title: "Valid Anagram"
description: "Deux chaînes s et t sont des anagrammes si t est un réarrangement exact des lettres de s (mêmes lettres, mêmes quantités). Ex : \"listen\" et ..."
category: "Algorithmes & Structures de données"
pattern: "Hashing"
difficulty: "Facile"
number: 7
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "hashing"]
summary: "Deux chaînes s et t sont des anagrammes si t est un réarrangement exact des lettres de s (mêmes lettres, mêmes quantités). Ex : \"listen\" et \"silent\" → vrai."
---

## C'est quoi le problème, en clair ?

On vous donne deux mots et vous devez vérifier s'ils sont des anagrammes, c'est-à-dire s'ils utilisent exactement les mêmes lettres, dans les mêmes quantités, juste réarrangées différemment. Imaginez deux joueurs de Scrabble qui vident leurs lettres sur la table : si en triant les lettres de chacun par ordre alphabétique on obtient exactement la même pile, alors les deux mots sont des anagrammes. Plutôt que de trier, on peut aussi simplement compter combien de fois chaque lettre apparaît dans chaque mot et comparer les compteurs.

## L'idée clé

Deux chaînes sont anagrammes si et seulement si elles ont le même « histogramme » de lettres. On compte les occurrences de chaque lettre : +1 pour s, -1 pour t. Si tous les compteurs finissent à zéro, c'est un anagramme.

## Pourquoi cette solution ?

Pour un alphabet de 26 lettres minuscules, un simple int[26] bat la HashMap : accès direct par c - 'a', zéro boxing, cache-friendly. La HashMap<Character,Integer> reste la bonne réponse pour de l'Unicode général — le dire en entretien marque des points.

## Solution Java

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false; // tailles differentes = impossible

        int[] count = new int[26]; // histogramme des 26 lettres

        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++; // +1 pour chaque lettre de s
            count[t.charAt(i) - 'a']--; // -1 pour chaque lettre de t
        }

        // Anagramme <=> tous les compteurs sont revenus a zero
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }
}
```

## Complexité

Temps O(N) : une passe sur les deux chaînes + 26 vérifications constantes. Espace O(1) : le tableau fait toujours 26 cases, indépendamment de N.
