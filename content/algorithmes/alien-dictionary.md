---
title: "Alien Dictionary"
description: "Des mots sont donnés triés selon un alphabet extraterrestre inconnu. Déduis UN ordre valide des lettres de cet alphabet (\"\" si les mots sont..."
category: "Algorithmes & Structures de données"
pattern: "Graphs"
difficulty: "Difficile"
number: 91
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "graphs"]
summary: "Des mots sont donnés triés selon un alphabet extraterrestre inconnu. Déduis UN ordre valide des lettres de cet alphabet (\"\" si les mots sont contradictoires). Le hard de tri topologique par excellence."
---

## C'est quoi le problème, en clair ?

Vous recevez une liste de mots déjà triée, mais selon un alphabet extraterrestre dont vous ne connaissez pas l'ordre des lettres. À partir de cet ordre des mots, il faut déduire un ordre possible pour les lettres elles-mêmes — et détecter les cas où c'est impossible, quand les mots se contredisent entre eux. C'est comme reconstituer les règles d'un jeu de cartes juste en observant plusieurs parties déjà classées du meilleur au moins bon score : chaque paire de mots voisins vous donne un indice du genre « cette lettre vient avant celle-là », et vous devez assembler tous ces indices en un ordre cohérent (au besoin, le [glossaire](/glossaire-algorithmes/) explique ce qu'est un graphe et un tri topologique, les outils utilisés ici).

## L'idée clé

Chaque paire de mots adjacents livre UN indice : la première lettre qui diffère impose « lettre1 avant lettre2 » — une arête d'un graphe orienté entre lettres. Ensuite, tri topologique (Kahn, [Course Schedule](/algorithmes/course-schedule/)). Piège d'invalidité : ["abc", "ab"] (un mot préfixé par son suivant plus long) est contradictoire.

## Pourquoi cette solution ?

Map<Character, Set<Character>> pour dédupliquer les arêtes (sinon les in-degrees se corrompent) + map d'in-degrees + ArrayDeque + StringBuilder pour l'ordre. Si le résultat ne contient pas toutes les lettres → cycle → "". Combine extraction de contraintes + Kahn : deux compétences testées en une question.

## Solution Java

```java
class Solution {
    public String alienOrder(String[] words) {
        // Initialiser chaque lettre presente avec un in-degree de 0
        Map<Character, Set<Character>> adj = new HashMap<>();
        Map<Character, Integer> inDegree = new HashMap<>();
        for (String w : words) {
            for (char c : w.toCharArray()) {
                adj.putIfAbsent(c, new HashSet<>());
                inDegree.putIfAbsent(c, 0);
            }
        }

        // Extraire une contrainte de chaque paire de mots adjacents
        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i], w2 = words[i + 1];
            // Piege : "abc" avant "ab" est impossible
            if (w1.length() > w2.length() && w1.startsWith(w2)) return "";

            for (int j = 0; j < Math.min(w1.length(), w2.length()); j++) {
                char c1 = w1.charAt(j), c2 = w2.charAt(j);
                if (c1 != c2) {
                    // Nouvelle arete c1 -> c2 (dedupliquee par le Set)
                    if (adj.get(c1).add(c2)) {
                        inDegree.merge(c2, 1, Integer::sum);
                    }
                    break; // seule la PREMIERE difference compte
                }
            }
        }

        // Tri topologique de Kahn
        Deque<Character> queue = new ArrayDeque<>();
        for (Map.Entry<Character, Integer> e : inDegree.entrySet()) {
            if (e.getValue() == 0) queue.offer(e.getKey());
        }

        StringBuilder order = new StringBuilder();
        while (!queue.isEmpty()) {
            char c = queue.poll();
            order.append(c);
            for (char next : adj.get(c)) {
                if (inDegree.merge(next, -1, Integer::sum) == 0) {
                    queue.offer(next);
                }
            }
        }
        // Cycle si toutes les lettres n'ont pas ete placees
        return order.length() == inDegree.size() ? order.toString() : "";
    }
}
```

## Complexité

Temps O(C) où C est le total des caractères (extraction) + O(V + E) pour Kahn, avec V ≤ 26. Espace O(V + E) ≤ O(26²) = O(1) en pratique.
