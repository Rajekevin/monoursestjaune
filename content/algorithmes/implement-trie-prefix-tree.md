---
title: "Implement Trie (Prefix Tree)"
description: "Implémente un Trie (arbre de préfixes) : insert(word), search(word) (mot complet présent ?) et startsWith(prefix) (un mot commence-t-il ains..."
category: "Algorithmes & Structures de données"
pattern: "Trees"
difficulty: "Moyen"
number: 62
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "trees"]
summary: "Implémente un Trie (arbre de préfixes) : insert(word), search(word) (mot complet présent ?) et startsWith(prefix) (un mot commence-t-il ainsi ?)."
---

## C'est quoi le problème, en clair ?

Un Trie est une structure pensée pour stocker des mots et répondre vite à deux questions : « ce mot exact existe-t-il ? » et « existe-t-il un mot qui commence par ces lettres ? ». C'est exactement ce que fait la barre de recherche de votre téléphone quand elle vous propose des suggestions au fur et à mesure que vous tapez. Imaginez un arbre où chaque branche représente une lettre : en descendant lettre par lettre à partir de la racine, vous suivez le chemin d'un mot, et plusieurs mots qui commencent pareil partagent le début du même chemin — c'est ce qui rend la recherche par préfixe si rapide.

## L'idée clé

Chaque nœud représente un préfixe ; ses 26 enfants représentent la lettre suivante possible. Insérer = descendre lettre par lettre en créant les nœuds manquants, puis marquer la fin de mot (isEnd). search et startsWith partagent la même descente — seule la vérification finale diffère.

## Pourquoi cette solution ?

Un tableau children[26] par nœud (accès direct par c - 'a') plutôt qu'une HashMap : plus rapide et plus simple pour un alphabet fixe. Le Trie est LA structure des problèmes de dictionnaire : autocomplétion, [Word Search II](/algorithmes/word-search-ii/)... indispensable au niveau FAANG.

## Solution Java

```java
class Trie {
    private class Node {
        Node[] children = new Node[26];
        boolean isEnd = false; // vrai si un mot se termine ici
    }

    private final Node root = new Node();

    public void insert(String word) {
        Node node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) {
                node.children[i] = new Node(); // creer le chemin manquant
            }
            node = node.children[i];
        }
        node.isEnd = true; // marquer la fin du mot
    }

    public boolean search(String word) {
        Node node = walk(word);
        return node != null && node.isEnd; // le chemin existe ET c'est un mot complet
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null; // le chemin existe, peu importe isEnd
    }

    // Descend le trie en suivant les lettres ; null si le chemin casse
    private Node walk(String s) {
        Node node = root;
        for (char c : s.toCharArray()) {
            node = node.children[c - 'a'];
            if (node == null) return null;
        }
        return node;
    }
}
```

## Complexité

Temps O(L) par opération, L = longueur du mot — indépendant du nombre de mots stockés. Espace O(total des caractères × 26) au pire.
