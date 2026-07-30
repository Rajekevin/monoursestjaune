---
title: "Basic Calculator"
description: "Évalue une expression arithmétique donnée en chaîne : entiers, +, -, parenthèses imbriquées et espaces (sans eval() bien sûr). Ex : \"(1+(4+5..."
category: "Algorithmes & Structures de données"
pattern: "Stack"
difficulty: "Difficile"
number: 100
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "stack"]
summary: "Évalue une expression arithmétique donnée en chaîne : entiers, +, -, parenthèses imbriquées et espaces (sans eval() bien sûr). Ex : \"(1+(4+5+2)-3)+(6+8)\" → 23."
---

## C'est quoi le problème, en clair ?

On vous donne une expression mathématique écrite en texte, avec des additions, des soustractions et des parenthèses imbriquées, du style « (1+(4+5+2)-3) ». Il faut la calculer vous-même, chiffre par chiffre, sans utiliser de fonction magique qui ferait le travail à votre place. C'est exactement ce que vous faites de tête en lisant une expression avec des parenthèses : vous gardez en mémoire où vous en étiez avant chaque parenthèse ouvrante pour pouvoir y revenir une fois qu'elle se referme — ici, cette mémoire prend la forme d'une pile (une pile d'assiettes où l'on ajoute et retire toujours par le dessus).

## L'idée clé

Une passe avec un résultat courant et un SIGNE courant (+1/-1). Les parenthèses = mettre le contexte en pause : à '(', on empile (résultat, signe) et on repart à zéro ; à ')', on dépile et on combine : résultat_extérieur + signe_extérieur × résultat_intérieur. La pile matérialise l'imbrication.

## Pourquoi cette solution ?

ArrayDeque<Integer> où l'on empile result puis sign (deux push) : plus léger qu'une classe de contexte. Construire les nombres multi-chiffres au vol (num = num*10 + chiffre). Le parsing d'expressions est un thème récurrent des entretiens seniors : celui-ci est la brique de base de toute la famille Calculator I/II/III.

## Solution Java

```java
class Solution {
    public int calculate(String s) {
        Deque<Integer> stack = new ArrayDeque<>();
        int result = 0; // resultat du contexte courant
        int sign = 1;   // signe du prochain nombre
        int num = 0;    // nombre en cours de construction

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                num = num * 10 + (c - '0'); // nombre multi-chiffres
            } else if (c == '+' || c == '-') {
                result += sign * num;       // appliquer le nombre termine
                num = 0;
                sign = (c == '+') ? 1 : -1;
            } else if (c == '(') {
                // Mettre le contexte en pause : empiler resultat puis signe
                stack.push(result);
                stack.push(sign);
                result = 0;
                sign = 1;
            } else if (c == ')') {
                result += sign * num;       // clore le contexte interieur
                num = 0;
                // Restaurer : signe puis resultat (ordre inverse du push)
                result = result * stack.pop() + stack.pop();
            }
            // Les espaces sont simplement ignores
        }
        return result + sign * num; // dernier nombre en attente
    }
}
```

## Complexité

Temps O(N) : chaque caractère traité une fois, opérations de pile O(1). Espace O(N) : la pile au pire pour des parenthèses très imbriquées.
