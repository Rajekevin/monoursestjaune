---
title: "Top K Frequent Elements"
description: "Renvoie les K éléments les plus fréquents d'un tableau. Ex : nums=[1,1,1,2,2,3], k=2 → [1,2]. Contrainte suggérée : mieux que O(N log N)."
category: "Algorithmes & Structures de données"
pattern: "Heap"
difficulty: "Moyen"
number: 42
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "heap"]
summary: "Renvoie les K éléments les plus fréquents d'un tableau. Ex : nums=[1,1,1,2,2,3], k=2 → [1,2]. Contrainte suggérée : mieux que O(N log N)."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres et vous devez renvoyer les K valeurs qui reviennent le plus souvent, sans forcément tout trier. C'est comme dépouiller un sondage : vous comptez combien de fois chaque réponse est apparue, puis vous annoncez seulement le podium des K réponses les plus données, sans perdre de temps à classer parfaitement toutes les réponses les moins populaires. L'astuce pour aller vite consiste à ranger les valeurs dans des « paniers » selon leur nombre d'apparitions, puis à lire les paniers des plus remplis vers les moins remplis.

## L'idée clé

Étape 1 : compter les fréquences (HashMap). Étape 2 : sélectionner le top K — avec un MIN-heap de taille K trié par fréquence (comme dans [Kth Largest Element in a Stream](/algorithmes/kth-largest-element-in-a-stream/), on éjecte le moins fréquent), en O(N log K). L'alternative géniale en O(N) : le « bucket sort » — un tableau de seaux indexé par fréquence (une fréquence est bornée par N !).

## Pourquoi cette solution ?

La version bucket sort évite tout tri : buckets[f] contient les valeurs de fréquence f, on lit les seaux du plus grand indice au plus petit. Présenter les deux versions (heap puis bucket) montre que tu sais itérer vers l'optimal — le comportement attendu en entretien Meta/Google.

## Solution Java

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 1. Compter la frequence de chaque valeur
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.merge(num, 1, Integer::sum);
        }

        // 2. Bucket sort : buckets[f] = liste des valeurs apparues f fois
        //    La frequence max possible est nums.length
        List<Integer>[] buckets = new List[nums.length + 1];
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            int f = e.getValue();
            if (buckets[f] == null) buckets[f] = new ArrayList<>();
            buckets[f].add(e.getKey());
        }

        // 3. Lire les seaux de la plus haute frequence vers la plus basse
        int[] result = new int[k];
        int idx = 0;
        for (int f = buckets.length - 1; f >= 0 && idx < k; f--) {
            if (buckets[f] != null) {
                for (int val : buckets[f]) {
                    result[idx++] = val;
                    if (idx == k) break;
                }
            }
        }
        return result;
    }
}
```

## Complexité

Temps O(N) : comptage, remplissage et lecture des seaux sont tous linéaires. Espace O(N) pour la map et les seaux.
