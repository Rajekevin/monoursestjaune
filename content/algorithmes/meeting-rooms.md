---
title: "Meeting Rooms"
description: "On te donne des réunions sous forme d'intervalles [début, fin]. Une seule personne peut-elle assister à TOUTES les réunions (aucun chevauche..."
category: "Algorithmes & Structures de données"
pattern: "Intervals"
difficulty: "Facile"
number: 40
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "intervals"]
summary: "On te donne des réunions sous forme d'intervalles [début, fin]. Une seule personne peut-elle assister à TOUTES les réunions (aucun chevauchement) ?"
---

## C'est quoi le problème, en clair ?

On vous donne une liste de réunions, chacune avec une heure de début et une heure de fin, et vous devez répondre à une question simple : une seule et même personne peut-elle assister à TOUTES ces réunions, sans qu'aucune n'empiète sur une autre ? Imaginez votre agenda de la journée : s'il y a le moindre chevauchement entre deux rendez-vous, vous ne pouvez pas être aux deux en même temps, et la réponse est non. L'astuce pour répondre vite est de d'abord trier les réunions par heure de début : une fois triées, il suffit de comparer chaque réunion à celle qui la précède immédiatement, plutôt que de comparer toutes les paires possibles entre elles.

## L'idée clé

Une fois les réunions TRIÉES par heure de début, il suffit de vérifier chaque paire de voisines : si une réunion commence avant la fin de la précédente, il y a conflit. Le tri transforme un problème de comparaison « tous contre tous » (O(N²)) en une simple passe.

## Pourquoi cette solution ?

Arrays.sort avec un comparateur lambda sur la borne de début : (a, b) -> a[0] - b[0]. Le réflexe « trier les intervalles par début puis balayer » est LA porte d'entrée de toute la famille Intervals (Merge Intervals [Merge Intervals](/algorithmes/merge-intervals/), etc.).

## Solution Java

```java
class Solution {
    public boolean canAttendMeetings(int[][] intervals) {
        // Trier par heure de debut
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

        for (int i = 1; i < intervals.length; i++) {
            // La reunion i commence-t-elle avant la fin de la precedente ?
            if (intervals[i][0] < intervals[i - 1][1]) {
                return false; // chevauchement : impossible d'assister aux deux
            }
        }
        return true;
    }
}
```

## Complexité

Temps O(N log N) : dominé par le tri, la passe est en O(N). Espace O(1) (ou O(log N) pour la pile du tri).
