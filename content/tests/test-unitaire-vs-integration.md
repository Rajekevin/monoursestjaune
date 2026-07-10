---
title: "Test unitaire vs intégration"
description: "Un test unitaire isole une seule unité de code, un test d'intégration vérifie que plusieurs composants collaborent correctement. Périmètre, vitesse, ce qu'on mock ou non."
date: 2026-07-10
category: "Tests"
difficulty: "Intermédiaire"
tags: ["tests", "unit-testing", "php", "javascript"]
summary: "Un test unitaire vérifie une seule unité de code en isolation, en général en mockant ses dépendances. Un test d'intégration vérifie que plusieurs composants réels — base de données, API, autres classes — collaborent correctement ensemble."
bearMemory:
  - "Un test unitaire isole **une seule unité** et mocke ses dépendances externes ; un test d'intégration vérifie que **plusieurs composants réels** collaborent correctement."
  - "Plus un test se rapproche de la réalité (vraie base de données, vrai réseau), plus il est **lent et fragile** — c'est le compromis central des tests d'intégration."
  - "Un test unitaire qui mocke tout répond à *'ma logique est-elle correcte ?'* ; un test d'intégration répond à *'mes composants s'assemblent-ils correctement ?'* — les deux questions sont différentes et complémentaires."
interviewQuestions:
  - q: "Quelle différence entre un test unitaire et un test d'intégration ?"
    a: "Un test unitaire isole une seule unité de code (une fonction, une classe) en remplaçant ses dépendances par des mocks ou des stubs — il est rapide et vérifie une logique en isolation. Un test d'intégration exécute plusieurs composants réels ensemble (par exemple une classe et une vraie base de données) pour vérifier qu'ils collaborent correctement — il est plus lent mais détecte des problèmes qu'un test unitaire, avec ses dépendances mockées, ne peut pas voir."
  - q: "Pourquoi ne pas se contenter de tests d'intégration, plus proches de la réalité ?"
    a: "Les tests d'intégration sont plus lents (vraie base de données, vrai réseau) et plus difficiles à déboguer quand ils échouent, car l'échec peut venir de n'importe quel composant impliqué. Les tests unitaires, rapides et ciblés, permettent d'identifier un bug précisément et de faire tourner des centaines de cas en quelques secondes — un luxe impossible avec uniquement des tests d'intégration."
  - q: "Comment décider si une dépendance doit être mockée ou utilisée réellement dans un test ?"
    a: "Ça dépend de ce que le test cherche à vérifier. Si l'objectif est d'isoler une logique métier précise, on mocke tout ce qui n'est pas cette logique (base de données, appels réseau, horloge système). Si l'objectif est de vérifier que l'intégration entre deux composants fonctionne réellement — par exemple qu'une requête SQL est correcte — alors utiliser la vraie dépendance (ou une version proche, comme une base de test) est justement le but du test."
---

## Le problème

Une équipe teste une fonction `calculerRemise()` en isolation : elle passe toujours. Pourtant, en production, la remise ne s'applique jamais correctement — parce que la requête SQL qui récupère le statut fidélité du client renvoie la mauvaise colonne. Le test unitaire n'a rien vu, car il ne testait que la logique de calcul, pas la façon dont les composants s'assemblent réellement.

À l'inverse, une suite composée uniquement de tests qui démarrent une vraie base de données et font de vrais appels HTTP devient si lente que personne ne la lance avant de pousser son code, et les retours d'échec arrivent des heures plus tard, noyés dans le bruit d'une pipeline CI. Le périmètre du test — ce qu'il isole et ce qu'il laisse réel — n'est jamais un détail anodin.

## L'idée générale

Un **test unitaire** vérifie une seule unité de code (une fonction, une méthode, une classe) en l'isolant complètement de ses dépendances. Toute dépendance externe — base de données, appel réseau, système de fichiers, horloge — est remplacée par un mock ou un stub. Le test unitaire répond à une question précise : *cette logique, prise isolément, se comporte-t-elle comme prévu ?*

Un **test d'intégration** vérifie que plusieurs composants réels collaborent correctement entre eux. Il peut faire appel à une vraie base de données (souvent une base de test dédiée), un vrai client HTTP contre un serveur de test, ou plusieurs classes réelles qui interagissent sans mock. Il répond à une autre question : *ces composants, assemblés ensemble, produisent-ils le résultat attendu ?*

Les deux ne s'opposent pas — ils couvrent des risques différents :

| | Test unitaire | Test d'intégration |
|---|---|---|
| Périmètre | Une seule unité | Plusieurs composants réels |
| Dépendances | Mockées / stubbées | Réelles (ou proches du réel) |
| Vitesse | Très rapide (millisecondes) | Plus lent (connexions réelles) |
| Détecte | Erreurs de logique isolée | Erreurs d'assemblage, de configuration, de contrat |
| Débogage en cas d'échec | Précis, cause évidente | Plus large, cause à identifier parmi plusieurs composants |

## Analogie du quotidien

Tester unitairement, c'est vérifier chaque pièce détachée d'un meuble en kit séparément : la vis tient-elle la charge prévue, la planche a-t-elle les bonnes dimensions. Tester en intégration, c'est monter réellement deux ou trois pièces ensemble et vérifier qu'elles s'assemblent sans jeu ni porte-à-faux.

