---
title: "Middle of the Linked List"
description: "Renvoie le nœud du MILIEU d'une liste chaînée. Si la liste a un nombre pair de nœuds, renvoie le second des deux nœuds du milieu."
category: "Algorithmes & Structures de données"
pattern: "Linked List"
difficulty: "Facile"
number: 35
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "linked-list"]
summary: "Renvoie le nœud du MILIEU d'une liste chaînée. Si la liste a un nombre pair de nœuds, renvoie le second des deux nœuds du milieu."
---

## C'est quoi le problème, en clair ?

On vous donne une liste chaînée — une suite de valeurs reliées les unes aux autres comme des wagons de train, qu'on ne peut parcourir que dans l'ordre (voir le [glossaire](/glossaire-algorithmes/)) — et vous devez trouver le wagon du milieu. S'il y a un nombre pair de wagons, on demande le second des deux wagons centraux. Le problème, c'est qu'on ne connaît pas la longueur totale à l'avance sans la parcourir une première fois. L'image classique est celle du lièvre et de la tortue sur la même piste : la tortue avance d'un wagon à la fois, le lièvre de deux, et quand le lièvre arrive au bout, la tortue se trouve pile au milieu, sans qu'on ait eu besoin de compter les wagons au préalable.

## L'idée clé

Encore le lièvre et la tortue ([Linked List Cycle](/algorithmes/linked-list-cycle/)), utilisé autrement : quand le rapide (2 pas) atteint la fin, le lent (1 pas) est pile au milieu. Une seule passe, sans compter la longueur d'abord.

## Pourquoi cette solution ?

La solution « compter puis re-parcourir jusqu'à N/2 » fait deux passes ; slow/fast en fait une seule avec O(1) d'espace. Ce positionnement au milieu est la première étape de Reorder List ([Reorder List](/algorithmes/reorder-list/)) et du tri fusion de listes — à automatiser.

## Solution Java

```java
class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        // Quand fast atteint la fin, slow est au milieu
        while (fast != null && fast.next != null) {
            slow = slow.next;       // 1 pas
            fast = fast.next.next;  // 2 pas
        }
        return slow;
    }
}
```

## Complexité

Temps O(N) : le pointeur rapide traverse la liste une fois. Espace O(1).
