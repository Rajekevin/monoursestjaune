---
title: "Reorder List"
description: "Réordonne une liste L0→L1→...→Ln en L0→Ln→L1→Ln-1→L2→... en place, sans modifier les valeurs (uniquement les pointeurs)."
category: "Algorithmes & Structures de données"
pattern: "Linked List"
difficulty: "Moyen"
number: 54
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "linked-list"]
summary: "Réordonne une liste L0→L1→...→Ln en L0→Ln→L1→Ln-1→L2→... en place, sans modifier les valeurs (uniquement les pointeurs)."
---

## C'est quoi le problème, en clair ?

On vous donne une liste chaînée (des éléments reliés en chaîne, voir [le glossaire](/glossaire-algorithmes/)) et il faut la réordonner en alternant un élément du début et un élément de la fin : premier, dernier, deuxième, avant-dernier, etc. — comme quand on distribue des cartes en zigzag entre le haut et le bas d'un paquet. La méthode la plus simple est de couper la liste en deux moitiés égales, de retourner la seconde moitié à l'envers, puis d'entrelacer les deux moitiés une carte à la fois.

## L'idée clé

Trois techniques déjà apprises, enchaînées : (1) trouver le MILIEU avec slow/fast ([Middle of the Linked List](/algorithmes/middle-of-the-linked-list/)), (2) INVERSER la seconde moitié ([Reverse Linked List](/algorithmes/reverse-linked-list/)), (3) FUSIONNER les deux moitiés en alternant un nœud de chaque. Ce problème est un test d'assemblage, pas de découverte.

## Pourquoi cette solution ?

Zéro structure auxiliaire : tout se fait par recâblage de pointeurs, en O(1) d'espace (la version « copier dans une ArrayList puis recâbler » coûte O(N) — bon plan B à mentionner si tu bloques). Bien COUPER la liste au milieu (slow.next = null) évite les cycles accidentels.

## Solution Java

```java
class Solution {
    public void reorderList(ListNode head) {
        // 1. Trouver le milieu (slow s'arrete a la fin de la 1re moitie)
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // 2. Couper, puis inverser la seconde moitie
        ListNode second = slow.next;
        slow.next = null; // IMPORTANT : couper pour eviter un cycle
        ListNode prev = null;
        while (second != null) {
            ListNode next = second.next;
            second.next = prev;
            prev = second;
            second = next;
        }

        // 3. Fusionner en alternance : first, prev, first, prev...
        ListNode first = head;
        second = prev;
        while (second != null) {
            ListNode t1 = first.next, t2 = second.next;
            first.next = second;
            second.next = t1;
            first = t1;
            second = t2;
        }
    }
}
```

## Complexité

Temps O(N) : trois passes linéaires. Espace O(1) : uniquement des recâblages de pointeurs.
