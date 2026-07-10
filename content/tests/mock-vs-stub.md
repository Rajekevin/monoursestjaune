---
title: "Mock vs Stub"
description: "Un stub retourne des valeurs prédéfinies, un mock vérifie que des interactions précises ont bien eu lieu. Différence précise, analogie, diagramme et code PHPUnit, Jest."
date: 2026-07-10
category: "Tests"
difficulty: "Intermédiaire"
tags: ["tests", "unit-testing", "php", "javascript"]
summary: "Un stub et un mock remplacent tous deux une vraie dépendance dans un test, mais pour des raisons différentes : le stub fournit des données prêtes à l'emploi, le mock vérifie que le code testé a bien effectué certains appels."
bearMemory:
  - "Un stub répond à *'que dois-je retourner ?'* ; un mock répond à *'ai-je bien été appelé, et comment ?'*"
  - "On **interroge l'état** avec un stub (la valeur retournée) ; on **vérifie un comportement** avec un mock (les appels effectués)."
  - "Un test avec trop de vérifications de mocks devient fragile : il échoue au moindre changement d'implémentation, même si le comportement observable reste correct."
interviewQuestions:
  - q: "Quelle différence entre un mock et un stub ?"
    a: "Un stub est un double de test qui retourne des valeurs prédéfinies quand on l'appelle — il sert à fournir des données sans se soucier de la façon dont on l'a appelé. Un mock, en plus de pouvoir retourner des valeurs, enregistre les appels qu'il reçoit et permet de vérifier après coup qu'une méthode précise a bien été appelée, avec les bons arguments et le bon nombre de fois. En résumé : le stub fournit des données, le mock vérifie des interactions."
  - q: "Peut-on utiliser un mock partout où on utilise un stub ?"
    a: "Techniquement souvent oui, mais ce n'est pas souhaitable. Un mock vérifie l'implémentation (quels appels ont été faits), ce qui rend le test fragile à tout refactoring qui change la façon d'obtenir le même résultat. Un stub, plus neutre, ne vérifie que la donnée reçue en sortie. Il vaut mieux réserver le mock aux cas où l'interaction elle-même est le comportement à vérifier — par exemple, s'assurer qu'un email a bien été envoyé."
  - q: "Pourquoi dit-on qu'un test bâti autour de mocks est plus fragile qu'un test bâti autour de stubs ?"
    a: "Parce qu'un mock vérifie le *comment* (quelles méthodes ont été appelées, avec quels arguments), qui est un détail d'implémentation. Si on change la façon d'obtenir le même résultat métier — sans changer le résultat observable — un test avec des vérifications de mocks peut casser alors que le comportement réel du système, lui, n'a pas changé. Un test bâti sur des stubs, qui vérifie seulement le résultat final, survit mieux à ce genre de refactoring."
---

## Le problème

Un développeur teste un service d'envoi de notification qui dépend d'un `EmailSender`. Il crée un double de test pour éviter d'envoyer un vrai email pendant les tests, mais hésite : doit-il simplement faire en sorte que l'appel ne plante pas et retourne une valeur correcte, ou doit-il vérifier que la méthode `envoyer()` a bien été appelée avec le bon destinataire ?

Ces deux besoins sont différents et confondre les deux mène à des tests soit incomplets (on ne vérifie jamais qu'un email a été envoyé), soit trop rigides (on vérifie des détails d'implémentation qui n'ont pas d'importance pour le comportement réel du système). "Mock" et "stub" sont souvent utilisés indistinctement dans le langage courant, mais ils répondent à deux questions de test différentes.

## L'idée générale

Un **stub** est un double de test qui retourne des valeurs prédéfinies quand on l'appelle. Son rôle est de fournir des données contrôlées pour que le code testé ait quelque chose à traiter, sans se soucier du nombre ou de la nature exacte des appels qu'il reçoit. On l'utilise pour poser une situation ("le client est fidèle", "l'API renvoie ce prix") et observer comment le code réagit à cette situation.

Un **mock** va plus loin : en plus de pouvoir retourner des valeurs, il enregistre les appels qu'il reçoit (méthode appelée, arguments passés, nombre de fois) pour permettre de **vérifier après coup** que le code testé a bien interagi avec lui comme attendu. On l'utilise quand l'interaction elle-même *est* le comportement à valider — par exemple : "un email de confirmation a-t-il bien été envoyé ?"

La distinction se résume à la nature de l'assertion :

- **Stub → assertion sur l'état** : on vérifie la valeur retournée par le code testé.
- **Mock → assertion sur le comportement** : on vérifie qu'un appel précis a bien eu lieu sur la dépendance.

## Analogie du quotidien

Un stub, c'est comme un figurant dans un film qui répond toujours la même réplique préparée à l'avance, quelle que soit la question posée — il sert le décor, sans qu'on s'intéresse à combien de fois on lui a parlé. Un mock, c'est comme un huissier de justice présent sur le tournage : il note precisément qui a dit quoi, à qui, et combien de fois — pas pour jouer un rôle dans la scène, mais pour produire un constat vérifiable après coup.

Dans un test, le stub joue son rôle sans qu'on l'interroge sur son passé ; le mock, lui, est interrogé après l'action pour confirmer que les bonnes interactions ont bien eu lieu.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant Test
    participant Service as ServiceNotification
    participant Stub as ClientRepository (stub)
    participant Mock as EmailSender (mock)

    Test->>Stub: configure : estFidele() retourne true
    Test->>Service: notifier(clientId)
    Service->>Stub: estFidele(clientId)
    Stub-->>Service: true (valeur prédéfinie)
    Service->>Mock: envoyer(email, "Merci pour votre fidélité")
    Mock-->>Service: void
    Test->>Mock: vérifie que envoyer() a été appelé avec les bons arguments
{{< /mermaid >}}

