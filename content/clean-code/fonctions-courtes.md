---
title: "Écrire des fonctions courtes et lisibles"
description: "Une fonction devrait faire une seule chose, à un seul niveau d'abstraction. Comment repérer une fonction qui en fait trop, et comment la découper."
date: 2026-07-10
category: "Clean Code"
difficulty: "Intermédiaire"
tags: ["clean-code", "solid", "php", "java", "javascript"]
summary: "Une fonction longue n'est pas un problème de longueur : c'est un symptôme qu'elle mélange plusieurs intentions à des niveaux d'abstraction différents. La découper par intention rend le scénario principal lisible comme un sommaire."
bearMemory:
  - "Une fonction fait **une seule chose**, à **un seul niveau d'abstraction** — c'est le Single Responsibility Principle appliqué à l'échelle d'une fonction, pas seulement d'une classe."
  - "Plus de **3 paramètres** est un signal d'alerte : regrouper dans un petit objet (DTO) plutôt qu'empiler les arguments."
  - "Un **early return** en haut de fonction pour les cas d'erreur garde le scénario principal à plat, sans pyramide de `if` imbriqués."
interviewQuestions:
  - q: "Comment sait-on qu'une fonction fait « trop de choses » ?"
    a: "Un bon test : essayez de décrire ce qu'elle fait en une phrase, sans utiliser le mot « et ». Si la phrase contient plusieurs « et » (« elle valide et calcule et envoie un email »), la fonction mélange plusieurs responsabilités qui devraient être séparées en plusieurs fonctions, chacune nommée d'après l'une de ces actions."
  - q: "Les early returns rendent-ils vraiment le code plus lisible, ou est-ce juste une préférence de style ?"
    a: "C'est plus qu'une préférence : un early return traite un cas d'erreur et sort immédiatement, ce qui évite d'imbriquer tout le reste de la logique dans un bloc `else`. Le scénario principal reste au même niveau d'indentation du début à la fin, ce qui le rend lisible comme une liste d'étapes plutôt que comme un arbre de décisions imbriquées."
---

## Le problème

Une méthode qui traite une commande, calcule un total, applique une remise, sauvegarde en base et envoie un email de confirmation — le tout dans les mêmes 60 lignes — fonctionne très bien au premier commit. Le problème arrive plus tard : impossible de tester le calcul de remise sans mocker l'envoi d'email, impossible de comprendre le scénario sans lire la fonction en entier, et chaque modification touche un bloc de code que personne n'a plus une vue d'ensemble claire.

Le symptôme n'est pas la longueur en elle-même. C'est que la fonction mélange plusieurs intentions — valider, calculer, persister, notifier — à des niveaux d'abstraction différents, dans un seul bloc.

## L'idée générale

Une fonction devrait faire **une seule chose**, à **un seul niveau d'abstraction**, et tenir généralement dans une dizaine de lignes. Au-delà, elle cache souvent plusieurs intentions.

Deux techniques couvrent la majorité des cas :

- **Extraire chaque bloc en fonction nommée.** Un commentaire du type `// calculer le total` au-dessus d'un bloc de 5 lignes est un signal : ce bloc devrait être une fonction `computeTotal()`, et le commentaire devient inutile puisque le nom de la fonction dit déjà ce qu'il faisait.
- **Utiliser des early returns.** Traiter les cas d'erreur ou les cas limites en premier, avec un `return` ou une exception immédiate, plutôt que d'empiler des `if/else` imbriqués qui repoussent le scénario principal vers la droite de l'écran.

Sur les paramètres : au-delà de trois, un petit objet qui les regroupe (un DTO) rend l'appel plus lisible qu'une longue liste d'arguments positionnels dont l'ordre est facile à confondre.

## Analogie du quotidien

Une fonction longue, c'est comme une recette de cuisine qui ne serait pas découpée en étapes : un seul paragraphe qui mélange la préparation de la pâte, la cuisson de la garniture et le dressage de l'assiette. Techniquement, toutes les informations sont là. Mais impossible de préparer juste la garniture à l'avance, de la tester séparément, ou de la remplacer sans relire tout le paragraphe.

