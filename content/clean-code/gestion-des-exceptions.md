---
title: "Gérer proprement les exceptions"
description: "Des exceptions métier nommées, jamais avalées silencieusement, traduites en réponse HTTP à un seul endroit — les trois règles qui évitent le chaos."
date: 2026-07-10
category: "Clean Code"
difficulty: "Intermédiaire"
tags: ["clean-code", "php", "java", "backend"]
summary: "Une exception bien gérée porte un nom qui dit ce qui s'est passé, ne disparaît jamais silencieusement dans un catch vide, et se traduit en réponse utilisateur à un seul endroit — pas dans chaque contrôleur."
bearMemory:
  - "Un `catch` vide est une **scène de crime sans témoin** : l'erreur a eu lieu, mais plus aucune trace n'explique pourquoi."
  - "Des exceptions **métier nommées** (`InsufficientStockException`) valent mieux qu'une exception générique : le nom porte déjà le diagnostic."
  - "Le métier **lance**, la couche HTTP (ou CLI) **traduit** — à un seul endroit, jamais dispersé dans chaque contrôleur."
interviewQuestions:
  - q: "Pourquoi un catch vide est-il considéré comme une mauvaise pratique grave, et pas juste un raccourci ?"
    a: "Parce qu'il fait disparaître l'information au moment précis où elle est produite. Une erreur avalée silencieusement continue de provoquer des comportements incohérents plus loin dans le programme, sans qu'aucune trace n'indique la cause réelle — le bug devient beaucoup plus long à diagnostiquer que si l'exception avait simplement remonté ou été loggée."
  - q: "Faut-il créer une exception personnalisée pour chaque erreur possible ?"
    a: "Non — l'objectif n'est pas de multiplier les classes, mais de nommer les erreurs qui ont un sens métier et qui doivent être traitées différemment (`InsufficientStockException` vs `InvalidPaymentMethodException`). Une erreur purement technique et imprévue peut rester une exception générique : elle indique un bug, pas une règle métier violée, et sera traitée comme une erreur 500 plutôt que traduite en message utilisateur."
---

## Le problème

Un `try/catch` vide, ou un `catch (Exception $e) {}` qui ne fait rien, fait disparaître une erreur sans laisser de trace. Le programme continue comme si de rien n'était, jusqu'à ce qu'un comportement incohérent apparaisse ailleurs — une commande sans email de confirmation, un solde qui ne correspond pas. Retrouver la cause devient une enquête sans indices, alors que l'information existait au moment précis où l'exception a été avalée.

À l'inverse, un code qui ne distingue pas les erreurs entre elles (`throw new Exception('erreur')` partout) oblige l'appelant à deviner ce qui s'est vraiment passé, ou pire, à parser un message texte pour décider quoi faire.

## L'idée générale

Trois règles couvrent la majorité des cas :

