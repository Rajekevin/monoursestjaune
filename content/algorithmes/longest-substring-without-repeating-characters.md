---
title: "Longest Substring Without Repeating Characters"
description: "Trouve la longueur de la plus longue SOUS-CHAÎNE (contiguë) sans caractère répété. Ex : \"abcabcbb\" → 3 (\"abc\")."
category: "Algorithmes & Structures de données"
pattern: "Sliding Window"
difficulty: "Moyen"
number: 48
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "sliding-window"]
summary: "Trouve la longueur de la plus longue SOUS-CHAÎNE (contiguë) sans caractère répété. Ex : \"abcabcbb\" → 3 (\"abc\")."
---

## C'est quoi le problème, en clair ?

On vous donne une chaîne de caractères, et vous devez trouver le plus long morceau CONTIGU (sans saut, des caractères qui se suivent) où aucune lettre n'apparaît deux fois. Par exemple, dans "abcabcbb", la réponse est "abc", de longueur 3. Imaginez que vous lisez un texte de gauche à droite en gardant un œil sur les lettres vues récemment : dès qu'une lettre revient, vous devez « oublier » tout ce qui précède sa première apparition et repartir juste après. Le problème consiste à trouver la plus longue portion que vous arrivez à garder sans jamais tomber sur ce genre de doublon.

## L'idée clé

Fenêtre glissante : une fenêtre [left, right] qui ne contient jamais de doublon. On étend right ; dès que le nouveau caractère est déjà dans la fenêtre, on contracte left jusqu'à évacuer le doublon. La fenêtre reste toujours valide, on note sa taille max.

## Pourquoi cette solution ?

Un HashSet des caractères de la fenêtre : contains/add/remove en O(1). Optimisation à connaître : une HashMap<char, dernier indice> permet de SAUTER left directement après l'ancien doublon au lieu de reculer pas à pas. La fenêtre glissante est LE pattern des sous-chaînes contiguës.

## Solution Java

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> window = new HashSet<>(); // caracteres presents dans la fenetre
        int left = 0, best = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);

            // Contracter la fenetre tant que c y est deja present
            while (window.contains(c)) {
                window.remove(s.charAt(left));
                left++;
            }

            window.add(c);
            best = Math.max(best, right - left + 1); // taille de la fenetre valide
        }
        return best;
    }
}
```

## Complexité

Temps O(N) : left et right avancent chacun au plus N fois (analyse amortie). Espace O(min(N, alphabet)) pour le set.
