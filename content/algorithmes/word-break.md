---
title: "Word Break"
description: "Une chaîne s peut-elle être découpée en une suite de mots appartenant tous à un dictionnaire (mots réutilisables) ? Ex : s=\"leetcode\", dict=..."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Moyen"
number: 78
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Une chaîne s peut-elle être découpée en une suite de mots appartenant tous à un dictionnaire (mots réutilisables) ? Ex : s=\"leetcode\", dict=[\"leet\",\"code\"] → vrai."
---

## C'est quoi le problème, en clair ?

On vous donne un mot collé sans espaces et une liste de mots valides (un dictionnaire), et vous devez dire s'il est possible de découper ce mot en une suite de mots qui existent tous dans le dictionnaire — un même mot pouvant être réutilisé plusieurs fois. C'est comme recevoir une pancarte publicitaire du genre « PROMOACHETEZMAINTENANT » et devoir vérifier si on peut la re-découper en mots du dictionnaire mis bout à bout. La technique consiste à avancer position par position dans le mot et à retenir, pour chaque préfixe déjà examiné, s'il est lui-même découpable — pour ne jamais refaire le même travail deux fois.

## L'idée clé

dp[i] = « le préfixe s[0..i) est découpable ». Il l'est si on trouve une coupe j telle que dp[j] est vrai ET s[j..i) est un mot du dictionnaire. On remplit de gauche à droite ; dp[0] = vrai (préfixe vide). La réponse est dp[n].

## Pourquoi cette solution ?

Convertir la liste en HashSet rend chaque test de mot O(1) (au lieu de O(dictionnaire)). Optimisation naturelle : borner la boucle interne à la longueur du plus long mot du dictionnaire. La récursion + mémoïsation est équivalente — présenter les deux angles est un plus.

## Solution Java

```java
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict); // lookup O(1)
        int n = s.length();

        boolean[] dp = new boolean[n + 1];
        dp[0] = true; // le prefixe vide est toujours "decoupable"

        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                // Coupe en j : prefixe decoupable + dernier morceau dans le dico ?
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break; // une seule coupe valide suffit
                }
            }
        }
        return dp[n];
    }
}
```

## Complexité

Temps O(N² × L) : double boucle sur les coupes, substring/hash en O(L). Espace O(N) pour dp + le set.
