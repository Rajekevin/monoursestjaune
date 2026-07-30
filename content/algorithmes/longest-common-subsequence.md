---
title: "Longest Common Subsequence"
description: "Longueur de la plus longue sous-suite commune à deux chaînes (mêmes caractères, même ordre, sauts autorisés). Ex : \"abcde\" et \"ace\" → 3. La ..."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Moyen"
number: 80
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Longueur de la plus longue sous-suite commune à deux chaînes (mêmes caractères, même ordre, sauts autorisés). Ex : \"abcde\" et \"ace\" → 3. La base de git diff et des outils de comparaison."
---

## C'est quoi le problème, en clair ?

On vous donne deux textes, et vous devez trouver la plus longue suite de caractères qu'ils ont en commun, dans le même ordre — mais pas forcément collés : on a le droit de « sauter » des caractères dans l'un comme dans l'autre. Par exemple, dans "abcde" et "ace", la plus longue suite commune est "ace" (3 caractères), même si elle n'apparaît pas d'un seul bloc dans "abcde". Imaginez deux versions d'un même document que vous comparez avec un outil comme git diff : il ne se contente pas de repérer les lignes identiques, il cherche le plus long fil conducteur commun aux deux versions pour savoir ce qui a vraiment changé. C'est exactement ce problème, réduit à sa forme la plus simple.

## L'idée clé

DP 2D : dp[i][j] = LCS des préfixes text1[0..i) et text2[0..j). Si les derniers caractères coïncident, dp[i][j] = dp[i-1][j-1] + 1 (on les apparie) ; sinon dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (on saute un caractère de l'une ou de l'autre).

## Pourquoi cette solution ?

La table (N+1)×(M+1) avec la ligne/colonne 0 = 0 (préfixe vide) élimine tout cas particulier d'indices. C'est la DP 2D fondatrice : Edit Distance ([Edit Distance](/algorithmes/edit-distance/)) et une dizaine de problèmes de chaînes reprennent exactement ce cadre — la maîtriser débloque toute la famille.

## Solution Java

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int n = text1.length(), m = text2.length();
        // dp[i][j] = LCS des i premiers caracteres de text1 et j premiers de text2
        int[][] dp = new int[n + 1][m + 1]; // ligne/colonne 0 : prefixe vide -> 0

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    // Caracteres identiques : les apparier
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    // Sinon : sauter un caractere d'une des deux chaines
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[n][m];
    }
}
```

## Complexité

Temps O(N×M) : remplir la table. Espace O(N×M), compressible à O(min(N,M)) avec deux lignes glissantes — l'optimisation à citer.
