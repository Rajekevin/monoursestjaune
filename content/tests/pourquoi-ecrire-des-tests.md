---
title: "Pourquoi écrire des tests ?"
description: "Les tests automatisés ne sont pas une perte de temps mais un filet de sécurité et une documentation vivante. Explication, analogie, diagramme et code PHP, JavaScript."
date: 2026-07-10
category: "Tests"
difficulty: "Débutant"
tags: ["tests", "unit-testing", "php", "javascript"]
summary: "Écrire des tests coûte du temps immédiat, mais ce temps est un investissement : les tests deviennent un filet de sécurité contre les régressions et une documentation toujours à jour du comportement réel du code."
bearMemory:
  - "Un test ne prouve pas l'absence de bug, il prouve qu'un **comportement précis** fonctionne comme attendu à un instant donné."
  - "Le vrai coût des tests n'est pas de les écrire, c'est de **ne pas les avoir** le jour où il faut modifier le code en toute confiance."
  - "Des tests qui passent après un refactoring sont la meilleure preuve que le comportement externe n'a pas changé."
interviewQuestions:
  - q: "Pourquoi écrire des tests ralentit-il le développement à court terme mais l'accélère à long terme ?"
    a: "Écrire un test prend du temps immédiat : c'est du code en plus à produire et à maintenir. Mais sans tests, chaque modification future demande une vérification manuelle, plus lente et moins fiable, et le risque de régression silencieuse augmente avec la taille du projet. Les tests déplacent le coût : moins de vitesse au premier commit, beaucoup plus de vitesse sur les cent suivants."
  - q: "Un code sans tests peut-il quand même être fiable ?"
    a: "Oui, temporairement, surtout sur un petit projet peu modifié. Mais la fiabilité repose alors entièrement sur la mémoire et la vigilance des développeurs, ce qui ne tient pas dans la durée. Dès que l'équipe change ou que le projet grossit, l'absence de tests devient un risque qui se matérialise tôt ou tard sous forme de régression."
  - q: "Des tests garantissent-ils l'absence de bugs ?"
    a: "Non. Un test vérifie uniquement les cas qu'il couvre explicitement — il ne prouve jamais l'absence de bug en général, seulement l'absence du bug qu'il cherche. Une suite de tests réduit le risque de régression et documente le comportement attendu, mais elle ne remplace ni la relecture de code ni la réflexion sur les cas limites non couverts."
---

## Le problème

Un développeur modifie une fonction de calcul de remise pour ajouter un nouveau cas. Le code compile, l'application se lance, tout semble fonctionner. Trois jours plus tard, un client signale que les remises fidélité ne s'appliquent plus depuis cette modification — un cas qui fonctionnait avant a silencieusement cassé.

Sans tests, la seule façon de savoir si un changement casse quelque chose est de tout vérifier manuellement, ou d'attendre que les utilisateurs le découvrent. Sur un petit script, ça passe. Sur une application qui grossit avec des dizaines de développeurs et des centaines de comportements interdépendants, ça devient impossible à tenir — chaque modification devient un pari.

## L'idée générale

Un test automatisé encode, une bonne fois pour toutes, ce qu'un bout de code est censé faire. On lui donne une entrée connue, on vérifie que la sortie correspond à ce qui est attendu. Ce test peut ensuite être rejoué en quelques secondes, autant de fois que nécessaire, sans intervention humaine.

Cela donne trois bénéfices concrets :

- **Un filet de sécurité** : si une modification casse un comportement existant, un test échoue immédiatement, avant que ça n'atteigne la production.
- **Une documentation vivante** : contrairement à un commentaire ou un fichier README, un test ne peut pas mentir — s'il passe, c'est que le comportement qu'il décrit est bien celui du code actuel.
- **La liberté de refactorer** : améliorer la structure interne d'un code sans tests est risqué, car on ne sait pas si son comportement externe a changé. Avec des tests, on refactore, on relance la suite, et un feu vert confirme que rien n'a bougé.

