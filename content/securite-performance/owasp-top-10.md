---
title: "OWASP Top 10 expliqué simplement"
description: "L'OWASP Top 10 classe les vulnérabilités web les plus critiques et les plus fréquentes. Comprendre ce classement, c'est savoir où concentrer ses efforts de sécurité."
date: 2026-07-30
category: "Sécurité & Performance"
difficulty: "Débutant"
tags: ["securite", "owasp", "web", "bonnes-pratiques"]
summary: "L'OWASP Top 10 est un classement des dix familles de vulnérabilités web les plus critiques, mis à jour régulièrement par une communauté d'experts en sécurité. C'est la référence que citent les recruteurs, les audits de sécurité et les certifications backend."
bearMemory:
  - "OWASP n'est pas un outil ni un produit : c'est une **fondation à but non lucratif** qui documente et classe les risques de sécurité web."
  - "Le Top 10 classe des **catégories de vulnérabilités**, pas des bugs précis — chaque catégorie regroupe plusieurs failles concrètes (injection SQL, XSS, etc.)."
  - "Le classement évolue avec le temps (2013, 2017, 2021...) car les usages du web et les attaques changent — apprendre les catégories vaut mieux que les mémoriser par cœur."
interviewQuestions:
  - q: "C'est quoi l'OWASP Top 10, en une phrase ?"
    a: "C'est un classement, publié par la fondation OWASP, des dix catégories de vulnérabilités web les plus critiques et les plus répandues, basé sur des données réelles collectées auprès d'entreprises et d'audits de sécurité."
  - q: "Pourquoi ce classement fait-il autorité ?"
    a: "Parce qu'il est produit par une communauté ouverte d'experts en sécurité, s'appuie sur des données réelles remontées par des centaines d'organisations, et est mis à jour régulièrement pour refléter l'évolution des menaces. C'est la référence citée par les normes de conformité (PCI-DSS notamment) et les audits de sécurité professionnels."
  - q: "Le Top 10 suffit-il à sécuriser une application ?"
    a: "Non. C'est un point de départ, pas une checklist exhaustive. Il couvre les risques les plus fréquents, mais une application peut être vulnérable à des problèmes très spécifiques à son métier qui n'entrent dans aucune de ces dix catégories. Il donne une base commune de vocabulaire et de priorités, pas une garantie de sécurité totale."
---

## Le problème

Un développeur qui débute en sécurité se retrouve vite noyé : il existe des centaines de types de vulnérabilités, des dizaines d'acronymes (XSS, CSRF, SSRF, IDOR...), et aucune indication claire sur ce qui mérite vraiment l'attention en premier. Sans priorisation, on risque de passer du temps à se protéger contre une attaque exotique et rare, tout en laissant grande ouverte une faille bien plus courante et bien plus dangereuse.

Il fallait un langage commun : une liste de référence que tout développeur, auditeur ou recruteur puisse citer et comprendre de la même façon, basée sur des données réelles plutôt que sur des intuitions.

## L'idée générale

L'OWASP (*Open Worldwide Application Security Project*) est une fondation à but non lucratif dédiée à l'amélioration de la sécurité des logiciels. Elle publie plusieurs ressources gratuites, dont la plus connue est le **OWASP Top 10** : un classement des dix catégories de risques de sécurité web jugées les plus critiques, révisé environ tous les trois à quatre ans (2013, 2017, 2021...).

Ce classement ne liste pas des bugs précis, mais des **familles de vulnérabilités**. Par exemple, la catégorie "Injection" regroupe l'injection SQL, l'injection de commandes système, l'injection LDAP, etc. — toutes partagent la même cause racine : une donnée non fiable, fournie par l'utilisateur, interprétée comme du code ou une commande par le système.

Voici un aperçu des catégories les plus significatives de l'édition 2021, celle actuellement en vigueur :

- **Broken Access Control** — un utilisateur peut accéder à des ressources ou actions qui ne devraient pas lui être autorisées (voir le concept d'IDOR).
- **Cryptographic Failures** — des données sensibles mal protégées : stockage en clair, chiffrement faible, transport non chiffré.
- **Injection** — dont l'injection SQL, détaillée dans un article dédié.
- **Insecure Design** — des failles issues d'un défaut de conception, pas d'un bug d'implémentation (par exemple, l'absence de limite de tentatives sur un formulaire de connexion).
- **Security Misconfiguration** — des paramètres par défaut dangereux, des messages d'erreur trop verbeux, des services exposés inutilement.
- **Vulnerable and Outdated Components** — utiliser une dépendance (librairie, framework) avec une faille connue et non corrigée.
- **Identification and Authentication Failures** — une gestion défaillante de l'authentification ou des sessions.
- **Software and Data Integrity Failures** — faire confiance à du code ou des données sans en vérifier l'intégrité (mises à jour automatiques non signées, par exemple).
- **Security Logging and Monitoring Failures** — l'incapacité à détecter une attaque en cours faute de journalisation suffisante.
- **Server-Side Request Forgery (SSRF)** — forcer un serveur à effectuer une requête vers une destination choisie par l'attaquant.

