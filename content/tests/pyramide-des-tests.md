---
title: "Pyramide des tests"
description: "La pyramide des tests répartit l'effort : beaucoup de tests unitaires rapides à la base, moins de tests d'intégration au milieu, peu de tests end-to-end lents au sommet."
date: 2026-07-10
category: "Tests"
difficulty: "Débutant"
tags: ["tests", "unit-testing", "bdd", "php"]
summary: "La pyramide des tests décrit une répartition saine de l'effort de test : de nombreux tests unitaires rapides à la base, un nombre plus restreint de tests d'intégration au milieu, et très peu de tests end-to-end, lents mais réalistes, au sommet."
bearMemory:
  - "Plus on monte dans la pyramide, plus les tests sont **réalistes mais lents et fragiles** ; plus on descend, plus ils sont **rapides mais isolés**."
  - "La forme pyramidale n'est pas un dogme esthétique : elle reflète un vrai compromis coût/vitesse/confiance qui doit guider où investir l'effort de test."
  - "Une 'pyramide inversée' (beaucoup de tests end-to-end, peu de tests unitaires) donne une suite lente, fragile et coûteuse à maintenir — un signal d'alerte fréquent en entretien."
interviewQuestions:
  - q: "Pourquoi la pyramide des tests a-t-elle une base large et un sommet étroit ?"
    a: "Parce que les tests unitaires, à la base, sont rapides et bon marché à écrire et à maintenir : on peut donc en avoir beaucoup. Les tests end-to-end, au sommet, sont lents, plus fragiles (ils dépendent de nombreux composants réels : réseau, base de données, UI) et coûteux à maintenir : on en garde donc peu, réservés aux parcours critiques. La forme pyramidale reflète ce compromis entre confiance apportée et coût de maintenance."
  - q: "Qu'est-ce qu'une 'pyramide inversée' et pourquoi est-ce un problème ?"
    a: "C'est une suite de tests dominée par des tests end-to-end, avec peu de tests unitaires — souvent le résultat d'une équipe qui privilégie les tests 'qui ressemblent le plus à la réalité'. Le problème est la lenteur (une suite e2e peut prendre des heures), la fragilité (un test e2e casse pour des raisons sans rapport avec un vrai bug : timing, environnement) et la difficulté de localiser la cause d'un échec, qui peut venir de n'importe où dans la chaîne."
  - q: "Un test end-to-end peut-il remplacer un test unitaire ?"
    a: "Non, ils vérifient des choses différentes à des vitesses différentes. Un test end-to-end confirme qu'un parcours complet fonctionne du point de vue utilisateur, mais s'il échoue, il ne dit pas où est le problème parmi tous les composants traversés. Un test unitaire, plus ciblé, isole précisément une unité de logique et permet un diagnostic immédiat. Les deux niveaux se complètent, ils ne se substituent pas l'un à l'autre."
---

## Le problème

Une équipe, soucieuse de tester "comme un vrai utilisateur", construit sa confiance principalement sur des tests end-to-end qui pilotent un navigateur automatisé de bout en bout. Au fil des mois, la suite de tests grossit, prend plus d'une heure à s'exécuter, et devient instable : des tests échouent de façon aléatoire à cause de délais réseau ou d'animations UI, sans rapport avec un vrai bug. Personne ne fait plus confiance aux échecs, et l'équipe finit par relancer les tests "jusqu'à ce que ça passe".

Le problème n'est pas les tests end-to-end en eux-mêmes, mais leur proportion excessive dans l'ensemble de la suite. Toutes les formes de test n'ont pas le même coût ni le même rôle, et les mélanger sans stratégie mène à une suite lente, peu fiable, et redoutée plutôt qu'utile.

## L'idée générale

La pyramide des tests, popularisée par Mike Cohn, propose une répartition de l'effort de test en trois niveaux, empilés du plus nombreux et rapide au moins nombreux et lent :

- **Tests unitaires (base)** : testent une unité de code isolée, dépendances mockées. Très rapides (millisecondes), très nombreux, faciles à écrire et à maintenir.
- **Tests d'intégration (milieu)** : vérifient que plusieurs composants réels collaborent correctement (base de données, appels API internes). Plus lents, moins nombreux.
- **Tests end-to-end (sommet)** : simulent un parcours utilisateur complet à travers le système réel (souvent via un navigateur automatisé). Très réalistes, mais lents et plus fragiles ; on en garde peu, réservés aux parcours critiques.

L'idée n'est pas de choisir un seul niveau, mais de doser l'investissement selon le compromis rapidité/réalisme de chaque niveau : beaucoup de tests bon marché à la base pour couvrir la logique en détail, quelques tests coûteux au sommet pour valider que tout s'assemble correctement du point de vue de l'utilisateur final.

## Analogie du quotidien

