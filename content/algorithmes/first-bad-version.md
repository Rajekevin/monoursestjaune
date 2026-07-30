---
title: "First Bad Version"
description: "Les versions 1..N d'un produit se suivent ; à partir d'une certaine version, toutes sont « mauvaises ». Une API isBadVersion(v) te répond. T..."
category: "Algorithmes & Structures de données"
pattern: "Binary Search"
difficulty: "Facile"
number: 22
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "binary-search"]
summary: "Les versions 1..N d'un produit se suivent ; à partir d'une certaine version, toutes sont « mauvaises ». Une API isBadVersion(v) te répond. Trouve la PREMIÈRE mauvaise version en minimisant les appels à l'API."
---

## C'est quoi le problème, en clair ?

Une entreprise sort des versions 1, 2, 3... d'un produit, et à partir d'une certaine version, toutes celles qui suivent sont défectueuses. Vous disposez d'un testeur qui vous répond « bonne » ou « mauvaise » pour une version donnée, mais chaque test prend du temps : vous devez trouver la toute première version cassée en testant le moins de fois possible. C'est comme chercher la page où un livre commence à avoir des pages déchirées : plutôt que de tourner les pages une par une, vous l'ouvrez au milieu et vous décidez de quel côté continuer à chercher.

## L'idée clé

Le tableau des réponses ressemble à [bon, bon, ..., bon, MAUVAIS, mauvais, ...] : une frontière à localiser = recherche binaire sur la réponse. Si mid est mauvais, la première mauvaise est à mid ou avant ; sinon elle est strictement après. On resserre jusqu'à ce que left == right.

## Pourquoi cette solution ?

C'est la variante « chercher la frontière » de la recherche binaire, différente du « chercher une valeur exacte » ([Binary Search](/algorithmes/binary-search/)) : ici right = mid (et non mid - 1) car mid reste candidat. Maîtriser cette nuance d'invariant évite les bugs off-by-one — la cause n°1 d'échec sur ce type de question.

## Solution Java

```java
public class Solution extends VersionControl {
    public int firstBadVersion(int n) {
        int left = 1, right = n;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (isBadVersion(mid)) {
                right = mid;     // mid est peut-etre LA premiere mauvaise : on la garde
            } else {
                left = mid + 1;  // mid est bonne : la frontiere est strictement apres
            }
        }
        // left == right : la premiere mauvaise version
        return left;
    }
}
```

## Complexité

Temps O(log N) : l'intervalle est divisé par deux à chaque appel API. Espace O(1).
