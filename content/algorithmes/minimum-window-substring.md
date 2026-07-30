---
title: "Minimum Window Substring"
description: "Trouve la plus PETITE sous-chaîne de s qui contient tous les caractères de t (avec leurs multiplicités). Ex : s=\"ADOBECODEBANC\", t=\"ABC\" → \"..."
category: "Algorithmes & Structures de données"
pattern: "Sliding Window"
difficulty: "Difficile"
number: 82
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "sliding-window"]
summary: "Trouve la plus PETITE sous-chaîne de s qui contient tous les caractères de t (avec leurs multiplicités). Ex : s=\"ADOBECODEBANC\", t=\"ABC\" → \"BANC\". Le boss final des fenêtres glissantes."
---

## C'est quoi le problème, en clair ?

On vous donne un texte s et une petite chaîne t, et vous devez trouver la plus PETITE portion CONTIGUE de s qui contient tous les caractères de t — avec les bonnes quantités si une lettre apparaît plusieurs fois dans t. Par exemple, avec s="ADOBECODEBANC" et t="ABC", la réponse est "BANC". Imaginez que vous devez trouver, dans un magasin, le plus petit rayon continu (un ensemble de rayons qui se suivent) qui contient tous les articles de votre liste de courses, sans en manquer un seul. La stratégie consiste à élargir votre zone de recherche jusqu'à ce qu'elle contienne tout, puis à la rétrécir autant que possible tant qu'elle reste complète.

## L'idée clé

Fenêtre variable en deux temps : ÉTENDRE right jusqu'à ce que la fenêtre couvre tout t, puis CONTRACTER left au maximum tant que la couverture tient (chaque position de left donne une candidate minimale). Un compteur « formed » (nombre de caractères de t entièrement satisfaits) rend le test de couverture O(1).

## Pourquoi cette solution ?

Deux maps de fréquences (besoin / fenêtre) + le compteur formed comparé à need.size() : sans lui, vérifier la couverture coûterait O(alphabet) à chaque pas. Gérer les MULTIPLICITÉS (t="AABC") est ce qui différencie ce hard des fenêtres moyennes — le point que l'interviewer sonde en premier.

## Solution Java

```java
class Solution {
    public String minWindow(String s, String t) {
        if (t.length() > s.length()) return "";

        Map<Character, Integer> need = new HashMap<>(); // frequences requises
        for (char c : t.toCharArray()) {
            need.merge(c, 1, Integer::sum);
        }

        Map<Character, Integer> window = new HashMap<>();
        int formed = 0;                  // nb de caracteres entierement satisfaits
        int required = need.size();
        int left = 0;
        int bestLen = Integer.MAX_VALUE, bestStart = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window.merge(c, 1, Integer::sum);

            // Ce caractere vient-il de completer son quota ?
            if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) {
                formed++;
            }

            // Fenetre complete : contracter au maximum
            while (formed == required) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                char out = s.charAt(left);
                window.merge(out, -1, Integer::sum);
                if (need.containsKey(out) && window.get(out) < need.get(out)) {
                    formed--; // on vient de casser un quota
                }
                left++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}
```

## Complexité

Temps O(|s| + |t|) : left et right avancent chacun au plus |s| fois. Espace O(alphabet de t) pour les deux maps.
