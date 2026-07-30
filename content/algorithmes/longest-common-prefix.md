---
title: "Longest Common Prefix"
description: "Trouve le plus long préfixe commun à toutes les chaînes d'un tableau. Ex : [\"flower\",\"flow\",\"flight\"] → \"fl\". S'il n'y en a pas, renvoie \"\"."
category: "Algorithmes & Structures de données"
pattern: "Strings"
difficulty: "Facile"
number: 24
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "strings"]
summary: "Trouve le plus long préfixe commun à toutes les chaînes d'un tableau. Ex : [\"flower\",\"flow\",\"flight\"] → \"fl\". S'il n'y en a pas, renvoie \"\"."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de mots et vous devez trouver le plus long début commun à tous ces mots. Par exemple, « flower », « flow » et « flight » commencent tous par « fl », donc la réponse est « fl » — dès que les mots divergent (ici au 3ᵉ caractère), on s'arrête. Imaginez que vous compariez plusieurs mots colonne par colonne, comme s'ils étaient écrits les uns sous les autres dans un tableau : vous regardez la première colonne de lettres, puis la deuxième, et vous vous arrêtez dès qu'une colonne contient des lettres différentes ou qu'un mot est trop court.

## L'idée clé

Comparaison verticale : on regarde la colonne 0 de tous les mots, puis la colonne 1, etc. Dès qu'un mot est trop court ou qu'un caractère diffère, le préfixe s'arrête juste avant. Le premier mot sert de référence maximale.

## Pourquoi cette solution ?

Pas de structure : deux boucles imbriquées avec sortie anticipée. Utiliser s.charAt(i) directement — pas de substring() dans la boucle, qui créerait des objets inutiles. Simple, mais l'interviewer regarde la propreté des conditions d'arrêt.

## Solution Java

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs.length == 0) return "";

        // Le prefixe ne peut pas depasser le premier mot
        for (int i = 0; i < strs[0].length(); i++) {
            char c = strs[0].charAt(i);

            // Verifier ce caractere dans tous les autres mots
            for (int j = 1; j < strs.length; j++) {
                // Mot trop court OU caractere different : stop
                if (i == strs[j].length() || strs[j].charAt(i) != c) {
                    return strs[0].substring(0, i);
                }
            }
        }
        return strs[0]; // le premier mot entier est le prefixe commun
    }
}
```

## Complexité

Temps O(S) où S est la somme des longueurs (au pire on lit tout). Espace O(1) hors chaîne de sortie.
