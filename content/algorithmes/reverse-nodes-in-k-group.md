---
title: "Reverse Nodes in k-Group"
description: "Inverse une liste chaînée par blocs de k nœuds : 1→2→3→4→5 avec k=2 devient 2→1→4→3→5. Un groupe incomplet en fin de liste reste tel quel. L..."
category: "Algorithmes & Structures de données"
pattern: "Linked List"
difficulty: "Difficile"
number: 86
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "linked-list"]
summary: "Inverse une liste chaînée par blocs de k nœuds : 1→2→3→4→5 avec k=2 devient 2→1→4→3→5. Un groupe incomplet en fin de liste reste tel quel. Le test ultime de manipulation de pointeurs."
---

## C'est quoi le problème, en clair ?

On vous donne une liste chaînée (une suite d'éléments reliés en chaîne, voir [le glossaire](/glossaire-algorithmes/)) et il faut inverser l'ordre des éléments, mais par petits paquets de k à la fois, plutôt que sur toute la liste d'un coup — si un dernier paquet est incomplet, on le laisse tel quel. Imaginez une file de wagons qu'on découpe en groupes de k wagons : pour chaque groupe, on inverse l'ordre des wagons à l'intérieur avant de les rattacher à la file, comme si on remontait des petits trains miniatures un par un.

## L'idée clé

Par groupe : (1) vérifier qu'il reste bien k nœuds (sinon stop), (2) inverser ces k nœuds avec la mécanique du [Reverse Linked List](/algorithmes/reverse-linked-list/), (3) recoudre : le prédécesseur du groupe pointe vers la nouvelle tête, l'ancienne tête (devenue queue) pointe vers la suite. Un pointeur groupPrev suit la couture entre les groupes.

## Pourquoi cette solution ?

Dummy node + inversion locale bornée par un compteur k : aucune structure, pure chirurgie de pointeurs. Le conseil qui sauve : DESSINER les 4 pointeurs (groupPrev, tête du groupe, kième nœud, suivant du groupe) avant d'écrire une ligne — ce problème se perd sans schéma.

## Solution Java

```java
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode groupPrev = dummy; // noeud juste avant le groupe courant

        while (true) {
            // 1. Trouver le k-ieme noeud du groupe ; s'il manque, on a fini
            ListNode kth = groupPrev;
            for (int i = 0; i < k && kth != null; i++) {
                kth = kth.next;
            }
            if (kth == null) break;

            ListNode groupNext = kth.next;      // debut du groupe suivant
            // 2. Inverser le groupe : on s'arrete quand on atteint groupNext
            ListNode prev = groupNext;          // la queue pointera vers la suite
            ListNode curr = groupPrev.next;     // tete actuelle du groupe
            while (curr != groupNext) {
                ListNode next = curr.next;
                curr.next = prev;
                prev = curr;
                curr = next;
            }

            // 3. Recoudre : l'ancienne tete est devenue la queue
            ListNode oldHead = groupPrev.next;
            groupPrev.next = kth;               // le predecesseur pointe la nouvelle tete
            groupPrev = oldHead;                // la couture avance a la fin du groupe
        }
        return dummy.next;
    }
}
```

## Complexité

Temps O(N) : chaque nœud est compté puis inversé une fois. Espace O(1) : tout se fait par recâblage.
