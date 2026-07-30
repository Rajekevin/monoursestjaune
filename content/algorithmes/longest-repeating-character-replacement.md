---
title: "Longest Repeating Character Replacement"
description: "Dans une chaîne de lettres majuscules, tu peux remplacer au plus k caractères. Quelle est la plus longue sous-chaîne composée d'une SEULE le..."
category: "Algorithmes & Structures de données"
pattern: "Sliding Window"
difficulty: "Moyen"
number: 49
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "sliding-window"]
summary: "Dans une chaîne de lettres majuscules, tu peux remplacer au plus k caractères. Quelle est la plus longue sous-chaîne composée d'une SEULE lettre que tu peux obtenir ? Ex : s=\"AABABBA\", k=1 → 4."
---

## C'est quoi le problème, en clair ?

On vous donne une chaîne de lettres, et le droit de changer jusqu'à k lettres n'importe où dedans. Question : quelle est la plus longue portion CONTIGUE (des lettres qui se suivent) que vous pouvez transformer en une seule et même lettre répétée, grâce à ces k changements ? Par exemple, avec "AABABBA" et k=1, la réponse est 4. Imaginez une rangée de billes de couleurs différentes, avec le droit de repeindre k billes : vous cherchez le plus long segment que vous pouvez rendre entièrement uniforme en ne repeignant que les billes qui ne sont pas déjà de la couleur majoritaire de ce segment.

## L'idée clé

Reformulation magique : une fenêtre est « réparable » si (taille de la fenêtre) - (nombre d'occurrences de sa lettre MAJORITAIRE) ≤ k. On étend right ; si la fenêtre devient irréparable, on avance left d'un cran. La fenêtre ne rétrécit jamais : elle glisse en gardant la meilleure taille atteinte.

## Pourquoi cette solution ?

int[26] pour les fréquences + une variable maxFreq. Subtilité célèbre : on ne recalcule jamais maxFreq à la baisse quand left avance — c'est « périmé » mais sans danger, car seule une fenêtre PLUS GRANDE nous intéresse. Savoir justifier ce relâchement est un vrai marqueur de niveau.

## Solution Java

```java
class Solution {
    public int characterReplacement(String s, int k) {
        int[] freq = new int[26];
        int left = 0, maxFreq = 0, best = 0;

        for (int right = 0; right < s.length(); right++) {
            freq[s.charAt(right) - 'A']++;
            // Frequence de la lettre majoritaire de la fenetre (jamais reduite : sans danger)
            maxFreq = Math.max(maxFreq, freq[s.charAt(right) - 'A']);

            // Fenetre irreparable avec k remplacements : glisser left
            if ((right - left + 1) - maxFreq > k) {
                freq[s.charAt(left) - 'A']--;
                left++;
            }

            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
```

## Complexité

Temps O(N) : chaque caractère entre et sort de la fenêtre au plus une fois. Espace O(1) : 26 compteurs.