Vérifier chaque vis isolément est rapide et précis, mais ne garantit pas que le meuble entier tiendra debout une fois monté — un plan de perçage mal aligné entre deux pièces, chacune parfaite individuellement, peut rendre l'assemblage impossible. C'est exactement ce qu'un test d'intégration détecte et qu'un test unitaire, par construction, ne peut pas voir.

## Diagramme

{{< mermaid >}}
flowchart TB
    subgraph Unitaire["Test unitaire"]
        direction LR
        U1[ServiceRemise] -.mock.-> U2[[RepositoryClient - mocké]]
    end
    subgraph Integration["Test d'intégration"]
        direction LR
        I1[ServiceRemise] --> I2[RepositoryClient réel]
        I2 --> I3[(Base de données de test)]
    end
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// --- Code métier ---
interface ClientRepository
{
    public function estFidele(int $clientId): bool;
}

final class ServiceRemise
{
    public function __construct(private ClientRepository $repository) {}

    public function calculer(int $clientId, float $montant): float
    {
        return $this->repository->estFidele($clientId)
            ? $montant * 0.9
            : $montant;
    }
}
```

```php
use PHPUnit\Framework\TestCase;

// --- Test UNITAIRE : le repository est mocké, aucune vraie base de données ---
final class ServiceRemiseUnitTest extends TestCase
{
    public function testClientFideleObtientUneRemise(): void
    {
        $repository = $this->createStub(ClientRepository::class);
        $repository->method('estFidele')->willReturn(true);

        $service = new ServiceRemise($repository);

        $this->assertSame(90.0, $service->calculer(clientId: 1, montant: 100.0));
    }
}
```

```php
// --- Test D'INTÉGRATION : le repository réel interroge une vraie base de test ---
final class ServiceRemiseIntegrationTest extends TestCase
{
    private PDO $pdo;

    protected function setUp(): void
    {
        $this->pdo = new PDO('sqlite::memory:');
        $this->pdo->exec('CREATE TABLE clients (id INTEGER, fidele INTEGER)');
        $this->pdo->exec('INSERT INTO clients VALUES (1, 1)');
    }

    public function testCalculDeRemiseAvecUneVraieBaseDeDonnees(): void
    {
        $repository = new PdoClientRepository($this->pdo);
        $service = new ServiceRemise($repository);

        $this->assertSame(90.0, $service->calculer(clientId: 1, montant: 100.0));
    }
}
```

### JavaScript

```javascript
// --- Code métier ---
class ServiceRemise {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async calculer(clientId, montant) {
    const estFidele = await this.clientRepository.estFidele(clientId);
    return estFidele ? montant * 0.9 : montant;
  }
}

module.exports = { ServiceRemise };
```

```javascript
// --- Test UNITAIRE : le repository est mocké avec Jest ---
const { ServiceRemise } = require("./serviceRemise");

test("un client fidèle obtient une remise (unitaire, repository mocké)", async () => {
  const repositoryMocke = { estFidele: jest.fn().mockResolvedValue(true) };
  const service = new ServiceRemise(repositoryMocke);

  const total = await service.calculer(1, 100);

  expect(total).toBe(90);
});
```

```javascript
// --- Test D'INTÉGRATION : appel réel à une base SQLite en mémoire ---
const { ServiceRemise } = require("./serviceRemise");
const { SqlClientRepository } = require("./sqlClientRepository");
const { openTestDatabase } = require("./testDb");

test("un client fidèle obtient une remise (intégration, vraie base de données)", async () => {
  const db = await openTestDatabase();
  await db.run("INSERT INTO clients (id, fidele) VALUES (1, 1)");

  const repository = new SqlClientRepository(db);
  const service = new ServiceRemise(repository);

  const total = await service.calculer(1, 100);

  expect(total).toBe(90);
});
```

## Quand utiliser l'un ou l'autre ?

- Test unitaire : pour vérifier une logique métier isolée (calcul, validation, transformation) rapidement et souvent — à chaque sauvegarde ou en pré-commit.
- Test d'intégration : pour vérifier qu'une requête SQL est correcte, qu'un appel HTTP respecte le bon format, ou que plusieurs classes s'assemblent sans erreur de configuration.
- Une suite saine combine les deux : beaucoup de tests unitaires rapides pour la logique, un nombre plus restreint de tests d'intégration pour les points de jonction critiques.
- Évitez de mocker une dépendance dans un test qui a justement pour but de vérifier que cette dépendance fonctionne correctement en conditions réelles — ce serait un test d'intégration déguisé en test unitaire, qui ne teste plus rien d'utile.

## Points importants

- Un test unitaire rapide (millisecondes) peut tourner par centaines à chaque sauvegarde de fichier ; un test d'intégration, plus lent, tourne plus souvent en pré-push ou en CI.
- Un échec de test unitaire pointe précisément vers la logique cassée ; un échec de test d'intégration demande d'investiguer parmi plusieurs composants pour trouver la cause.
- Le périmètre d'un test (ce qu'il mocke, ce qu'il laisse réel) doit toujours être un choix conscient, pas un hasard d'implémentation.
- Ni l'un ni l'autre ne remplace les tests end-to-end, qui vérifient le système complet du point de vue de l'utilisateur final — les trois niveaux forment la pyramide des tests.
