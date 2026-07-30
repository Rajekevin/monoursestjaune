---
title: "L'injection SQL expliquée simplement"
description: "L'injection SQL permet à un attaquant de manipuler une requête base de données en injectant du code dans une entrée utilisateur. Explication, exemple PHP vulnérable vs requête préparée."
date: 2026-07-30
category: "Sécurité & Performance"
difficulty: "Débutant"
tags: ["securite", "owasp", "sql", "php", "pdo"]
summary: "L'injection SQL survient quand une entrée utilisateur est intégrée directement dans une requête SQL au lieu d'être traitée comme une simple donnée. Résultat : un attaquant peut lire, modifier ou supprimer des données qu'il ne devrait jamais pouvoir toucher."
bearMemory:
  - "La cause racine est toujours la même : une donnée utilisateur **concaténée** dans une requête SQL au lieu d'être **liée** en paramètre."
  - "La requête préparée (PDO avec paramètres liés) n'est pas une bonne pratique parmi d'autres : c'est **la** protection contre l'injection SQL, pas une option facultative."
  - "L'échappement manuel des caractères (`addslashes`, `mysql_real_escape_string`) est une fausse solution : incomplet, fragile, et déprécié — seules les requêtes préparées garantissent la séparation code/donnée."
interviewQuestions:
  - q: "Comment fonctionne une injection SQL, concrètement ?"
    a: "Un attaquant fournit, dans un champ de formulaire ou un paramètre d'URL, une chaîne contenant du code SQL au lieu d'une simple donnée. Si cette chaîne est concaténée directement dans la requête, le moteur SQL l'interprète comme faisant partie de la requête elle-même — l'attaquant peut alors modifier la logique de la requête, par exemple pour contourner une authentification ou extraire des données d'une autre table."
  - q: "Pourquoi une requête préparée protège-t-elle contre l'injection ?"
    a: "Parce qu'elle sépare strictement la structure de la requête (envoyée d'abord au moteur SQL) des valeurs (envoyées ensuite, liées aux emplacements réservés). Le moteur sait donc, dès le départ, que la valeur fournie est une donnée et non du code SQL — même si elle contient des apostrophes ou des mots-clés SQL, elle ne peut jamais altérer la structure de la requête."
  - q: "L'échappement des caractères spéciaux (addslashes, escaping manuel) suffit-il à se protéger ?"
    a: "Non, et c'est une erreur fréquente. L'échappement manuel est incomplet (il oublie des cas selon l'encodage, le type de base ou le contexte), facile à contourner et fragile dès qu'on change de moteur de base de données. Les requêtes préparées avec paramètres liés sont la seule protection fiable et recommandée aujourd'hui."
---

## Le problème

Un formulaire de connexion classique vérifie l'identité d'un utilisateur en interrogeant la base de données avec l'email et le mot de passe saisis. Si le développeur construit cette requête en assemblant directement des morceaux de texte — y compris ce que l'utilisateur a tapé — alors l'utilisateur ne fournit plus seulement une donnée : il peut fournir un fragment de code SQL.

Le moteur de base de données ne fait pas la différence entre "une donnée qui ressemble à du SQL" et "du vrai SQL" : il exécute ce qu'on lui donne. Si une entrée utilisateur non filtrée se retrouve mélangée à la structure de la requête, l'attaquant obtient un contrôle partiel — parfois total — sur ce que la base de données va faire.

## L'idée générale

L'injection SQL consiste à faire passer des données pour du code. Prenons une requête de connexion construite par concaténation :

```
SELECT * FROM utilisateurs WHERE email = '$email' AND mot_de_passe = '$motDePasse'
```

Si un attaquant saisit, comme email, la chaîne `' OR '1'='1`, la requête devient :

```
SELECT * FROM utilisateurs WHERE email = '' OR '1'='1' AND mot_de_passe = ''
```

La condition `'1'='1'` est toujours vraie. La clause `WHERE` valide donc n'importe quelle ligne, et l'attaquant peut se connecter sans connaître aucun mot de passe. C'est l'exemple le plus classique, mais l'injection SQL permet bien plus : lire des tables entières (y compris des mots de passe hachés), en modifier le contenu, voire les supprimer, selon les droits du compte utilisé par l'application pour se connecter à la base.

La solution ne consiste pas à "filtrer" ou "nettoyer" l'entrée utilisateur au cas par cas — cette approche est toujours incomplète. La bonne solution consiste à ne **jamais** laisser une donnée utilisateur faire partie du texte de la requête : elle doit toujours être transmise séparément, comme paramètre.

## Analogie du quotidien

