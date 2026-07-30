---
title: "LRU Cache"
description: "Conçois un cache à capacité fixe avec get(key) et put(key, value) en O(1). Quand le cache est plein, évince l'élément utilisé le moins récem..."
category: "Algorithmes & Structures de données"
pattern: "Design"
difficulty: "Moyen"
number: 57
date: 2026-07-30
tags: ["dsa", "java", "entretien-technique", "design"]
summary: "Conçois un cache à capacité fixe avec get(key) et put(key, value) en O(1). Quand le cache est plein, évince l'élément utilisé le moins récemment (Least Recently Used). LE problème de design le plus posé en entretien."
---

## C'est quoi le problème, en clair ?

On vous demande de construire un cache : un petit espace de stockage à capacité limitée qui garde des paires clé/valeur, avec deux opérations, lire (get) et écrire (put), qui doivent toutes les deux être quasi instantanées. Quand le cache est plein et qu'il faut faire de la place, on doit jeter l'élément le moins récemment utilisé (Least Recently Used, LRU) — pas le plus ancien en date d'ajout, mais celui dont on ne s'est pas servi depuis le plus longtemps. Imaginez votre bureau avec seulement 5 dossiers dessus : quand un sixième arrive, vous rangez celui que vous n'avez pas touché depuis le plus longtemps, pas forcément le premier posé. Le défi technique est de faire tout ça — retrouver un élément ET savoir lequel est le moins récemment utilisé — instantanément, sans jamais parcourir toute la pile de dossiers.

## L'idée clé

Deux besoins : accès par clé en O(1) (→ HashMap) ET ordre d'utilisation modifiable en O(1) (→ liste DOUBLEMENT chaînée : retirer un nœud du milieu et le remettre en tête sont des recâblages O(1)). La map pointe vers les nœuds de la liste : chaque structure comble la faiblesse de l'autre.

## Pourquoi cette solution ?

Version à écrire à la main : HashMap<Integer, Node> + liste doublement chaînée avec deux sentinelles head/tail (aucun cas particulier de bord). LinkedHashMap ferait le job en 10 lignes — le dire, puis coder la version manuelle : c'est ELLE que l'interviewer veut voir.

## Solution Java

```java
class LRUCache {
    // Noeud de liste doublement chainee
    private class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0); // sentinelle : cote "recent"
    private final Node tail = new Node(0, 0); // sentinelle : cote "ancien"

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) return -1;
        moveToFront(node); // utilise -> devient le plus recent
        return node.value;
    }

    public void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) {
            node.value = value;   // mise a jour d'une cle existante
            moveToFront(node);
            return;
        }
        if (map.size() == capacity) {
            Node lru = tail.prev; // le moins recemment utilise
            remove(lru);
            map.remove(lru.key);
        }
        Node fresh = new Node(key, value);
        map.put(key, fresh);
        insertAfterHead(fresh);
    }

    private void remove(Node n) {
        n.prev.next = n.next;
        n.next.prev = n.prev;
    }

    private void insertAfterHead(Node n) {
        n.next = head.next;
        n.prev = head;
        head.next.prev = n;
        head.next = n;
    }

    private void moveToFront(Node n) {
        remove(n);
        insertAfterHead(n);
    }
}
```

## Complexité

Temps O(1) pour get et put : accès map + recâblages de pointeurs constants. Espace O(capacité) : map + liste.
