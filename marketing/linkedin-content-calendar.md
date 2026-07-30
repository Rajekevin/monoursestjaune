# Calendrier de contenu LinkedIn — MyBearIsYellow

Ce fichier n'est pas publié sur le site (il vit hors de `content/`, Hugo l'ignore). C'est une réserve de posts prêts à copier-coller sur LinkedIn, construits à partir des vrais articles déjà en ligne — pas de faux contenu, pas de fausses stats, juste une vraie base d'articles mise en avant à un rythme régulier pour donner une impression de blog actif.

**Rythme suggéré** : 2 à 3 posts par semaine, jours variés (mardi/jeudi ont statistiquement le meilleur engagement B2B tech, mais casse un peu le pattern pour ne pas paraître automatisé). Espace les catégories pour ne pas donner l'impression de ne parler que de Design Patterns.

**Banque de hashtags** (piocher 4 à 6 par post, jamais plus — au-delà ça fait spam) :
`#DeveloppeurWeb #SoftwareEngineering #CleanCode #Backend #ArchitectureLogicielle #DesignPatterns #TDD #DevOps #Docker #Kubernetes #BasesDeDonnees #SQL #EntretienTechnique #TechFrance #Programmation #WebDev #PHP #Java #JavaScript #100DaysOfCode`

**Lien de base** : `https://www.mybearisyellow.me`

## Calendrier de publication (dates suggérées)

