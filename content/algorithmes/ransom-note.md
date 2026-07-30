---
title: "Ransom Note"
description: "Peux-tu écrire le mot ransomNote en découpant des lettres du texte magazine ? Chaque lettre du magazine ne peut servir qu'une fois. Renvoie ..."
category: "Algorithmes & Structures de données"
pattern: "Hashing"
difficulty: "Facile"
number: 23
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "hashing"]
summary: "Peux-tu écrire le mot ransomNote en découpant des lettres du texte magazine ? Chaque lettre du magazine ne peut servir qu'une fois. Renvoie true/false."
---

## C'est quoi le problème, en clair ?

Vous avez un texte de magazine et vous voulez découper des lettres dedans (chacune une seule fois) pour composer un mot de demande de rançon — la question est simplement : y a-t-il assez de chaque lettre dans le magazine pour écrire le mot voulu ? C'est comme vérifier si vous avez assez de lettres de Scrabble dans votre sac pour former un mot donné : on compte d'abord combien de chaque lettre on a en stock, puis on les « dépense » une par une pour écrire le mot voulu, et si jamais il en manque une, c'est impossible.

## L'idée clé

Problème de STOCK de lettres : on compte les lettres disponibles dans magazine, puis on « consomme » celles de ransomNote. Si un compteur passe en négatif, il manque une lettre → false.

## Pourquoi cette solution ?

int[26] comme pour [Valid Anagram](/algorithmes/valid-anagram/) : comptage direct, pas de HashMap nécessaire pour un alphabet fixe. Ce pattern « histogramme de fréquences » est la brique de base d'une dizaine de problèmes de chaînes (anagrammes, fenêtres, permutations).

## Solution Java

```java
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] stock = new int[26]; // lettres disponibles

        // 1. Remplir le stock avec les lettres du magazine
        for (char c : magazine.toCharArray()) {
            stock[c - 'a']++;
        }

        // 2. Consommer les lettres necessaires a la note
        for (char c : ransomNote.toCharArray()) {
            if (--stock[c - 'a'] < 0) {
                return false; // lettre epuisee : impossible
            }
        }
        return true;
    }
}
```

## Complexité

Temps O(M + R) : une passe sur chaque chaîne. Espace O(1) : 26 compteurs fixes.
