---
title: "Remove Nth Node From End of List"
description: "Supprime le N-ième nœud EN PARTANT DE LA FIN d'une liste chaînée, en une seule passe, et renvoie la tête."
category: "Algorithmes & Structures de données"
pattern: "Linked List"
difficulty: "Moyen"
number: 55
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "linked-list"]
summary: "Supprime le N-ième nœud EN PARTANT DE LA FIN d'une liste chaînée, en une seule passe, et renvoie la tête."
---

## C'est quoi le problème, en clair ?

On vous donne une liste chaînée (une suite d'éléments reliés les uns aux autres comme des wagons de train, voir [le glossaire](/glossaire-algorithmes/)) et il faut supprimer le énième élément EN PARTANT DE LA FIN, en une seule traversée de la liste. Imaginez une file de wagons dont vous ne connaissez pas la longueur totale : pour trouver le wagon à N places de la fin sans compter tous les wagons deux fois, vous envoyez un premier éclaireur N wagons en avance, puis vous avancez les deux en même temps — quand l'éclaireur arrive au bout, l'autre est juste à la bonne place.

## L'idée clé

Deux pointeurs décalés de N crans : on avance d'abord fast de N pas, puis fast et slow avancent ensemble. Quand fast atteint la fin, slow est pile DEVANT le nœud à supprimer — l'écart constant fait tout le travail, sans connaître la longueur.

## Pourquoi cette solution ?

Le dummy node (déjà croisé dans [Merge Two Sorted Lists](/algorithmes/merge-two-sorted-lists/)) est indispensable ici : si le nœud à supprimer est la TÊTE elle-même, slow doit pouvoir être « avant la tête ». Partir de dummy élimine ce cas spécial — le réflexe anti-bug des listes chaînées.

## Solution Java

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode fast = dummy, slow = dummy;

        // Creer un ecart de n+1 entre fast et slow
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        // Avancer ensemble : quand fast sort, slow est devant la cible
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }

        // Sauter le noeud a supprimer
        slow.next = slow.next.next;

        return dummy.next;
    }
}
```

## Complexité

Temps O(N) : une seule passe. Espace O(1).