À programmer via le planificateur natif LinkedIn (icône 🕒 dans la fenêtre de rédaction d'un post, "Programmer pour plus tard") — voir explication plus bas.

| # | Date suggérée | Jour |
|---|---|---|
| 1 | 2026-08-04 | Mardi |
| 2 | 2026-08-06 | Jeudi |
| 3 | 2026-08-08 | Samedi |
| 4 | 2026-08-11 | Mardi |
| 5 | 2026-08-13 | Jeudi |
| 6 | 2026-08-15 | Samedi |
| 7 | 2026-08-18 | Mardi |
| 8 | 2026-08-20 | Jeudi |
| 9 | 2026-08-22 | Samedi |
| 10 | 2026-08-25 | Mardi |
| 11 | 2026-08-27 | Jeudi |
| 12 | 2026-08-29 | Samedi |
| 13 | 2026-09-01 | Mardi |
| 14 | 2026-09-03 | Jeudi |
| 15 | 2026-09-05 | Samedi |

---

## Semaine 1 — Lancement

### Post 1 — Annonce de lancement
> 🐻 On a lancé MyBearIsYellow.
>
> L'idée : arrêter d'apprendre les concepts techniques par cœur pour un entretien, et vraiment les comprendre — avec une analogie, un schéma, du code concret, et les questions qu'on vous pose vraiment en entretien.
>
> Architecture logicielle, Design Patterns, Bases de données, Tests, Cloud & DevOps : 40 fiches déjà en ligne, gratuites, en français.
>
> 👉 https://www.mybearisyellow.me
>
> #DeveloppeurWeb #SoftwareEngineering #TechFrance #ArchitectureLogicielle

### Post 2 — Article : Strategy Pattern
> Question classique en entretien : "Explique-moi un design pattern que tu utilises souvent."
>
> Le Strategy Pattern est souvent le meilleur choix pour répondre — simple à expliquer, facile à justifier, et ça montre que vous comprenez le principe ouvert/fermé sans réciter une définition.
>
> On l'a détaillé avec une analogie (le choix du moyen de transport), un diagramme, et le code en PHP, Java et JavaScript.
>
> 👉 https://www.mybearisyellow.me/design-patterns/strategy/
>
> #DesignPatterns #CleanCode #EntretienTechnique #PHP

### Post 3 — Engagement
> Question aux devs qui me suivent 👇
>
> Quel concept technique vous a pris le plus de temps à VRAIMENT comprendre (pas juste réciter) ?
>
> Pour moi c'était les niveaux d'isolation transactionnelle en SQL — j'ai dû me planter en prod pour vraiment intégrer la différence entre Read Committed et Repeatable Read 😅
>
> Dites-moi en commentaire, ça m'intéresse pour les prochains sujets à couvrir sur MyBearIsYellow 🐻
>
> #BasesDeDonnees #SQL #DeveloppeurWeb #Backend

---

## Semaine 2

### Post 4 — Article : Clean Architecture
> "La base de données n'est qu'un détail."
>
> Ça sonne contre-intuitif la première fois qu'on l'entend, mais c'est le cœur de la Clean Architecture : le métier ne devrait jamais dépendre de Doctrine, Eloquent ou d'un SGBD précis.
>
> On a détaillé les cercles concentriques, la règle de dépendance, et un exemple de code complet.
>
> 👉 https://www.mybearisyellow.me/architecture-logicielle/clean-architecture-expliquee-simplement/
>
> #ArchitectureLogicielle #CleanCode #SoftwareEngineering

### Post 5 — Article : Docker
> "Ça marche sur ma machine" — la phrase que Docker a été inventé pour tuer.
>
> Petit rappel simple de ce que Docker résout vraiment (et pourquoi ce n'est pas juste "une VM plus légère") sur MyBearIsYellow.
>
> 👉 https://www.mybearisyellow.me/cloud-devops/docker-explique-simplement/
>
> #Docker #DevOps #CloudComputing #TechFrance

### Post 6 — Mini-leçon native (sans lien en premier, lien en commentaire ou fin)
> Pourquoi un index accélère une requête SQL, en 30 secondes :
>
> Sans index, la base scanne TOUTE la table ligne par ligne pour trouver ce que vous cherchez.
>
> Avec un index, elle construit une structure arborescente triée (souvent un B-Tree) — elle retrouve vos lignes en quelques étapes au lieu de milliers.
>
> Le prix à payer : chaque écriture doit aussi mettre à jour l'index. D'où la règle : indexez ce que vous lisez souvent, pas tout.
>
> Détail complet (avec schéma) → https://www.mybearisyellow.me/bases-de-donnees/index-bdd/
>
> #SQL #BasesDeDonnees #Backend #EntretienTechnique

---

## Semaine 3

### Post 7 — Article : SOLID
> SOLID est probablement l'acronyme le plus cité en entretien... et le moins bien maîtrisé en pratique.
>
> Beaucoup de devs savent réciter les 5 lettres sans être capables de dire, face à du code réel, lequel des 5 principes est violé.
>
> On a fait un exemple de code par principe (PHP), et surtout : quand NE PAS appliquer SOLID.
>
> 👉 https://www.mybearisyellow.me/architecture-logicielle/solid-explique-simplement/
>
> #SOLID #CleanCode #ArchitectureLogicielle #PHP

### Post 8 — Article : TDD
> Red. Green. Refactor.
>
> Le cycle TDD tient en trois mots, mais la vraie question d'entretien c'est : pourquoi écrire le test AVANT le code change vraiment la conception ?
>
> Réponse détaillée + exemple de code sur MyBearIsYellow.
>
> 👉 https://www.mybearisyellow.me/tests/tdd-explique-simplement/
>
> #TDD #Tests #CleanCode #SoftwareEngineering

### Post 9 — Question d'entretien piège
> Question d'entretien qui piège beaucoup de monde :
>
> "Quelle différence entre Factory et Abstract Factory ?"
>
> Indice : ce n'est pas une question de vocabulaire, c'est une question d'échelle — un objet, ou une famille d'objets liés.
>
> Réponse complète avec diagramme et code → https://www.mybearisyellow.me/design-patterns/abstract-factory/
>
> #DesignPatterns #EntretienTechnique #Java #DeveloppeurWeb

---

## Semaine 4

### Post 10 — Article : Kubernetes
> Docker répond à "comment empaqueter mon appli."
>
> Kubernetes répond à "comment faire tourner des centaines de conteneurs de façon fiable en prod."
>
> Ce n'est pas la même question — et confondre les deux, c'est l'erreur n°1 que je vois en entretien DevOps.
>
> 👉 https://www.mybearisyellow.me/cloud-devops/kubernetes-explique-simplement/
>
> #Kubernetes #Docker #DevOps #CloudComputing

### Post 11 — Article : Mock vs Stub
> "Mock" et "Stub", ce n'est pas la même chose — et ça fait une vraie différence dans la lisibilité de vos tests.
>
> Un stub retourne une valeur prédéfinie. Un mock vérifie qu'un appel a bien eu lieu.
>
> Exemple de code PHPUnit et Jest avec les deux, côte à côte 👉 https://www.mybearisyellow.me/tests/mock-vs-stub/
>
> #Tests #TDD #JavaScript #PHP

### Post 12 — Engagement / sondage
> Sondage rapide 🐻
>
> En entretien technique, la question qui vous stresse le plus c'est plutôt :
>
> 🔵 "Explique-moi SOLID"
> 🟡 "Explique-moi une transaction SQL"
> 🟢 "Explique la différence entre REST et SOAP"
> ⚪ "Comment tu optimiserais cette API ?"
>
> Dites-moi en commentaire, je fais un post détaillé sur celle qui revient le plus 👇
>
> #EntretienTechnique #DeveloppeurWeb #Backend #TechFrance

---

## Semaine 5

### Post 13 — Article : Architecture hexagonale
> Clean Architecture, architecture hexagonale, Ports & Adapters : trois noms, une seule idée de fond.
>
> Isoler le métier des détails techniques, pour que changer de base de données ou de framework ne mette jamais en danger la logique métier.
>
> On a détaillé le vocabulaire "port" / "adapter" avec un exemple concret.
>
> 👉 https://www.mybearisyellow.me/architecture-logicielle/architecture-hexagonale/
>
> #ArchitectureLogicielle #CleanCode #SoftwareEngineering

### Post 14 — Article : Cache Redis
> Un cache mal invalidé est pire qu'un cache absent — vous servez de fausses données en pensant gagner en performance.
>
> Cache-aside, TTL, invalidation : les bases de Redis expliquées simplement, avec un vrai exemple.
>
> 👉 https://www.mybearisyellow.me/bases-de-donnees/cache-redis/
>
> #Redis #BasesDeDonnees #Backend #Performance

### Post 15 — Hook "actualité" évergreen (à adapter selon le vrai fil d'actu du moment)
> Kubernetes a été open-sourcé par Google il y a un peu plus de 10 ans — et c'est aujourd'hui devenu un standard de facto pour l'orchestration de conteneurs.
>
> Si le vocabulaire (pods, services, déploiements) vous semble encore flou, on l'a expliqué simplement, sans jargon inutile.
>
> 👉 https://www.mybearisyellow.me/cloud-devops/kubernetes-explique-simplement/
>
> #Kubernetes #DevOps #CloudComputing #TechFrance

---

## Notes d'utilisation

- **Varie le format** : pas que des liens directs. Les posts "mini-leçon native" (post 6) et "question piège" (post 9) performent souvent mieux que les liens directs sur LinkedIn — l'algorithme favorise le contenu qui garde les gens sur la plateforme.
- **Les posts "actualité" (type post 15)** doivent rester basés sur des faits vérifiables et datés avec prudence ("il y a un peu plus de 10 ans" plutôt qu'une date précise que je ne peux pas garantir à 100%) — à vérifier/ajuster avant publication plutôt que de citer une actualité du jour que je ne peux pas connaître en temps réel.
- **Ne pas tout publier d'un coup** : réutilise ce stock sur plusieurs semaines, dans le désordre, en alternant les catégories. C'est ce qui donne l'impression d'un blog vivant plutôt que d'une rafale ponctuelle.
- **D'autres articles** (Repository, Dependency Injection, Adapter, Decorator, Observer, Builder, Singleton, DDD, Couplage fort/faible, Séparation des responsabilités, SQL vs NoSQL, Normalisation, ACID, Réplication, Isolation transactionnelle, Pyramide des tests, BDD/Gherkin, CI/CD, IaC, Monitoring, Scalabilité, IaaS/PaaS/SaaS) n'ont pas encore de post dédié — même trame que ci-dessus pour en générer d'autres à la demande.
