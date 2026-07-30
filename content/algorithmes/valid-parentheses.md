---
title: "Valid Parentheses"
description: "Une chaîne ne contient que les caractères ( ) { } [ ]. Dis si elle est « valide » : chaque parenthèse ouvrante doit être fermée par le même ..."
category: "Algorithmes & Structures de données"
pattern: "Stack"
difficulty: "Facile"
number: 2
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "stack"]
summary: "Une chaîne ne contient que les caractères ( ) { } [ ]. Dis si elle est « valide » : chaque parenthèse ouvrante doit être fermée par le même type, dans le bon ordre. Ex : \"()[]{}\" est valide, \"(]\" ne l'est pas."
---

## C'est quoi le problème, en clair ?

On vous donne une chaîne composée uniquement de parenthèses, crochets et accolades, et vous devez vérifier qu'ils s'emboîtent correctement : chaque symbole ouvrant doit être refermé par le bon symbole fermant, dans le bon ordre. C'est comme empiler des assiettes ou des poupées russes : la dernière ouverte doit être la première refermée, sinon tout s'écroule. Cette idée de « dernier arrivé, premier reparti » correspond exactement à une pile (une structure détaillée dans le [glossaire](/glossaire-algorithmes/)), où l'on empile chaque symbole ouvrant et on vérifie qu'il correspond bien dès qu'on croise un symbole fermant.

## L'idée clé

Le dernier ouvert doit être le premier fermé — c'est la définition exacte d'une PILE (LIFO : Last In, First Out). Quand on croise une ouvrante, on l'empile. Quand on croise une fermante, elle doit correspondre au sommet de la pile.

## Pourquoi cette solution ?

On utilise ArrayDeque comme pile (push/pop en O(1)), plus moderne et rapide que la vieille classe Stack. Astuce d'élégance : on empile directement la fermante ATTENDUE, ce qui réduit la comparaison à un simple equals.

## Solution Java

```java
class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            if (c == '(')      stack.push(')'); // on empile la fermante attendue
            else if (c == '[') stack.push(']');
            else if (c == '{') stack.push('}');
            else {
                // c est une fermante : elle doit correspondre au sommet.
                // Pile vide = fermante orpheline -> invalide.
                if (stack.isEmpty() || stack.pop() != c) return false;
            }
        }
        // Valide seulement si toutes les ouvrantes ont ete fermees
        return stack.isEmpty();
    }
}
```

## Complexité

Temps O(N) : chaque caractère est empilé/dépilé au plus une fois. Espace O(N) : pire cas "((((..." où tout finit dans la pile.