1. **Des exceptions métier spécifiques et nommées**, plutôt qu'une exception générique. `EmptyOrderException`, `InsufficientStockException` : le nom porte déjà le diagnostic, sans avoir à lire le message ou la pile d'appels.
2. **Ne jamais avaler une exception silencieusement.** Un `catch` doit soit traiter réellement l'erreur, soit la logger, soit la laisser remonter. Un `catch` vide est presque toujours un bug caché.
3. **Le métier lance, la couche présentation traduit — à un seul endroit.** Le code métier n'a pas à connaître HTTP ou les codes de statut : il lève une exception qui décrit ce qui s'est passé. Une couche unique (un gestionnaire d'exceptions global, un middleware) traduit cette exception en réponse appropriée, de façon cohérente sur toute l'application.

## Analogie du quotidien

Une exception avalée silencieusement, c'est comme un détecteur de fumée qu'on débranche parce qu'il sonne — le problème n'est pas résolu, on a juste supprimé le signal qui permettait de le remarquer. Le jour où un vrai incendie démarre, plus personne n'est prévenu.

Une bonne gestion d'exception, c'est un détecteur qui sonne (l'exception remonte), avec une étiquette qui dit précisément d'où vient la fumée (le nom de l'exception), et une seule personne désignée pour décider quoi faire de l'alerte (le gestionnaire centralisé), plutôt que chaque pièce de la maison qui réagit à sa façon.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant Métier as Code métier
    participant Handler as Gestionnaire d'exceptions
    participant Client as Client HTTP

    Métier->>Métier: Règle violée (ex : stock insuffisant)
    Métier-->>Handler: throw InsufficientStockException
    Note over Métier,Handler: Le métier ignore HTTP,<br/>il lance juste une exception nommée
    Handler->>Handler: Traduit l'exception en réponse
    Handler-->>Client: HTTP 422 + message clair
{{< /mermaid >}}

## Exemple de code

### PHP

```php
// Exceptions métier nommées, dans le domaine
final class EmptyOrderException extends DomainException {}
final class InsufficientStockException extends DomainException {}

// Le métier lance, sans jamais connaître HTTP
final class PlaceOrderHandler
{
    public function handle(PlaceOrderCommand $command): void
    {
        if (empty($command->lines)) {
            throw new EmptyOrderException('Une commande doit contenir au moins un article.');
        }

        foreach ($command->lines as $line) {
            if (!$this->stock->isAvailable($line->productId, $line->qty)) {
                throw new InsufficientStockException("Stock insuffisant pour {$line->productId}");
            }
        }

        // ... suite du traitement
    }
}

// Traduction centralisée : un seul endroit connaît le lien exception -> HTTP
final class DomainExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if ($exception instanceof DomainException) {
            $event->setResponse(new JsonResponse(
                ['error' => $exception->getMessage()],
                422
            ));
        }
        // Tout le reste (bugs imprévus) : 500 + log complet, jamais masqué
    }
}
```

### Java

```java
// Exceptions métier nommées
public class EmptyOrderException extends RuntimeException {
    public EmptyOrderException(String message) { super(message); }
}
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) { super(message); }
}

// Le métier lance, sans connaître HTTP
public class PlaceOrderHandler {
    public void handle(PlaceOrderCommand command) {
        if (command.getLines().isEmpty()) {
            throw new EmptyOrderException("Une commande doit contenir au moins un article.");
        }
        for (OrderLine line : command.getLines()) {
            if (!stock.isAvailable(line.getProductId(), line.getQty())) {
                throw new InsufficientStockException("Stock insuffisant pour " + line.getProductId());
            }
        }
        // ... suite du traitement
    }
}

// Traduction centralisée (ex: @ControllerAdvice Spring)
@ControllerAdvice
public class DomainExceptionHandler {
    @ExceptionHandler(DomainException.class)
    public ResponseEntity<?> handleDomainException(DomainException ex) {
        return ResponseEntity.status(422).body(Map.of("error", ex.getMessage()));
    }
}
```

## Quand appliquer ces règles ?

- Systématiquement dès qu'une erreur a un sens métier identifiable (règle violée, ressource absente, action interdite).
- Un `catch` vide n'est acceptable que dans de très rares cas explicitement documentés (par exemple, une opération de nettoyage qui peut légitimement échouer sans conséquence) — et encore, un commentaire doit expliquer pourquoi.
- Sur du code strictement interne et jetable (un script ponctuel), le formalisme complet peut être allégé — mais jamais sur du code qui tourne en production.

## Points importants

- Le gain principal : plus aucun `try/catch` décoratif dispersé dans les contrôleurs, et des réponses d'erreur cohérentes sur toute l'application.
- Une frontière nette se dessine : un code HTTP 4xx signifie « la règle métier a refusé », un 500 signifie « on a un bug » — ne jamais mélanger les deux.
- Logger l'exception (avec sa stack trace) au moment où elle est traduite, même si elle est ensuite transformée en message utilisateur simple : l'information technique complète doit rester disponible pour le diagnostic.