La pyramide des tests, c'est comme les contrôles qualité dans la fabrication d'une voiture. On teste chaque pièce individuellement en très grand nombre — chaque vis, chaque capteur — car ces contrôles sont rapides et bon marché à répéter à chaque pièce produite. On teste ensuite des sous-ensembles assemblés (le moteur complet sur banc d'essai) en nombre plus restreint, car c'est plus long à mettre en place. Enfin, on ne fait rouler qu'un nombre limité de voitures complètes sur circuit d'essai réel — un test long, coûteux, mais qui valide l'expérience finale telle que le client la vivra.

Personne ne teste chaque voiture terminée sur circuit pour vérifier que chaque vis est bien serrée : ce serait beaucoup trop lent. Et personne ne se fie uniquement au contrôle des vis pour garantir que la voiture roule bien une fois assemblée. Chaque niveau de contrôle répond à une question différente.

## Diagramme

{{< mermaid >}}
flowchart TD
    subgraph Pyramide[" "]
        direction TB
        E2E["End-to-end<br/>peu nombreux · lents · très réalistes"]
        INT["Tests d'intégration<br/>nombre modéré · vitesse moyenne"]
        UNIT["Tests unitaires<br/>très nombreux · très rapides · isolés"]
    end
    E2E --- INT
    INT --- UNIT
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// --- Niveau 1 : test UNITAIRE, dépendance mockée, exécution en millisecondes ---
use PHPUnit\Framework\TestCase;

final class CalculateurTvaUnitTest extends TestCase
{
    public function testCalculLaTvaAVingtPourcent(): void
    {
        $calculateur = new CalculateurTva(tauxRepository: $this->createStub(TauxRepository::class));

        $this->assertSame(20.0, $calculateur->calculer(100.0, 'FR'));
    }
}
```

```php
// --- Niveau 2 : test D'INTÉGRATION, vraie base de test, plus lent ---
final class CalculateurTvaIntegrationTest extends TestCase
{
    public function testRecupereLeTauxDepuisUneVraieBaseDeDonnees(): void
    {
        $pdo = new PDO('sqlite::memory:');
        $pdo->exec('CREATE TABLE taux (pays TEXT, taux REAL)');
        $pdo->exec("INSERT INTO taux VALUES ('FR', 0.20)");

        $calculateur = new CalculateurTva(new PdoTauxRepository($pdo));

        $this->assertSame(20.0, $calculateur->calculer(100.0, 'FR'));
    }
}
```

```php
// --- Niveau 3 : test END-TO-END (Symfony Panther), parcours navigateur complet ---
use Symfony\Component\Panther\PantherTestCase;

final class ParcoursCommandeE2ETest extends PantherTestCase
{
    public function testUnClientPeutAllerJusquAuPaiement(): void
    {
        $client = static::createPantherClient();

        $client->request('GET', '/produit/123');
        $client->clickLink('Ajouter au panier');
        $client->clickLink('Passer commande');

        $client->submitForm('Payer', ['carte' => '4242424242424242']);

        $this->assertSelectorTextContains('h1', 'Commande confirmée');
    }
}
```

### JavaScript

```javascript
// --- Niveau 1 : test UNITAIRE avec Jest, dépendance mockée ---
test("calcule 20% de TVA (unitaire)", () => {
  const tauxRepositoryMock = { getTaux: jest.fn().mockReturnValue(0.2) };
  const calculateur = new CalculateurTva(tauxRepositoryMock);

  expect(calculateur.calculer(100, "FR")).toBe(20);
});
```

```javascript
// --- Niveau 2 : test D'INTÉGRATION, vraie base SQLite en mémoire ---
test("récupère le taux depuis une vraie base de données (intégration)", async () => {
  const db = await openTestDatabase();
  await db.run("INSERT INTO taux VALUES ('FR', 0.20)");

  const calculateur = new CalculateurTva(new SqlTauxRepository(db));

  expect(await calculateur.calculer(100, "FR")).toBe(20);
});
```

```javascript
// --- Niveau 3 : test END-TO-END avec Playwright, navigateur réel ---
const { test, expect } = require("@playwright/test");

test("un client peut aller jusqu'au paiement (end-to-end)", async ({ page }) => {
  await page.goto("/produit/123");
  await page.click("text=Ajouter au panier");
  await page.click("text=Passer commande");

  await page.fill("#carte", "4242424242424242");
  await page.click("text=Payer");

  await expect(page.locator("h1")).toHaveText("Commande confirmée");
});
```

## Quand utiliser chaque niveau ?

- Tests unitaires : pour toute logique métier isolable — la majorité de votre effort de test devrait s'y concentrer, car ils donnent le retour le plus rapide.
- Tests d'intégration : pour les points de jonction sensibles — requêtes SQL, appels à un service interne, sérialisation d'une API — là où l'assemblage réel comporte un risque que le mock ne peut pas révéler.
- Tests end-to-end : réservés aux parcours critiques du point de vue métier (inscription, paiement, connexion) — pas pour couvrir chaque variante possible, ce qui serait beaucoup trop lent à exécuter et à maintenir.
- Si votre suite met plus de quelques minutes à s'exécuter en local, c'est souvent le signe d'une pyramide déséquilibrée, avec trop de poids porté par les niveaux supérieurs.

## Points importants

- La forme pyramidale n'est pas une règle stricte à respecter au chiffre près : c'est un principe de répartition de l'effort selon le rapport coût/bénéfice de chaque niveau.
- Une "pyramide inversée" ou un "diamant" (beaucoup d'intégration, peu d'unitaire et d'e2e) sont des variantes parfois défendues selon le contexte — l'important est d'avoir fait ce choix consciemment, pas par accumulation hasardeuse.
- Un test end-to-end qui échoue est souvent le symptôme d'un problème détectable plus tôt et plus précisément par un test unitaire ou d'intégration — quand c'est le cas, ajouter le test manquant au bon niveau plutôt que d'empiler les tests e2e.
- La vitesse d'exécution de la suite complète conditionne directement la fréquence à laquelle l'équipe la relance : une suite lente est une suite qu'on finit par éviter de lancer.
