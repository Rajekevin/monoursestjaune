---
title: "Course Schedule"
description: "N cours, avec des prérequis [a, b] signifiant « b avant a ». Peut-on suivre TOUS les cours ? (Impossible si les prérequis forment un cycle.)"
category: "Algorithmes & Structures de données"
pattern: "Graphs"
difficulty: "Moyen"
number: 73
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "graphs"]
summary: "N cours, avec des prérequis [a, b] signifiant « b avant a ». Peut-on suivre TOUS les cours ? (Impossible si les prérequis forment un cycle.)"
---

## C'est quoi le problème, en clair ?

Vous devez suivre plusieurs cours, mais certains ont des prérequis (il faut avoir suivi le cours B avant de pouvoir suivre le cours A). La question est simple : est-il possible de tous les suivre dans un ordre valide, ou est-ce que les prérequis se bloquent mutuellement en boucle ? Imaginez un emploi du temps universitaire où le cours A demande le cours B, qui demande lui-même le cours A : ce genre de cercle vicieux rend le programme impossible à suivre, et c'est exactement ce qu'il faut détecter.

## L'idée clé

Modéliser en graphe orienté : « peut-on tout suivre » = « le graphe est-il ACYCLIQUE ». Algorithme de Kahn (tri topologique par BFS) : on retire en boucle les cours sans prérequis restant (in-degree 0), en décrémentant l'in-degree de leurs successeurs. Si on ne peut pas tout retirer, un cycle bloque.

## Pourquoi cette solution ?

Liste d'adjacence List<List<Integer>> + tableau inDegree[] + ArrayDeque : le trio standard de Kahn. Compter les cours traités et comparer à N donne la réponse. Le tri topologique est LE sujet graphe des entretiens backend (résolution de dépendances, builds, orchestration).

## Solution Java

```java
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Graphe : prereq -> liste des cours qui le suivent
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] inDegree = new int[numCourses]; // nb de prerequis restants par cours

        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }

        // Demarrer avec tous les cours sans prerequis
        Deque<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.offer(i);
        }

        int taken = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();
            taken++;
            // Ce cours valide : liberer ses successeurs
            for (int next : adj.get(course)) {
                if (--inDegree[next] == 0) {
                    queue.offer(next);
                }
            }
        }
        // Tout traite = pas de cycle
        return taken == numCourses;
    }
}
```

## Complexité

Temps O(V + E) : chaque cours et chaque arête de prérequis traités une fois. Espace O(V + E) pour le graphe.
