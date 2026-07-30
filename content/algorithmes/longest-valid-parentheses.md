---
title: "Longest Valid Parentheses"
description: "Dans une chaîne de '(' et ')', trouve la longueur de la plus longue SOUS-CHAÎNE contiguë de parenthèses bien formées. Ex : \")()())\" → 4 (\"()..."
category: "Algorithmes & Structures de données"
pattern: "Stack"
difficulty: "Difficile"
number: 97
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "stack"]
summary: "Dans une chaîne de '(' et ')', trouve la longueur de la plus longue SOUS-CHAÎNE contiguë de parenthèses bien formées. Ex : \")()())\" → 4 (\"()()\")."
---

## C'est quoi le problème, en clair ?

On vous donne une chaîne composée uniquement de parenthèses ouvrantes '(' et fermantes ')', pas forcément bien organisées. Vous devez trouver la plus longue portion CONTIGUE qui forme un bloc de parenthèses correctement fermées, comme dans une formule mathématique valide. Par exemple, dans ")()())", le plus long bloc valide est "()()", de longueur 4. Imaginez que vous lisez la chaîne comme une suite de portes qui s'ouvrent et se ferment : dès qu'une porte fermée n'a pas de porte ouverte correspondante avant elle, tout ce qui la précède devient inutilisable, et le compte recommence juste après.

## L'idée clé

Pile d'INDICES avec une sentinelle : on empile -1 comme « base » initiale. '(' → empiler son indice. ')' → dépiler ; si la pile devient vide, cette ')' est orpheline et devient la NOUVELLE base ; sinon, la longueur valide courante = indice actuel - indice au sommet. Le sommet représente toujours « le dernier point invalide ».

## Pourquoi cette solution ?

C'est la version subtile de Valid Parentheses ([Valid Parentheses](/algorithmes/valid-parentheses/)) : on ne valide pas, on MESURE. La pile d'indices (pas de caractères) est le twist. Alternative O(1) d'espace à citer : double passe gauche→droite puis droite→gauche avec deux compteurs — la connaître montre une vraie profondeur de préparation.

## Solution Java

```java
class Solution {
    public int longestValidParentheses(String s) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(-1); // sentinelle : base avant le debut
        int best = 0;

        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                stack.push(i); // indice de l'ouvrante en attente
            } else {
                stack.pop();   // tenter d'apparier avec la derniere ouvrante
                if (stack.isEmpty()) {
                    // ')' orpheline : elle devient la nouvelle base invalide
                    stack.push(i);
                } else {
                    // Longueur du bloc valide finissant ici
                    best = Math.max(best, i - stack.peek());
                }
            }
        }
        return best;
    }
}
```

## Complexité

Temps O(N) : une passe, chaque indice empilé/dépilé au plus une fois. Espace O(N) pour la pile au pire.
