---
title: "Contains Duplicate"
description: "Renvoie true si au moins une valeur apparaît deux fois dans le tableau, false si tous les éléments sont distincts."
category: "Algorithmes & Structures de données"
pattern: "Hashing"
difficulty: "Facile"
number: 12
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "hashing"]
summary: "Renvoie true si au moins une valeur apparaît deux fois dans le tableau, false si tous les éléments sont distincts."
---

## C'est quoi le problème, en clair ?

On vous donne une liste de nombres, et vous devez simplement dire s'il y en a au moins un qui apparaît deux fois. C'est comme vérifier si, dans une pile de cartes à jouer, deux cartes identiques se sont glissées par erreur : il suffit de retenir chaque carte déjà vue et de vérifier, à chaque nouvelle carte, si elle a déjà été croisée.

## L'idée clé

Détecter un doublon = se souvenir de ce qu'on a déjà vu. Un HashSet fait exactement ça : on tente d'ajouter chaque élément, et add() renvoie false si l'élément y était déjà — doublon trouvé, on s'arrête immédiatement.

## Pourquoi cette solution ?

HashSet.add() teste ET insère en une seule opération O(1) : c'est plus élégant que contains() puis add(). Alternative sans mémoire supplémentaire : trier puis comparer les voisins, mais on paie O(N log N) de temps — bon trade-off à discuter à voix haute.

## Solution Java

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();

        for (int num : nums) {
            // add() renvoie false si l'element etait deja dans le set
            if (!seen.add(num)) {
                return true; // doublon detecte, sortie immediate
            }
        }
        return false; // tout est unique
    }
}
```

## Complexité

Temps O(N) : une passe, add() en O(1) amorti. Espace O(N) : le set peut contenir tous les éléments si aucun doublon.
