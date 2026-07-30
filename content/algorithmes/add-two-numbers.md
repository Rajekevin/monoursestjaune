---
title: "Add Two Numbers"
description: "Deux nombres sont stockés en listes chaînées INVERSÉES (chiffre des unités en tête). Additionne-les et renvoie la somme sous la même forme. ..."
category: "Algorithmes & Structures de données"
pattern: "Linked List"
difficulty: "Moyen"
number: 56
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "linked-list"]
summary: "Deux nombres sont stockés en listes chaînées INVERSÉES (chiffre des unités en tête). Additionne-les et renvoie la somme sous la même forme. Ex : (2→4→3) + (5→6→4) = 342 + 465 = 807 → (7→0→8)."
---

## C'est quoi le problème, en clair ?

On vous donne deux nombres, mais écrits à l'envers et chiffre par chiffre dans une liste chaînée (une suite de maillons qui pointent chacun vers le suivant, comme un train de wagons attachés les uns aux autres). Il faut les additionner comme on le ferait à la main sur une feuille, colonne par colonne avec les retenues, et renvoyer le résultat sous la même forme de liste inversée. Pensez à une addition posée classique, sauf que chaque chiffre est écrit sur un post-it collé au précédent, en commençant par les unités plutôt que par le chiffre de gauche.

## L'idée clé

L'addition posée de l'école primaire : on avance colonne par colonne (unités, dizaines...), on additionne les deux chiffres + la retenue, on écrit sum % 10 et on propage sum / 10. L'ordre inversé des listes rend ça naturel : les unités arrivent en premier.

## Pourquoi cette solution ?

Dummy node pour construire la sortie ([Merge Two Sorted Lists](/algorithmes/merge-two-sorted-lists/)), et une condition de boucle qui couvre TOUT : l1 != null || l2 != null || carry != 0 — listes de longueurs différentes et retenue finale (99+1=100) sont gérées sans aucun code spécial. Le val = (x == null ? 0 : x.val) neutralise la liste la plus courte.

## Solution Java

```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int carry = 0;

        // Continuer tant qu'il reste des chiffres OU une retenue
        while (l1 != null || l2 != null || carry != 0) {
            int v1 = (l1 == null) ? 0 : l1.val; // 0 si liste epuisee
            int v2 = (l2 == null) ? 0 : l2.val;

            int sum = v1 + v2 + carry;
            carry = sum / 10;                    // nouvelle retenue
            tail.next = new ListNode(sum % 10);  // chiffre de cette colonne
            tail = tail.next;

            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        return dummy.next;
    }
}
```

## Complexité

Temps O(max(N, M)) : une itération par colonne. Espace O(max(N, M)) pour la liste résultat.
