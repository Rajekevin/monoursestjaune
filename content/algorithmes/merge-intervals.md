---
title: "Merge Intervals"
description: "Fusionne tous les intervalles qui se chevauchent. Ex : [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]."
category: "Algorithmes & Structures de données"
pattern: "Intervals"
difficulty: "Moyen"
number: 45
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "intervals"]
summary: "Fusionne tous les intervalles qui se chevauchent. Ex : [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]."
---

## C'est quoi le problème, en clair ?

On vous donne une liste d'intervalles — des plages définies par un début et une fin, comme des créneaux horaires — et vous devez fusionner ceux qui se chevauchent en un seul intervalle plus large. Par exemple, [[1,3],[2,6],[8,10],[15,18]] devient [[1,6],[8,10],[15,18]], parce que [1,3] et [2,6] se recouvrent partiellement. Imaginez plusieurs réservations de salle qui se chevauchent sur votre planning : au lieu de les garder séparées, vous les regroupez en un seul bloc occupé, du tout premier début au tout dernier moment de fin concerné. Comme pour [Meeting Rooms](/algorithmes/meeting-rooms/), trier d'abord les intervalles par leur début rend tout le reste beaucoup plus simple.

## L'idée clé

Après TRI par borne de début, deux intervalles à fusionner sont forcément voisins. On balaie : si l'intervalle courant commence avant (ou à) la fin du dernier intervalle fusionné, on étend cette fin (max des deux fins) ; sinon on ouvre un nouvel intervalle. Le tri linéarise tout le problème.

## Pourquoi cette solution ?

Arrays.sort avec lambda + une List<int[]> pour construire le résultat (taille finale inconnue), convertie en tableau via toArray(new int[0][]). Modifier le DERNIER élément de la liste (getLast / get(size-1)) plutôt que d'en créer un nouveau : c'est ce qui rend le code net.

## Solution Java

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        // 1. Trier par borne de debut
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

        List<int[]> merged = new ArrayList<>();
        merged.add(intervals[0]);

        for (int i = 1; i < intervals.length; i++) {
            int[] last = merged.get(merged.size() - 1);
            int[] current = intervals[i];

            if (current[0] <= last[1]) {
                // Chevauchement : etendre la fin du dernier intervalle fusionne
                last[1] = Math.max(last[1], current[1]);
            } else {
                // Pas de chevauchement : nouvel intervalle independant
                merged.add(current);
            }
        }
        return merged.toArray(new int[0][]);
    }
}
```

## Complexité

Temps O(N log N) : le tri domine, la fusion est en O(N). Espace O(N) pour la liste résultat.
