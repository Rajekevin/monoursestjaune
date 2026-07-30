---
title: "La checklist d'une bonne code review"
description: "Une grille de lecture en 6 axes pour relire une pull request sans se noyer dans les détails ni laisser passer les vrais problèmes."
date: 2026-07-10
category: "Clean Code"
difficulty: "Intermédiaire"
tags: ["clean-code", "code-review", "backend", "tests"]
summary: "Une code review efficace ne cherche pas la perfection : elle vérifie que le code est plus compréhensible qu'avant, à travers une grille de lecture répétable plutôt qu'une impression au fil de la lecture."
bearMemory:
  - "Une review critique **le code, jamais la personne** — chaque remarque cite une règle ou un exemple, pas un goût personnel."
  - "L'objectif n'est pas la perfection : c'est que le code soit **plus propre à chaque passage** (la règle du boy-scout)."
  - "Une checklist en 6 axes (lisibilité, responsabilités, fonctions, erreurs, tests, outillage) évite de se noyer dans les détails de style et d'oublier les vrais problèmes."
interviewQuestions:
  - q: "Que doit vérifier une code review en priorité : le style ou la logique ?"
    a: "La logique et la conception d'abord — un bug ou une mauvaise responsabilité coûte bien plus cher qu'un style de code non conforme. D'ailleurs, l'essentiel du style (indentation, espaces, imports) devrait être vérifié automatiquement par un linter avant même que la review commence, pour que les humains se concentrent sur ce qu'un outil ne peut pas juger."
  - q: "Comment donner un retour critique sur une PR sans que ce soit vécu comme une attaque personnelle ?"
    a: "En formulant chaque remarque autour d'une règle ou d'un exemple concret plutôt que d'un jugement (« cette fonction fait deux choses différentes, on pourrait séparer X et Y » plutôt que « c'est confus »), et en distinguant clairement les remarques bloquantes des suggestions optionnelles. Le ton compte autant que le contenu : une review reste une conversation entre deux personnes qui veulent le même résultat."
---

## Le problème

Une code review sans grille de lecture dérive facilement dans deux directions opposées : soit elle se concentre sur des détails de style (indentation, nommage de variable locale) pendant qu'un problème de conception plus grave passe inaperçu, soit elle devient si exigeante que chaque pull request s'éternise sur des désaccords de préférence personnelle. Dans les deux cas, la review perd sa valeur : elle ralentit l'équipe sans réellement améliorer la qualité du code qui part en production.

## L'idée générale

Une checklist répétable, organisée en 6 axes, permet de couvrir les points qui comptent vraiment sans dépendre de l'humeur ou de l'expérience du relecteur ce jour-là :

| Axe | Questions à se poser |
|---|---|
| **Lisibilité** | Est-ce que je comprends l'intention sans demander à l'auteur ? Les noms disent-ils le pourquoi ? |
| **Responsabilités** | Chaque fonction/classe a-t-elle une seule raison de changer ? La logique métier est-elle hors du framework ? |
| **Fonctions** | Courtes, un seul niveau d'abstraction, peu de paramètres, early returns plutôt que des `if` imbriqués ? |
| **Erreurs** | Exceptions métier nommées ? Aucun `catch` silencieux ? Les cas limites (vide, null, doublon) sont-ils traités ? |
| **Tests** | Les règles métier sont-elles testées unitairement ? Le test raconte-t-il un scénario lisible ? Un bug corrigé = un test qui le fige ? |
| **Outillage** | Linter et analyse statique passés sans nouvelle erreur ? Pas de code mort ni de `console.log`/`dump()` oublié ? |

Cette grille sert un objectif simple : distinguer ce qui bloque réellement un merge (bug, mauvaise responsabilité, absence de test sur une règle critique) de ce qui est une préférence discutable (style d'écriture, choix de nommage alternatif tout aussi valable).

## Analogie du quotidien

Une code review sans grille, c'est comme une inspection de véhicule où l'inspecteur vérifie ce qui lui vient à l'esprit sur le moment : parfois les pneus, parfois la peinture, rarement les freins. Une checklist de contrôle technique standardisée garantit que les points critiques (freins, direction) sont toujours vérifiés, indépendamment de l'inspecteur du jour — et qu'on ne recale pas un véhicule pour une rayure esthétique en ignorant un vrai problème de sécurité.

## Diagramme

{{< mermaid >}}
flowchart TD
    PR["Pull Request ouverte"] --> Auto["Linter / analyse statique\n(automatique)"]
    Auto -->|échec| Fix1["L'auteur corrige"]
    Auto -->|ok| Human["Relecture humaine\n(les 6 axes)"]
    Human -->|bloquant| Fix2["L'auteur corrige"]
    Human -->|suggestion| Merge["Approuvé, suggestions notées"]
    Fix1 --> Auto
    Fix2 --> Human
    Merge --> Done["Merge"]
{{< /mermaid >}}

## Exemple

```text
Commentaire de review qui cite une règle plutôt qu'un jugement :

❌ "Cette fonction est bizarre."

✅ "Cette fonction mélange la validation et l'envoi d'email — deux
   responsabilités différentes. On pourrait extraire validateOrder()
   et notifyCustomer() séparément, ce qui rendrait chacune testable
   indépendamment. Voir la fiche 'Fonctions courtes et lisibles'."
```

## Quand utiliser cette checklist ?

- Sur toute pull request qui touche à de la logique métier, pas seulement à de la configuration ou de la documentation.
- En priorité sur les axes Responsabilités, Erreurs et Tests : ce sont ceux qui coûtent le plus cher à corriger une fois en production.
- Avec souplesse sur l'axe Lisibilité pour du code très local et déjà bien testé : ne pas bloquer un merge pour une préférence de nommage équivalente à celle proposée.

## Points importants

- Automatiser tout ce qui peut l'être (linter, formateur, analyse statique) avant la relecture humaine : ça libère la review pour ce qu'un outil ne peut pas juger — la conception et l'intention.
- Une review qui ne trouve jamais rien à dire est aussi suspecte qu'une review qui bloque tout : les deux extrêmes signalent souvent une grille de lecture absente plutôt qu'un code parfait ou catastrophique.
- La règle du boy-scout — laisser le code un peu plus propre qu'on ne l'a trouvé — s'applique aussi au relecteur : une suggestion d'amélioration hors du périmètre de la PR se note pour plus tard, elle ne bloque pas le merge en cours.
