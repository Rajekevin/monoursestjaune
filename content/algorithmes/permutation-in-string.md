---
title: "Permutation in String"
description: "La chaîne s2 contient-elle une PERMUTATION de s1 comme sous-chaîne contiguë ? Ex : s1=\"ab\", s2=\"eidbaooo\" → vrai (\"ba\")."
category: "Algorithmes & Structures de données"
pattern: "Sliding Window"
difficulty: "Moyen"
number: 50
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "sliding-window"]
summary: "La chaîne s2 contient-elle une PERMUTATION de s1 comme sous-chaîne contiguë ? Ex : s1=\"ab\", s2=\"eidbaooo\" → vrai (\"ba\")."
---

## C'est quoi le problème, en clair ?

On vous donne un petit mot s1 et un texte plus long s2, et la question est : existe-t-il, quelque part dans s2, un morceau consécutif de lettres qui contient exactement les mêmes lettres que s1, dans un ordre différent (une « permutation ») ? C'est comme chercher dans un long texte un passage qui utiliserait exactement les mêmes lettres de Scrabble que votre mot, ni plus ni moins, sans se soucier de l'ordre. Pour ça, on fait glisser une « fenêtre » (une plage de lettres consécutives, voir [le glossaire](/glossaire-algorithmes/)) de la taille de s1 le long de s2, et à chaque déplacement on vérifie si le contenu de la fenêtre a le même « sac de lettres » que s1.

## L'idée clé

Une permutation de s1 = n'importe quelle sous-chaîne de s2 de longueur |s1| ayant le MÊME histogramme de lettres. Fenêtre de taille FIXE |s1| qui glisse sur s2 : à chaque pas, une lettre entre, une lettre sort, et on compare les histogrammes.

## Pourquoi cette solution ?

Deux int[26] + un compteur « matches » (nombre de lettres dont les fréquences coïncident) mis à jour incrémentalement : la comparaison devient O(1) par glissement au lieu de O(26). La fenêtre fixe est la petite sœur de la fenêtre variable ([Longest Substring Without Repeating Characters](/algorithmes/longest-substring-without-repeating-characters/)/[Longest Repeating Character Replacement](/algorithmes/longest-repeating-character-replacement/)) — les deux se demandent en entretien.

## Solution Java

```java
class Solution {
    public boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;

        int[] need = new int[26];   // histogramme de s1
        int[] window = new int[26]; // histogramme de la fenetre courante

        // Initialiser la premiere fenetre de taille |s1|
        for (int i = 0; i < s1.length(); i++) {
            need[s1.charAt(i) - 'a']++;
            window[s2.charAt(i) - 'a']++;
        }
        if (Arrays.equals(need, window)) return true;

        // Glisser la fenetre : une lettre entre, une lettre sort
        for (int right = s1.length(); right < s2.length(); right++) {
            window[s2.charAt(right) - 'a']++;                 // entre
            window[s2.charAt(right - s1.length()) - 'a']--;   // sort
            if (Arrays.equals(need, window)) return true;
        }
        return false;
    }
}
```

## Complexité

Temps O(N) : chaque glissement coûte O(26) = O(1) constant. Espace O(1) : deux tableaux de 26.
