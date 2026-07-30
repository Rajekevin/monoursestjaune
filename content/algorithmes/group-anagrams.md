---
title: "Group Anagrams"
description: "Regroupe les mots d'un tableau par familles d'anagrammes. Ex : [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"] → [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"..."
category: "Algorithmes & Structures de données"
pattern: "Hashing"
difficulty: "Moyen"
number: 41
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "hashing"]
summary: "Regroupe les mots d'un tableau par familles d'anagrammes. Ex : [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"] → [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de mots et vous devez les regrouper par familles : deux mots vont ensemble s'ils contiennent exactement les mêmes lettres, juste dans un ordre différent (des anagrammes, comme « chien » et « niche »). Par exemple, « eat », « tea » et « ate » utilisent tous les trois les lettres e, a, t et doivent finir dans le même groupe. Imaginez que vous versiez les lettres de chaque mot dans un petit sac, puis que vous les trieriez par ordre alphabétique : deux mots qui donnent le même sac trié appartiennent forcément à la même famille.

## L'idée clé

Tous les anagrammes partagent une même « signature canonique » : leur mot trié alphabétiquement ("eat" → "aet", "tea" → "aet"). Cette signature devient la clé d'une HashMap qui regroupe les mots. Trouver la bonne CLÉ de regroupement, c'est tout l'art du hashing.

## Pourquoi cette solution ?

HashMap<String, List<String>> + computeIfAbsent(key, k -> new ArrayList<>()) : créer-la-liste-si-absente en une ligne, du Java idiomatique qui impressionne. Variante O(K) par mot (au lieu de O(K log K) pour le tri) : signature par comptage int[26] sérialisé — à mentionner.

## Solution Java

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();

        for (String word : strs) {
            // Signature canonique : les lettres triees
            char[] chars = word.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);

            // Creer le groupe si besoin, puis y ajouter le mot
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
        }

        return new ArrayList<>(groups.values());
    }
}
```

## Complexité

Temps O(N × K log K) : trier chaque mot de longueur K. Espace O(N × K) : tous les mots stockés dans la map.