Plusieurs de ces catégories — l'injection, les failles d'authentification, et des sujets transverses comme le XSS et le CSRF — sont approfondies dans les articles suivants de cette section.

## Analogie du quotidien

L'OWASP Top 10, c'est comme le classement annuel des causes d'accidents domestiques établi par les pompiers. Ce n'est pas une liste exhaustive de tout ce qui peut mal tourner chez vous — mais un classement, basé sur des milliers d'interventions réelles, des causes les plus fréquentes et les plus graves : incendies de cuisine, chutes dans les escaliers, intoxications au monoxyde de carbone.

Ce classement ne vous dit pas exactement où se trouve le défaut dans votre propre maison. Il vous dit où concentrer votre vigilance en priorité, parce que c'est statistiquement là que les problèmes arrivent le plus souvent, avec les conséquences les plus lourdes.

## Diagramme

{{< mermaid >}}
flowchart TD
    A[Développeur / Auditeur] --> B{OWASP Top 10}
    B --> C1[Broken Access Control]
    B --> C2[Cryptographic Failures]
    B --> C3[Injection]
    B --> C4[Insecure Design]
    B --> C5[Security Misconfiguration]
    B --> C6[Vulnerable Components]
    B --> C7[Authentication Failures]
    B --> C8[Integrity Failures]
    B --> C9[Logging Failures]
    B --> C10[SSRF]

    C3 -.détaillé dans.-> D[Article : Injection SQL]
    C7 -.détaillé dans.-> E[Article : Authentification & sessions]
    C1 -.lié à.-> F[Articles : XSS & CSRF]
{{< /mermaid >}}

## Exemple de code

Cet article étant une vue d'ensemble, l'exemple ci-dessous illustre une seule catégorie à titre d'aperçu — l'injection — pour montrer le type de problème que le classement cherche à faire repérer. Le détail complet (attaque, correction, autres cas) est traité dans l'article dédié à l'injection SQL.

### Code vulnérable

```php
// Catégorie OWASP : Injection
$id = $_GET['id'];
$resultat = $pdo->query("SELECT * FROM utilisateurs WHERE id = $id");
```

### Code corrigé

```php
// La donnée utilisateur est liée, jamais concaténée dans la requête
$stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE id = :id");
$stmt->execute(['id' => $_GET['id']]);
$resultat = $stmt->fetchAll();
```

## Quand s'en préoccuper ?

- Dès le premier projet exposé sur internet, même un simple formulaire de contact : les scanners automatisés testent en permanence les failles les plus courantes du Top 10, sans distinction de la taille ou de la notoriété du site.
- Lors de la conception d'une nouvelle fonctionnalité qui touche à l'authentification, aux permissions, ou à l'entrée de données utilisateur — ces trois zones concentrent une grande partie des catégories du classement.
- Avant un audit de sécurité ou une certification de conformité (PCI-DSS, ISO 27001...) : ces référentiels citent explicitement le Top 10.
- En entretien technique : c'est souvent le point d'entrée des questions de sécurité, avant d'aller creuser une catégorie précise.

## Points importants

- Le Top 10 classe des **catégories**, pas des vulnérabilités individuelles — une bonne réponse en entretien évite de réciter la liste mot pour mot et montre plutôt qu'on comprend la logique derrière chaque catégorie.
- Le classement change à chaque révision (l'ordre et le contenu de 2021 diffèrent de 2017) : ce qui compte, c'est de comprendre les mécanismes, pas la position exacte dans le classement de l'année en cours.
- Le Top 10 est un point de départ pédagogique, pas un audit de sécurité complet : une application 100% conforme au Top 10 peut rester vulnérable à des problèmes métier spécifiques.
- OWASP publie d'autres ressources utiles au-delà du Top 10 : le *Cheat Sheet Series* (des guides pratiques par sujet) et le *ASVS* (un référentiel de vérification plus détaillé, utilisé pour les audits approfondis).
