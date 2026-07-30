---
title: "Reverse Linked List"
description: "Inverse une liste chaînée simple et renvoie la nouvelle tête. Ex : 1→2→3→4 devient 4→3→2→1. Le problème de liste chaînée le plus posé en ent..."
category: "Algorithmes & Structures de données"
pattern: "Linked List"
difficulty: "Facile"
number: 11
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "linked-list"]
summary: "Inverse une liste chaînée simple et renvoie la nouvelle tête. Ex : 1→2→3→4 devient 4→3→2→1. Le problème de liste chaînée le plus posé en entretien, tous niveaux confondus."
---

## C'est quoi le problème, en clair ?

On vous donne une liste chaînée (une suite d'éléments reliés les uns aux autres, comme des wagons attachés dans un sens, voir [le glossaire](/glossaire-algorithmes/)) et il faut inverser le sens de la chaîne, pour que le dernier élément devienne le premier. C'est comme une file de wagons de train qu'il faut faire repartir en sens inverse : on détache chaque wagon un par un et on le raccroche pointant vers l'arrière plutôt que vers l'avant, jusqu'à ce que toute la file soit retournée.

## L'idée clé

On marche le long de la liste en retournant chaque flèche : le pointeur next de chaque nœud doit pointer vers le nœud PRÉCÉDENT. Il faut trois pointeurs : prev (déjà inversé), curr (en cours), et next (sauvegarde pour ne pas perdre la suite).

## Pourquoi cette solution ?

Version itérative en O(1) d'espace = la réponse attendue. L'ordre des 4 affectations dans la boucle est LE point critique : sauvegarder next AVANT de retourner la flèche. À savoir écrire les yeux fermés.

## Solution Java

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;   // debut : rien n'est encore inverse
        ListNode curr = head;

        while (curr != null) {
            ListNode next = curr.next; // 1. sauvegarder la suite avant de couper
            curr.next = prev;          // 2. retourner la fleche
            prev = curr;               // 3. avancer prev
            curr = next;               // 4. avancer curr
        }
        // A la fin, curr == null et prev est la nouvelle tete
        return prev;
    }
}
```

## Complexité

Temps O(N) : un seul passage. Espace O(1) : trois pointeurs, aucune structure auxiliaire (la version récursive coûterait O(N) de pile).
