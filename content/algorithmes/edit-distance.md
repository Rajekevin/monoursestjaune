---
title: "Edit Distance"
description: "Nombre MINIMAL d'opérations (insérer, supprimer, remplacer un caractère) pour transformer word1 en word2. Ex : \"horse\" → \"ros\" = 3. La dista..."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Difficile"
number: 94
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Nombre MINIMAL d'opérations (insérer, supprimer, remplacer un caractère) pour transformer word1 en word2. Ex : \"horse\" → \"ros\" = 3. La distance de Levenshtein, au cœur des correcteurs orthographiques."
---

## C'est quoi le problème, en clair ?

On vous donne deux mots et vous devez transformer le premier en le second en changeant le moins de lettres possible : vous avez le droit d'ajouter, de supprimer ou de remplacer une lettre à la fois, et chaque geste compte comme une opération. C'est exactement ce que fait un correcteur orthographique quand il vous propose un mot proche de celui que vous venez de taper par erreur : il calcule combien de petites retouches séparent votre faute du mot correct. Imaginez que vous réécrivez un mot sur une ardoise, lettre par lettre, et que chaque effaçage ou ajout compte comme un point : le but est de trouver le chemin le plus économique d'un mot à l'autre.

## L'idée clé

DP 2D sur les préfixes, cousine directe de LCS ([Longest Common Subsequence](/algorithmes/longest-common-subsequence/)) : dp[i][j] = distance entre les i premiers caractères de word1 et les j premiers de word2. Derniers caractères égaux → dp[i-1][j-1] (gratuit). Sinon → 1 + min(remplacer dp[i-1][j-1], supprimer dp[i-1][j], insérer dp[i][j-1]).

## Pourquoi cette solution ?

L'initialisation raconte l'histoire : dp[i][0] = i (tout supprimer), dp[0][j] = j (tout insérer). Savoir NOMMER l'opération derrière chacune des trois cases voisines est ce que l'interviewer vérifie — c'est la preuve qu'on comprend la table au lieu de la réciter. Compression possible à deux lignes O(min(N,M)).

## Solution Java

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int n = word1.length(), m = word2.length();
        int[][] dp = new int[n + 1][m + 1];

        // Cas de base : transformer un prefixe en chaine vide (et inversement)
        for (int i = 0; i <= n; i++) dp[i][0] = i; // i suppressions
        for (int j = 0; j <= m; j++) dp[0][j] = j; // j insertions

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1]; // caracteres identiques : gratuit
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j - 1],                    // remplacer
                        Math.min(dp[i - 1][j],               // supprimer dans word1
                                 dp[i][j - 1]));             // inserer dans word1
                }
            }
        }
        return dp[n][m];
    }
}
```

## Complexité

Temps O(N×M) : remplissage de la table. Espace O(N×M), réductible à O(min(N,M)) avec deux lignes.
