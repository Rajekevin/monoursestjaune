---
title: "Linked List Cycle"
description: "Détermine si une liste chaînée contient un cycle (un nœud dont le next pointe vers un nœud précédent de la liste, créant une boucle infinie)..."
category: "Algorithmes & Structures de données"
pattern: "Linked List"
difficulty: "Facile"
number: 16
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "linked-list"]
summary: "Détermine si une liste chaînée contient un cycle (un nœud dont le next pointe vers un nœud précédent de la liste, créant une boucle infinie)."
---

## C'est quoi le problème, en clair ?

Une liste chaînée, c'est une suite d'éléments où chacun pointe simplement vers le suivant, comme une chaîne de wagons de train (voir [le glossaire](/glossaire-algorithmes/) si le terme est nouveau pour vous). Le problème : parfois, par erreur, le dernier wagon ne pointe pas vers « rien » mais renvoie vers un wagon déjà passé plus tôt dans la chaîne, créant une boucle sans fin. Il faut détecter si une telle boucle existe, sans pouvoir « voir » toute la liste d'un coup d'œil. Imaginez deux coureurs sur une piste : si la piste forme un cercle fermé, le plus rapide finira forcément par rattraper le plus lent, alors que sur une piste droite, il atteint simplement la ligne d'arrivée en premier.

## L'idée clé

L'algorithme du lièvre et de la tortue (Floyd) : deux pointeurs partent de la tête, l'un avance de 1, l'autre de 2. S'il y a un cycle, le rapide finit forcément par « rattraper » le lent à l'intérieur de la boucle, comme deux coureurs sur une piste circulaire. Sans cycle, le rapide atteint null.

## Pourquoi cette solution ?

Le HashSet de nœuds visités marche mais coûte O(N) d'espace ; Floyd fait le job en O(1) — c'est la réponse attendue. Ce pattern « slow/fast pointers » resservira pour trouver le milieu d'une liste ([Middle of the Linked List](/algorithmes/middle-of-the-linked-list/)) et détecter le début du cycle.

## Solution Java

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head; // la tortue : avance de 1
        ListNode fast = head; // le lievre : avance de 2

        // Tant que le lievre peut faire ses deux pas
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            // Le lievre a rattrape la tortue : cycle !
            if (slow == fast) return true;
        }
        // Le lievre a atteint la fin : pas de cycle
        return false;
    }
}
```

## Complexité

Temps O(N) : le lent fait au plus N pas avant la rencontre. Espace O(1) : deux pointeurs, c'est tout l'intérêt face au HashSet.
