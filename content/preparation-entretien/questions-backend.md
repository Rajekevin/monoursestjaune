---
title: "Questions Backend"
type: interview-hub
description: "Les questions techniques backend les plus posées en entretien, regroupées par thème, avec des réponses claires et des liens vers les articles complets."
summary: "Les questions qui reviennent le plus souvent dans un entretien technique backend — classées par thème, avec une réponse directe et un lien vers l'article complet pour aller plus loin."
groups:
  - theme: "Principes de conception (SOLID)"
    questions:
      - q: "Explique SOLID"
        a: "SOLID regroupe cinq principes de conception orientée objet : **S**ingle Responsibility (une classe, une seule raison de changer), **O**pen/Closed (ouvert à l'extension, fermé à la modification), **L**iskov Substitution (une sous-classe doit pouvoir remplacer sa classe mère sans casser le comportement attendu), **I**nterface Segregation (préférer plusieurs interfaces spécifiques à une seule interface générale) et **D**ependency Inversion (dépendre d'abstractions, pas d'implémentations concrètes). Ensemble, ils visent un code plus facile à faire évoluer et à tester."
        link: "/architecture-logicielle/solid-explique-simplement"
      - q: "Quelle différence entre couplage fort et couplage faible ?"
        a: "Le couplage mesure à quel point deux modules dépendent l'un de l'autre. Un couplage fort signifie qu'une modification dans un module oblige presque toujours à modifier l'autre. Un couplage faible, obtenu notamment via des interfaces et l'injection de dépendance, permet de faire évoluer ou remplacer un module sans toucher au reste du système."
        link: "/architecture-logicielle/couplage-fort-vs-faible"
  - theme: "Bases de données"
    questions:
      - q: "Explique une transaction SQL"
        a: "Une transaction regroupe plusieurs opérations SQL en une seule unité indivisible : soit toutes les opérations réussissent et sont validées (`COMMIT`), soit une échoue et tout est annulé (`ROLLBACK`). Les transactions garantissent les propriétés ACID — Atomicité, Cohérence, Isolation, Durabilité — indispensables dès qu'une opération métier touche plusieurs tables, comme un virement bancaire."
        link: "/bases-de-donnees/transactions-acid"
      - q: "Pourquoi un index accélère une requête ?"
        a: "Sans index, la base doit parcourir toutes les lignes d'une table pour trouver celles qui correspondent à un critère (*full table scan*). Un index construit une structure arborescente triée (souvent un B-Tree) sur une ou plusieurs colonnes, ce qui permet à la base de retrouver les lignes recherchées en un nombre d'étapes logarithmique plutôt que linéaire — au prix d'un coût supplémentaire à l'écriture."
        link: "/bases-de-donnees/index-bdd"
  - theme: "API et protocoles"
    questions:
      - q: "Différence entre REST et SOAP"
        a: "REST est un style d'architecture qui s'appuie sur les verbes HTTP standards (GET, POST, PUT, DELETE), transporte généralement du JSON, et considère chaque ressource comme une URL. SOAP est un protocole plus strict et plus verbeux, basé sur XML, avec un contrat formel (WSDL) et des standards intégrés pour la sécurité et les transactions. REST domine aujourd'hui pour les API web grand public grâce à sa simplicité ; SOAP reste présent dans certains systèmes d'entreprise ou bancaires qui exigent des garanties contractuelles fortes."
      - q: "Comment optimiser une API ?"
        a: "Plusieurs leviers, souvent combinés : mettre en cache les réponses qui changent peu (HTTP cache, Redis), paginer les listes plutôt que tout renvoyer d'un coup, éviter le problème N+1 en base de données, compresser les réponses, ne renvoyer que les champs nécessaires, et surveiller les temps de réponse réels via du monitoring plutôt que deviner où se situe le goulot d'étranglement."
        link: "/cloud-devops/scalabilite"
  - theme: "Conteneurisation et orchestration"
    questions:
      - q: "Explique Docker"
        a: "Docker permet d'empaqueter une application avec toutes ses dépendances (code, runtime, librairies, configuration) dans un conteneur : une unité isolée et portable qui s'exécute de façon identique sur n'importe quelle machine. Contrairement à une machine virtuelle, un conteneur partage le noyau du système hôte, ce qui le rend beaucoup plus léger et rapide à démarrer."
        link: "/cloud-devops/docker-explique-simplement"
      - q: "Explique Kubernetes"
        a: "Kubernetes orchestre des conteneurs à grande échelle : il décide où les faire tourner, les redémarre automatiquement s'ils tombent, les fait évoluer en nombre selon la charge (scaling), et gère leur mise en réseau. Là où Docker répond à *comment empaqueter une application*, Kubernetes répond à *comment faire tourner des centaines de conteneurs de façon fiable en production*."
        link: "/cloud-devops/kubernetes-explique-simplement"
---

Un entretien technique backend revient presque toujours sur les mêmes fondamentaux : principes de conception, bases de données, API, conteneurisation. Les questions ci-dessous sont classées par thème — cliquez sur une question pour voir la réponse, et suivez le lien vers l'article complet pour creuser le sujet.
