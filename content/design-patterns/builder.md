---
title: "Le Pattern Builder expliqué simplement"
description: "Le Builder Pattern construit un objet complexe étape par étape, idéal quand un objet a de nombreux paramètres optionnels. Explication, analogie, diagramme et code PHP, Java, JavaScript."
date: 2026-07-10
category: "Design Patterns"
difficulty: "Intermédiaire"
tags: ["php", "java", "javascript", "design-patterns", "oop"]
summary: "Le Builder Pattern sépare la construction d'un objet complexe en une série d'étapes chaînées, chacune configurant une partie de l'objet. Il évite les constructeurs à rallonge et rend le code de construction lisible, même avec de nombreux paramètres optionnels."
bearMemory:
  - "Builder construit un objet complexe **étape par étape** ; contrairement à Factory, il ne choisit pas quel type créer, mais comment l'assembler."
  - "Signal d'alerte : un constructeur avec cinq paramètres optionnels ou plus, ou plusieurs constructeurs qui se chevauchent pour couvrir les combinaisons possibles."
  - "L'objet final produit par `construire()`/`build()` doit être valide et, idéalement, immuable."
interviewQuestions:
  - q: "Quelle différence entre Builder et Factory ?"
    a: "Factory répond à *quel type d'objet créer ?* à partir d'un paramètre simple, et retourne l'objet en un seul appel. Builder répond à *comment assembler un objet complexe, étape par étape ?*, souvent avec de nombreux paramètres optionnels ou des étapes conditionnelles, avant un appel final qui produit l'objet."
  - q: "Pourquoi ne pas simplement utiliser un constructeur avec des paramètres par défaut ?"
    a: "Au-delà de quatre ou cinq paramètres optionnels, un constructeur devient un « constructeur télescope » illisible à l'appel : on ne sait plus quel argument correspond à quel paramètre sans regarder la signature. Le Builder nomme chaque étape explicitement, ce qui rend le code appelant auto-documenté."
  - q: "Le pattern Builder peut-il produire un objet invalide ?"
    a: "C'est un risque si la méthode de construction finale ne valide rien. Un bon Builder vérifie, au moment de construire l'objet final, que les champs obligatoires sont présents et cohérents entre eux, plutôt que de laisser l'objet se retrouver dans un état incomplet."
---

## Le problème

Une classe `RequeteHttp` doit gérer une URL obligatoire, mais aussi une multitude d'éléments optionnels : méthode HTTP (GET par défaut), en-têtes, corps de la requête, timeout, authentification. Un constructeur avec dix paramètres optionnels devient vite illisible — c'est ce qu'on appelle un « constructeur télescope ». Impossible de savoir à l'appel quel argument correspond à quel paramètre sans consulter la signature complète, et chaque appelant doit passer `null` pour tout ce qu'il n'utilise pas.

## L'idée générale

Le Builder sépare la construction complexe d'un objet en une série d'**étapes chaînées**, chacune configurant une partie de l'objet. Une méthode finale (`build()` ou `construire()`) valide l'ensemble et retourne l'objet fini, généralement immuable une fois construit.

Deux éléments composent le pattern :

- **Builder** : la classe qui expose des méthodes pour configurer chaque partie de l'objet, plus une méthode finale de construction.
- **Product** : l'objet final construit, inconnu de l'appelant tant que la construction n'est pas terminée.

Le client enchaîne uniquement les étapes dont il a besoin ; tout le reste conserve une valeur par défaut sensée.

## Analogie du quotidien

C'est comme commander un sandwich dans une chaîne de restauration rapide où l'on compose son plat au comptoir : on choisit d'abord le pain, puis la viande, puis les légumes un par un, puis la sauce — chaque étape est optionnelle ou dispose d'un choix par défaut, et rien n'est réellement prêt tant qu'on n'a pas validé la commande à la fin. Le vendeur (le Builder) assemble le sandwich (le Product) étape par étape selon les choix exprimés, dans l'ordre où ils sont donnés, et ne le remet qu'une fois la commande finalisée.

## Diagramme

{{< mermaid >}}
classDiagram
    class RequeteHttpBuilder {
        -url: string
        -methode: string
        -headers: map
        -body: string
        -timeout: int
        +methode(m) RequeteHttpBuilder
        +header(cle, valeur) RequeteHttpBuilder
        +body(contenu) RequeteHttpBuilder
        +timeout(ms) RequeteHttpBuilder
        +construire() RequeteHttp
    }
    class RequeteHttp {
        +url: string
        +methode: string
        +headers: map
        +body: string
        +timeout: int
    }
    RequeteHttpBuilder ..> RequeteHttp : construit
{{< /mermaid >}}

## Exemple de code

### PHP