## Exemple de code

### PHP

```php
interface ClientRepository
{
    public function estFidele(int $clientId): bool;
}

interface EmailSender
{
    public function envoyer(string $destinataire, string $message): void;
}

final class ServiceNotification
{
    public function __construct(
        private ClientRepository $repository,
        private EmailSender $emailSender,
    ) {}

    public function notifier(int $clientId, string $email): void
    {
        if ($this->repository->estFidele($clientId)) {
            $this->emailSender->envoyer($email, 'Merci pour votre fidélité !');
        }
    }
}
```

```php
use PHPUnit\Framework\TestCase;

final class ServiceNotificationTest extends TestCase
{
    public function testUnClientFideleRecoitUnEmailDeRemerciement(): void
    {
        // STUB : fournit une donnée contrôlée, on ne vérifie jamais comment il est appelé
        $repository = $this->createStub(ClientRepository::class);
        $repository->method('estFidele')->willReturn(true);

        // MOCK : on vérifie que envoyer() est appelé exactement une fois, avec les bons arguments
        $emailSender = $this->createMock(EmailSender::class);
        $emailSender->expects($this->once())
            ->method('envoyer')
            ->with('client@example.com', 'Merci pour votre fidélité !');

        $service = new ServiceNotification($repository, $emailSender);
        $service->notifier(clientId: 1, email: 'client@example.com');
    }

    public function testUnClientNonFideleNeRecoitAucunEmail(): void
    {
        $repository = $this->createStub(ClientRepository::class);
        $repository->method('estFidele')->willReturn(false);

        // MOCK : on vérifie ici l'ABSENCE d'appel
        $emailSender = $this->createMock(EmailSender::class);
        $emailSender->expects($this->never())->method('envoyer');

        $service = new ServiceNotification($repository, $emailSender);
        $service->notifier(clientId: 2, email: 'autre@example.com');
    }
}
```

### JavaScript

```javascript
class ServiceNotification {
  constructor(clientRepository, emailSender) {
    this.clientRepository = clientRepository;
    this.emailSender = emailSender;
  }

  async notifier(clientId, email) {
    const estFidele = await this.clientRepository.estFidele(clientId);
    if (estFidele) {
      await this.emailSender.envoyer(email, "Merci pour votre fidélité !");
    }
  }
}

module.exports = { ServiceNotification };
```

```javascript
const { ServiceNotification } = require("./serviceNotification");

test("un client fidèle reçoit un email de remerciement", async () => {
  // STUB : jest.fn() configuré pour retourner une valeur, jamais interrogé sur ses appels
  const repositoryStub = { estFidele: jest.fn().mockResolvedValue(true) };

  // MOCK : on va vérifier après coup qu'il a été appelé avec les bons arguments
  const emailSenderMock = { envoyer: jest.fn().mockResolvedValue(undefined) };

  const service = new ServiceNotification(repositoryStub, emailSenderMock);
  await service.notifier(1, "client@example.com");

  expect(emailSenderMock.envoyer).toHaveBeenCalledTimes(1);
  expect(emailSenderMock.envoyer).toHaveBeenCalledWith(
    "client@example.com",
    "Merci pour votre fidélité !"
  );
});

test("un client non fidèle ne reçoit aucun email", async () => {
  const repositoryStub = { estFidele: jest.fn().mockResolvedValue(false) };
  const emailSenderMock = { envoyer: jest.fn() };

  const service = new ServiceNotification(repositoryStub, emailSenderMock);
  await service.notifier(2, "autre@example.com");

  // Vérification d'ABSENCE d'appel, typique d'un mock
  expect(emailSenderMock.envoyer).not.toHaveBeenCalled();
});
```

## Quand utiliser mock ou stub ?

- Utilisez un **stub** quand vous avez simplement besoin de contrôler une donnée d'entrée pour observer comment le code réagit à un état donné — c'est le cas le plus courant.
- Utilisez un **mock** quand l'appel lui-même est le comportement à valider : un email envoyé, un événement publié, un paiement déclenché — des effets de bord où la sortie n'est pas une valeur de retour observable autrement.
- Évitez de "mocker" par réflexe une dépendance juste pour vérifier ses appels si le résultat final (une valeur retournée, un état modifié) suffit déjà à valider le comportement — préférez alors un stub, moins fragile.
- Limitez le nombre de mocks par test : un test qui vérifie dix interactions différentes devient un test d'implémentation, pas de comportement.

## Points importants

- Le vocabulaire "mock" est souvent utilisé au sens large dans le langage courant pour désigner tout double de test (mock, stub, fake, spy) — mais dans un entretien technique, la distinction précise entre stub (état) et mock (comportement) est attendue.
- Un test qui abuse des mocks devient couplé aux détails d'implémentation : un refactoring qui ne change pas le comportement observable peut quand même le casser.
- PHPUnit distingue explicitement `createStub()` et `createMock()` ; Jest, plus permissif, utilise `jest.fn()` pour les deux usages — la différence tient alors uniquement dans la présence ou l'absence d'assertions `toHaveBeenCalledWith`.
- Ni le mock ni le stub ne remplacent un test d'intégration : les deux isolent volontairement le code testé de ses vraies dépendances.