Le coût est réel — écrire un test prend du temps — mais il est payé une fois, alors que le bénéfice (détecter une régression) est payé à chaque exécution future, potentiellement des milliers de fois sur la durée de vie du projet.

## Analogie du quotidien

Écrire des tests, c'est comme installer des détecteurs de fumée dans une maison. Les poser prend du temps et ne rend la maison ni plus grande ni plus belle. Mais le jour où un départ de feu se déclare, c'est ce détecteur — pas la vigilance humaine — qui alerte à temps pour agir avant que les dégâts ne deviennent irréversibles.

Sans détecteur, la maison peut très bien fonctionner pendant des années sans incident. Le problème n'est pas la probabilité qu'un incident arrive un jour donné, c'est le coût quand il arrive sans qu'on l'ait vu venir.

## Diagramme

{{< mermaid >}}
flowchart LR
    A[Code sans tests] -->|modification| B{Comportement cassé ?}
    B -->|Oui, découvert en prod| C[Bug signalé par un client]
    B -->|Non, mais personne ne le sait avec certitude| D[Confiance faible]

    E[Code avec tests] -->|modification| F[Suite de tests relancée]
    F -->|Échec| G[Bug détecté avant le déploiement]
    F -->|Succès| H[Confiance élevée pour déployer]
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// Code métier à tester
final class CalculateurRemise
{
    public function calculer(float $montant, bool $estFidele): float
    {
        if ($estFidele) {
            return $montant * 0.9;
        }

        return $montant;
    }
}
```

```php
use PHPUnit\Framework\TestCase;

final class CalculateurRemiseTest extends TestCase
{
    public function testClientFideleObtientDixPourcentDeRemise(): void
    {
        $calculateur = new CalculateurRemise();

        $resultat = $calculateur->calculer(100.0, estFidele: true);

        $this->assertSame(90.0, $resultat);
    }

    public function testClientNonFideleNObtientAucuneRemise(): void
    {
        $calculateur = new CalculateurRemise();

        $resultat = $calculateur->calculer(100.0, estFidele: false);

        $this->assertSame(100.0, $resultat);
    }
}
```

### JavaScript

```javascript
// Code métier à tester
function calculerRemise(montant, estFidele) {
  return estFidele ? montant * 0.9 : montant;
}

module.exports = { calculerRemise };
```

```javascript
const { calculerRemise } = require("./calculateurRemise");

describe("calculerRemise", () => {
  it("applique 10% de remise pour un client fidèle", () => {
    expect(calculerRemise(100, true)).toBe(90);
  });

  it("n'applique aucune remise pour un client non fidèle", () => {
    expect(calculerRemise(100, false)).toBe(100);
  });
});
```

## Quand utiliser des tests ?

- Sur tout code métier qui contient une logique — dès qu'il y a une condition, un calcul ou une règle, il y a quelque chose à casser, donc quelque chose à tester.
- Avant de refactorer un code existant : un filet de tests, même minimal, donne la confiance nécessaire pour changer la structure sans changer le comportement.
- Sur un code appelé à évoluer souvent ou par plusieurs développeurs : plus le nombre de mains qui touchent le code augmente, plus le risque de régression silencieuse augmente.
- Moins prioritaire sur un script jetable, utilisé une fois et jamais réutilisé — le coût d'écrire les tests dépasse alors le bénéfice attendu.

## Points importants

- Un test ne prouve jamais l'absence de bug en général : il prouve seulement qu'un comportement précis, pour une entrée précise, produit la sortie attendue.
- Les tests les plus utiles sont ceux qui documentent une **intention métier**, pas ceux qui testent des détails d'implémentation qui changeront au premier refactoring.
- La valeur des tests se mesure dans le temps, pas au moment où on les écrit : c'est un investissement, pas une dépense immédiate.
- Une suite de tests qui n'est jamais relancée (par exemple absente de la CI) perd une grande partie de sa valeur : le filet de sécurité ne sert à rien s'il n'est pas systématiquement vérifié.