```php
final class RequeteHttp
{
    public function __construct(
        public readonly string $url,
        public readonly string $methode,
        public readonly array $headers,
        public readonly ?string $body,
        public readonly int $timeout,
    ) {}
}

final class RequeteHttpBuilder
{
    private string $methode = 'GET';
    private array $headers = [];
    private ?string $body = null;
    private int $timeout = 5000;

    public function __construct(private readonly string $url) {}

    public function methode(string $methode): self
    {
        $this->methode = $methode;
        return $this;
    }

    public function header(string $cle, string $valeur): self
    {
        $this->headers[$cle] = $valeur;
        return $this;
    }

    public function body(string $contenu): self
    {
        $this->body = $contenu;
        return $this;
    }

    public function timeout(int $ms): self
    {
        $this->timeout = $ms;
        return $this;
    }

    public function construire(): RequeteHttp
    {
        return new RequeteHttp($this->url, $this->methode, $this->headers, $this->body, $this->timeout);
    }
}

// Utilisation
$requete = (new RequeteHttpBuilder('https://api.exemple.com/commandes'))
    ->methode('POST')
    ->header('Content-Type', 'application/json')
    ->body('{"produit":"livre"}')
    ->timeout(3000)
    ->construire();
```

### Java

```java
final class RequeteHttp {
    private final String url;
    private final String methode;
    private final Map<String, String> headers;
    private final String body;
    private final int timeout;

    private RequeteHttp(RequeteHttpBuilder builder) {
        this.url = builder.url;
        this.methode = builder.methode;
        this.headers = builder.headers;
        this.body = builder.body;
        this.timeout = builder.timeout;
    }

    static class RequeteHttpBuilder {
        private final String url;
        private String methode = "GET";
        private Map<String, String> headers = new HashMap<>();
        private String body;
        private int timeout = 5000;

        public RequeteHttpBuilder(String url) {
            this.url = url;
        }

        public RequeteHttpBuilder methode(String methode) {
            this.methode = methode;
            return this;
        }

        public RequeteHttpBuilder header(String cle, String valeur) {
            this.headers.put(cle, valeur);
            return this;
        }

        public RequeteHttpBuilder body(String body) {
            this.body = body;
            return this;
        }

        public RequeteHttpBuilder timeout(int timeout) {
            this.timeout = timeout;
            return this;
        }

        public RequeteHttp build() {
            return new RequeteHttp(this);
        }
    }
}

// Utilisation
RequeteHttp requete = new RequeteHttp.RequeteHttpBuilder("https://api.exemple.com/commandes")
    .methode("POST")
    .header("Content-Type", "application/json")
    .body("{\"produit\":\"livre\"}")
    .timeout(3000)
    .build();
```

### JavaScript

```javascript
class RequeteHttp {
  constructor({ url, methode, headers, body, timeout }) {
    this.url = url;
    this.methode = methode;
    this.headers = headers;
    this.body = body;
    this.timeout = timeout;
  }
}

class RequeteHttpBuilder {
  #methode = "GET";
  #headers = {};
  #body = null;
  #timeout = 5000;

  constructor(url) {
    this.url = url;
  }

  methode(methode) {
    this.#methode = methode;
    return this;
  }

  header(cle, valeur) {
    this.#headers[cle] = valeur;
    return this;
  }

  body(contenu) {
    this.#body = contenu;
    return this;
  }

  timeout(ms) {
    this.#timeout = ms;
    return this;
  }

  construire() {
    return new RequeteHttp({
      url: this.url,
      methode: this.#methode,
      headers: this.#headers,
      body: this.#body,
      timeout: this.#timeout,
    });
  }
}

// Utilisation
const requete = new RequeteHttpBuilder("https://api.exemple.com/commandes")
  .methode("POST")
  .header("Content-Type", "application/json")
  .body('{"produit":"livre"}')
  .timeout(3000)
  .construire();
```

## Quand utiliser ce pattern ?

- Quand un objet a beaucoup de paramètres optionnels et qu'un constructeur classique deviendrait illisible (« constructeur télescope »).
- Quand la construction doit se faire en plusieurs étapes, parfois conditionnelles, avant d'obtenir un objet valide.
- Quand on veut que l'objet final soit immuable, tout en gardant une API de construction flexible et lisible.

Évitez Builder pour un objet simple à deux ou trois champs obligatoires : un constructeur classique, ou un named constructor, reste plus direct.

## Points importants

- Contrairement à Factory, Builder ne choisit pas quel type d'objet créer : il se concentre sur comment assembler un objet complexe, souvent unique, étape par étape.
- L'objet final est généralement immuable une fois `construire()`/`build()` appelé — c'est ce qui distingue un vrai Builder d'un simple enchaînement de setters.
- En PHP 8, les arguments nommés (`new RequeteHttp(url: ..., timeout: ...)`) couvrent une partie des cas d'usage du Builder pour des objets moins complexes ; le pattern garde son intérêt dès que la construction implique de la logique conditionnelle ou des étapes dépendantes entre elles.
- Un Builder peut aussi servir à construire des structures composites — un document avec des sections imbriquées, par exemple — pas seulement des objets à plat.
