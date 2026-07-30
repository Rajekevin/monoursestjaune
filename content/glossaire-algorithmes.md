---
title: "Glossaire algo & structures de données"
description: "Le vocabulaire des entretiens techniques FAANG expliqué simplement, avant de plonger dans les 100 problèmes : complexité, structures de données, patterns algorithmiques."
date: 2026-07-30
---

Les fiches de la section [Algorithmes & Structures de données](/algorithmes/) vont vite, parce qu'elles s'adressent à quelqu'un qui code déjà. Si un mot comme « dummy node », « fenêtre glissante » ou « pile monotone » ne vous dit rien, cette page est faite pour vous : elle explique une fois pour toutes le vocabulaire qui revient dans presque tous les problèmes, pour que vous puissiez ensuite lire n'importe quelle fiche sans buter sur le jargon.

## La complexité (Big O)

La notation Big O répond à une seule question : *si l'entrée devient beaucoup plus grande, mon code ralentit-il un peu, beaucoup, ou énormément ?*

- **O(1)** — constant. Le temps ne dépend pas de la taille de l'entrée. Exemple : lire la première case d'un tableau.
- **O(log N)** — logarithmique. Chaque étape élimine la moitié du travail restant. Exemple : chercher un mot dans un dictionnaire papier en l'ouvrant au milieu.
- **O(N)** — linéaire. Le temps est proportionnel à la taille de l'entrée. Exemple : lire chaque élément d'un tableau une fois.
- **O(N log N)** — un peu plus lent que linéaire. La plupart des bons algorithmes de tri.
- **O(N²)** — quadratique. Deux boucles imbriquées sur la même entrée. À éviter dès que N dépasse quelques milliers.

L'espace (mémoire) se mesure avec la même notation : O(1) d'espace veut dire qu'on n'utilise qu'une poignée de variables, quelle que soit la taille de l'entrée.

## Les structures de données de base

- **Tableau (array)** — une suite de cases numérotées, accès direct à n'importe quelle case en O(1).
- **Liste chaînée (linked list)** — une suite d'éléments où chaque élément pointe vers le suivant, comme une chaîne de wagons. Contrairement à un tableau, on ne peut pas sauter directement à la case 50 : il faut parcourir les wagons un par un.
- **Pile (stack)** — on empile et on dépile toujours par le dessus, comme une pile d'assiettes. Le dernier arrivé est le premier reparti (LIFO).
- **File (queue)** — premier arrivé, premier servi (FIFO), comme une file d'attente.
- **Arbre binaire (tree)** — chaque nœud a au plus deux enfants (gauche, droite). Un arbre binaire de recherche range en plus les valeurs pour que la recherche soit rapide.
- **Tas (heap)** — un arbre spécial où le sommet est toujours soit le plus petit élément (min-heap), soit le plus grand (max-heap). Utile pour retrouver rapidement un extremum.
- **HashMap / HashSet** — une table qui associe une clé à une valeur (ou teste juste la présence d'une valeur) en temps constant O(1), au prix d'un peu de mémoire. C'est l'outil le plus utilisé des entretiens.
- **Graphe** — un ensemble de nœuds reliés par des arêtes, comme un plan de métro. Une grille de cases voisines est aussi un graphe déguisé.
- **Trie (arbre de préfixes)** — un arbre spécialisé pour stocker des mots, où chaque niveau représente une lettre. Très utilisé pour l'autocomplétion.

## Les patterns qui reviennent tout le temps

- **Deux pointeurs (two pointers)** — deux index qui parcourent une structure, souvent depuis les deux extrémités, pour éviter une double boucle.
- **Fenêtre glissante (sliding window)** — une « fenêtre » de taille fixe ou variable qui se déplace sur un tableau ou une chaîne, en ajoutant un élément d'un côté et en en retirant un de l'autre, sans tout recalculer à chaque fois.
- **Recherche binaire (binary search)** — diviser l'espace de recherche par deux à chaque étape, uniquement possible sur des données triées (ou sur une réponse qui se comporte de façon triée).
- **DFS (parcours en profondeur)** — explorer une branche jusqu'au bout avant de revenir en arrière, comme visiter un labyrinthe en suivant toujours le premier couloir rencontré.
- **BFS (parcours en largeur)** — explorer niveau par niveau, comme une onde qui se propage. Utilisé pour trouver le plus court chemin dans un graphe non pondéré.
- **Backtracking** — essayer un choix, explorer ce qu'il donne, puis « annuler » ce choix pour en essayer un autre. Utilisé pour générer toutes les combinaisons ou solutions possibles.
- **Programmation dynamique (DP)** — résoudre un problème en le découpant en sous-problèmes plus petits, et en mémorisant leur résultat pour ne jamais les recalculer deux fois.
- **Pile monotone** — une pile qui reste toujours triée (croissante ou décroissante) en supprimant les éléments qui ne peuvent plus être utiles avant d'en ajouter un nouveau.

## Le vocabulaire des solutions

- **Dummy node** — un nœud « factice » qu'on place avant la tête d'une liste chaînée pour éviter d'écrire un cas particulier quand on modifie justement... la tête de la liste.
- **In-place** — une opération qui modifie directement la structure d'entrée, sans en créer une copie, pour économiser de la mémoire.
- **Amorti (amortized)** — un coût qui peut être élevé ponctuellement, mais qui reste faible en moyenne sur l'ensemble des opérations.
- **Élaguer (pruning)** — arrêter d'explorer une piste dès qu'on sait qu'elle ne peut plus mener à une solution valable, pour ne pas perdre de temps.
- **Mémoïsation** — stocker le résultat d'un calcul déjà fait, pour le réutiliser directement la prochaine fois qu'on en a besoin, au lieu de le refaire.

Avec ce vocabulaire en tête, vous pouvez maintenant lire n'importe laquelle des [100 fiches de la section Algorithmes](/algorithmes/) directement. Chacune part d'un énoncé concret, explique l'idée clé, justifie pourquoi cette solution fonctionne, puis donne le code Java et sa complexité.
