---
title: "Regular Expression Matching"
description: "Implémente un matching de regex complet entre s et un pattern p supportant '.' (n'importe quel caractère) et '*' (zéro ou plusieurs occurren..."
category: "Algorithmes & Structures de données"
pattern: "DP"
difficulty: "Difficile"
number: 95
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "dp"]
summary: "Implémente un matching de regex complet entre s et un pattern p supportant '.' (n'importe quel caractère) et '*' (zéro ou plusieurs occurrences du caractère PRÉCÉDENT). Le match doit couvrir toute la chaîne."
---

## C'est quoi le problème, en clair ?

Il faut vérifier si un texte correspond à un motif de recherche (comme ceux qu'on utilise pour filtrer des fichiers), où le point « . » remplace n'importe quel caractère et l'étoile « * » veut dire « le caractère précédent peut apparaître zéro, une ou plusieurs fois ». C'est un peu comme un gabarit flexible qu'on essaie de superposer sur un texte : à chaque endroit où il y a une étoile, on a le choix — ignorer complètement ce morceau du motif, ou l'utiliser une fois de plus — et il faut explorer méthodiquement toutes ces possibilités sans tout recalculer à chaque fois (une technique appelée programmation dynamique, voir [le glossaire](/glossaire-algorithmes/)).

## L'idée clé

DP 2D : dp[i][j] = « s[0..i) matche p[0..j) ». Tout tourne autour de '*', qui offre deux options : (a) zéro occurrence → ignorer la paire « x* » (dp[i][j-2]) ; (b) une occurrence de plus → si s[i-1] matche x, consommer un caractère de s (dp[i-1][j]). Un OU logique entre les deux.

## Pourquoi cette solution ?

L'initialisation de la ligne 0 est piégeuse : une chaîne vide peut matcher "a*b*c*" (chaque étoile prend zéro occurrence) → dp[0][j] = dp[0][j-2] si p[j-1] == '*'. Une fonction matches(sc, pc) qui gère '.' garde les transitions lisibles. Un des hards de référence chez Google — à préparer, pas à improviser.

## Solution Java

```java
class Solution {
    public boolean isMatch(String s, String p) {
        int n = s.length(), m = p.length();
        // dp[i][j] : s[0..i) matche p[0..j) ?
        boolean[][] dp = new boolean[n + 1][m + 1];
        dp[0][0] = true; // vide matche vide

        // Chaine vide contre pattern : seuls les "x*" effacables matchent
        for (int j = 2; j <= m; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[0][j] = dp[0][j - 2];
            }
        }

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                char pc = p.charAt(j - 1);

                if (pc == '*') {
                    char prev = p.charAt(j - 2); // caractere repete par l'etoile
                    // (a) zero occurrence : ignorer "prev*"
                    dp[i][j] = dp[i][j - 2];
                    // (b) une occurrence de plus : prev doit matcher s[i-1]
                    if (matches(s.charAt(i - 1), prev)) {
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                    }
                } else if (matches(s.charAt(i - 1), pc)) {
                    dp[i][j] = dp[i - 1][j - 1]; // caractere simple qui matche
                }
            }
        }
        return dp[n][m];
    }

    private boolean matches(char sc, char pc) {
        return pc == '.' || sc == pc;
    }
}
```

## Complexité

Temps O(N×M) : chaque case de la table calculée une fois. Espace O(N×M).
