---
title: "Merge Two Sorted Lists"
description: "On te donne les têtes de deux listes chaînées TRIÉES. Fusionne-les en une seule liste triée en réutilisant les nœuds existants, et renvoie l..."
category: "Algorithmes & Structures de données"
pattern: "Linked List"
difficulty: "Facile"
number: 3
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "linked-list"]
summary: "On te donne les têtes de deux listes chaînées TRIÉES. Fusionne-les en une seule liste triée en réutilisant les nœuds existants, et renvoie la tête de la nouvelle liste."
---

## C'est quoi le problème, en clair ?

On vous donne deux listes chaînées déjà triées — une liste chaînée, c'est une suite de valeurs reliées les unes aux autres comme des wagons de train, plutôt que rangées dans des cases numérotées (voir le [glossaire](/glossaire-algorithmes/)) — et vous devez les fusionner en une seule liste triée, en réutilisant les wagons existants plutôt qu'en en créant de nouveaux. Imaginez que vous fusionnez deux paquets de cartes déjà triés en un seul : vous regardez toujours la carte du dessus de chaque paquet, vous prenez la plus petite des deux, et vous recommencez jusqu'à épuiser les deux paquets. Le seul piège technique est de bien démarrer la nouvelle liste sans cas particulier — d'où l'usage d'un « nœud factice » de départ, qu'on jette une fois la liste construite.

## L'idée clé

Comme quand on fusionne deux paquets de cartes triés : on compare les deux cartes du dessus et on prend la plus petite, encore et encore. Le piège classique est la gestion de la tête → on le neutralise avec un nœud factice (« dummy node »), un sentinel qui évite tous les if spéciaux.

## Pourquoi cette solution ?

Le dummy node est un pattern à connaître par cœur pour TOUTES les constructions de listes chaînées : on construit derrière lui, puis on renvoie dummy.next. Pas de structure auxiliaire : on recâble simplement les pointeurs existants.

## Solution Java

```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        // Noeud factice : simplifie la construction (pas de cas special pour la tete)
        ListNode dummy = new ListNode(-1);
        ListNode tail = dummy; // pointeur vers le dernier noeud construit

        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {   // on prend le plus petit des deux
                tail.next = l1;
                l1 = l1.next;
            } else {
                tail.next = l2;
                l2 = l2.next;
            }
            tail = tail.next;         // on avance la queue
        }

        // Une des deux listes est epuisee : on raccroche le reste de l'autre
        tail.next = (l1 != null) ? l1 : l2;

        return dummy.next; // la vraie tete est juste apres le factice
    }
}
```

## Complexité

Temps O(N + M) : chaque nœud des deux listes est visité une fois. Espace O(1) : on ne crée qu'un dummy, on recycle les nœuds existants.