Une requête SQL construite par concaténation, c'est comme rédiger un chèque en laissant le montant en blanc et en le donnant à quelqu'un pour qu'il le remplisse lui-même. Rien n'empêche cette personne d'écrire "mille euros" au lieu de "dix euros" — le chèque, une fois signé, exécute ce qui est écrit dessus, sans distinguer votre intention de celle de la personne qui a rempli le blanc.

Une requête préparée, c'est un chèque où le montant est saisi dans une case séparée, verrouillée, qui ne peut contenir qu'un nombre — jamais du texte, jamais une instruction. Peu importe ce que quelqu'un essaie d'y écrire, ça reste cantonné à sa fonction de valeur, sans jamais pouvoir changer la nature du document.

## Diagramme

{{< mermaid >}}
sequenceDiagram
    participant A as Attaquant
    participant App as Application PHP
    participant DB as Base de données

    rect rgb(255, 230, 230)
    Note over A,DB: Sans requête préparée (vulnérable)
    A->>App: email = ' OR '1'='1
    App->>DB: SELECT * FROM utilisateurs WHERE email = '' OR '1'='1' AND ...
    DB-->>App: Toutes les lignes (condition toujours vraie)
    App-->>A: Connexion réussie sans mot de passe
    end

    rect rgb(220, 245, 220)
    Note over A,DB: Avec requête préparée (protégé)
    A->>App: email = ' OR '1'='1
    App->>DB: Requête + paramètre lié (email = littéralement la chaîne saisie)
    DB-->>App: Aucune ligne trouvée
    App-->>A: Connexion refusée
    end
{{< /mermaid >}}

## Exemple de code

### Code vulnérable

```php
<?php
$email = $_POST['email'];
$motDePasse = $_POST['mot_de_passe'];

// Concaténation directe : l'entrée utilisateur devient une partie de la requête
$sql = "SELECT * FROM utilisateurs WHERE email = '$email' AND mot_de_passe = '$motDePasse'";
$resultat = $pdo->query($sql);

$utilisateur = $resultat->fetch();

if ($utilisateur) {
    // Connexion acceptée — y compris avec email = ' OR '1'='1
    session_start();
    $_SESSION['user_id'] = $utilisateur['id'];
}
```

### Code corrigé

```php
<?php
$email = $_POST['email'];
$motDePasse = $_POST['mot_de_passe'];

// Requête préparée : la structure et les valeurs sont envoyées séparément
$stmt = $pdo->prepare('SELECT id, mot_de_passe_hash FROM utilisateurs WHERE email = :email');
$stmt->execute(['email' => $email]);

$utilisateur = $stmt->fetch();

// Le mot de passe n'est jamais comparé en clair : voir l'article sur
// l'authentification et les sessions sécurisées pour le hachage.
if ($utilisateur && password_verify($motDePasse, $utilisateur['mot_de_passe_hash'])) {
    session_start();
    session_regenerate_id(true);
    $_SESSION['user_id'] = $utilisateur['id'];
}
```

## Quand s'en préoccuper ?

- Sur **toute** requête SQL qui intègre une donnée venant de l'extérieur : un formulaire, un paramètre d'URL, un en-tête HTTP, un cookie, ou même une donnée déjà stockée en base mais initialement fournie par un utilisateur.
- Y compris dans les clauses `ORDER BY`, `LIMIT`, ou les noms de colonnes/tables dynamiques, où les paramètres liés classiques ne s'appliquent pas directement — ces cas demandent une liste blanche de valeurs autorisées plutôt qu'une concaténation.
- Dès l'écriture du code, pas en correction a posteriori : utiliser systématiquement un ORM (Doctrine, Eloquent) ou des requêtes préparées PDO évite le problème par construction, sans effort supplémentaire une fois l'habitude prise.
- Même sur un projet "interne" ou "sans données sensibles" : une base compromise sert souvent de point d'entrée vers d'autres systèmes.

## Points importants

- Les requêtes préparées ne sont pas un détail d'optimisation : c'est la protection standard, recommandée par OWASP, et il n'existe pas de raison légitime de construire une requête SQL par concaténation avec une donnée utilisateur.
- Un ORM (Doctrine, Eloquent) utilise des requêtes préparées en interne : il protège contre l'injection SQL tant qu'on n'utilise pas ses fonctions d'échappement natif ("raw query") avec des données non fiables.
- L'injection SQL n'est qu'une variante de la catégorie "Injection" de l'OWASP Top 10 — le même principe (donnée non fiable interprétée comme du code) s'applique aussi aux injections de commandes système, LDAP, ou NoSQL.
- Limiter les droits du compte de base de données utilisé par l'application (lecture seule quand c'est possible, pas de droits `DROP` sur un compte applicatif) réduit l'impact d'une injection qui passerait malgré tout inaperçue.