Une recette bien écrite découpe en étapes nommées : « préparer la pâte », « cuire la garniture », « dresser ». Chaque étape se lit, se teste et se change indépendamment des autres.

## Diagramme

{{< mermaid >}}
flowchart TD
    A["Fonction longue,\nplusieurs intentions mélangées"] --> B["Extraire chaque bloc\nen fonction nommée"]
    A --> C["Traiter les erreurs\nen early return"]
    B --> D["Scénario principal lisible\ncomme un sommaire"]
    C --> D
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// Avant : une méthode, plusieurs intentions mélangées, niveaux d'abstraction en vrac
public function handleOrder(array $payload): void
{
    if (empty($payload['lines'])) {
        throw new RuntimeException('Commande vide');
    }
    $total = 0;
    foreach ($payload['lines'] as $line) {
        $total += $line['qty'] * $line['price'];
    }
    if ($total > 10000) {
        $total = (int) round($total * 0.95);
    }
    $this->em->persist(/* ... */);
    $this->em->flush();
    $this->mailer->send(/* ... */);
}

// Après : le scénario se lit comme un sommaire ; chaque détail a sa fonction
public function handleOrder(PlaceOrderCommand $command): void
{
    $lines = $this->validateLines($command->lines);
    $total = $this->applyVolumeDiscount($this->computeTotal($lines));

    $this->saveOrder($lines, $total);
    $this->notifyCustomer($command->customerEmail);
}
```

### Java

```java
// Avant
public void handleOrder(Map<String, Object> payload) {
    List<Map<String, Object>> lines = (List<Map<String, Object>>) payload.get("lines");
    if (lines.isEmpty()) {
        throw new IllegalArgumentException("Commande vide");
    }
    double total = 0;
    for (Map<String, Object> line : lines) {
        total += (int) line.get("qty") * (double) line.get("price");
    }
    if (total > 10000) {
        total = Math.round(total * 0.95);
    }
    orderRepository.save(/* ... */);
    mailer.send(/* ... */);
}

// Après
public void handleOrder(PlaceOrderCommand command) {
    List<OrderLine> lines = validateLines(command.getLines());
    double total = applyVolumeDiscount(computeTotal(lines));

    saveOrder(lines, total);
    notifyCustomer(command.getCustomerEmail());
}
```

### JavaScript

```javascript
// Avant
function handleOrder(payload) {
  if (!payload.lines || payload.lines.length === 0) {
    throw new Error("Commande vide");
  }
  let total = 0;
  for (const line of payload.lines) {
    total += line.qty * line.price;
  }
  if (total > 10000) {
    total = Math.round(total * 0.95);
  }
  saveToDatabase(payload);
  sendConfirmationEmail(payload.customerEmail);
}

// Après
function handleOrder(command) {
  const lines = validateLines(command.lines);
  const total = applyVolumeDiscount(computeTotal(lines));

  saveOrder(lines, total);
  notifyCustomer(command.customerEmail);
}
```

## Quand appliquer cette règle ?

- Dès qu'une fonction dépasse une dizaine de lignes ou mélange plusieurs niveaux d'abstraction (de la logique métier et des détails techniques dans le même bloc).
- Particulièrement avant d'écrire un test : si tester une fonction demande de mocker beaucoup de choses sans rapport avec ce qu'on veut vérifier, c'est souvent le signe qu'elle devrait être découpée.
- Avec retenue sur du code déjà simple : découper une fonction de 5 lignes en 3 fonctions d'une ligne n'apporte rien, seulement de l'indirection à suivre.

## Points importants

- Une fonction longue n'est pas condamnable en soi : le vrai critère est « fait-elle une seule chose, à un seul niveau d'abstraction ? ».
- L'extraction de fonctions est un refactoring à très faible risque avec un bon IDE : à faire dès qu'un commentaire explique un bloc, plutôt que d'attendre que le fichier devienne ingérable.
- Ce principe est la version « fonction » du Single Responsibility Principle — voir [SOLID expliqué simplement](/architecture-logicielle/solid-explique-simplement/) pour la version à l'échelle d'une classe.
