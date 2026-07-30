---
title: "Daily Temperatures"
description: "Pour chaque jour, combien de jours faut-il attendre avant une température PLUS CHAUDE ? (0 si jamais). Ex : [73,74,75,71,69,72,76,73] → [1,1..."
category: "Algorithmes & Structures de données"
pattern: "Stack"
difficulty: "Moyen"
number: 64
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "stack"]
summary: "Pour chaque jour, combien de jours faut-il attendre avant une température PLUS CHAUDE ? (0 si jamais). Ex : [73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]."
---

## C'est quoi le problème, en clair ?

On vous donne la température de chaque jour, et pour chaque jour, vous devez dire combien de jours il faudra attendre avant qu'il fasse plus chaud (0 si ça n'arrive jamais). Imaginez que vous notez chaque jour dans un carnet en attendant qu'un jour plus chaud vienne « répondre » à cette attente : dès qu'un jour plus chaud se présente, il coche d'un coup tous les jours plus froids qui patientaient encore avant lui.

## L'idée clé

Pile MONOTONE décroissante : on empile les indices des jours « en attente de plus chaud ». Quand un jour plus chaud arrive, il « résout » tous les jours en attente plus froids que lui (on les dépile en calculant l'écart). Chaque jour est empilé et dépilé au plus une fois : O(N) malgré la boucle imbriquée.

## Pourquoi cette solution ?

ArrayDeque d'INDICES (pas de valeurs : il nous faut les positions pour calculer les distances). La pile monotone est un des patterns moyens les plus rentables : Next Greater Element, Largest Rectangle in Histogram ([Largest Rectangle in Histogram](/algorithmes/largest-rectangle-in-histogram/)), Trapping Rain Water ([Trapping Rain Water](/algorithmes/trapping-rain-water/)) en dérivent tous.

## Solution Java

```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // indices en attente, temp decroissantes

        for (int today = 0; today < n; today++) {
            // Aujourd'hui resout tous les jours en attente plus froids que lui
            while (!stack.isEmpty()
                   && temperatures[today] > temperatures[stack.peek()]) {
                int waitingDay = stack.pop();
                answer[waitingDay] = today - waitingDay; // nb de jours attendus
            }
            stack.push(today); // aujourd'hui attend a son tour
        }
        // Les indices restes dans la pile gardent 0 : jamais plus chaud ensuite
        return answer;
    }
}
```

## Complexité

Temps O(N) amorti : chaque indice fait exactement un push et au plus un pop. Espace O(N) pour la pile au pire.
