---
title: "Monitoring"
description: "Le monitoring repose sur trois piliers complémentaires — métriques, logs et traces — pour comprendre l'état d'un système en production et alerter avant que les utilisateurs ne soient impactés."
date: 2026-07-10
category: "Cloud & DevOps"
difficulty: "Intermédiaire"
tags: ["devops", "cloud", "scalabilite", "infrastructure-as-code"]
summary: "Le monitoring consiste à observer en continu l'état d'un système en production grâce à trois piliers complémentaires — métriques, logs et traces — pour détecter un problème et alerter avant, ou au pire au moment où, les utilisateurs le ressentent."
bearMemory:
  - "Les trois piliers de l'observabilité : **métriques** (chiffres agrégés dans le temps), **logs** (événements horodatés détaillés), **traces** (le chemin d'une requête à travers plusieurs services)."
  - "Une bonne alerte doit être **actionnable** : si personne ne sait quoi faire en la recevant à 3h du matin, ce n'est pas une alerte utile, c'est du bruit."
  - "Monitoring = savoir *que* quelque chose ne va pas. Observabilité = pouvoir comprendre *pourquoi*, sans avoir prévu la question à l'avance."
interviewQuestions:
  - q: "Quels sont les trois piliers de l'observabilité et à quoi servent-ils ?"
    a: "Les métriques sont des valeurs numériques agrégées dans le temps (taux d'erreur, latence, utilisation CPU) qui permettent de détecter rapidement une anomalie et de définir des seuils d'alerte. Les logs sont des événements horodatés détaillés qui permettent d'investiguer précisément ce qui s'est passé. Les traces suivent le parcours d'une requête à travers plusieurs services, ce qui est essentiel pour localiser où un ralentissement ou une erreur se produit dans une architecture distribuée."
  - q: "Quelle est la différence entre monitoring et observabilité ?"
    a: "Le monitoring consiste à surveiller un ensemble prédéfini d'indicateurs pour savoir si le système va bien ou non — il répond aux questions qu'on a pensé à poser à l'avance. L'observabilité va plus loin : elle donne la capacité d'explorer et de comprendre le comportement interne d'un système à partir de ses sorties (métriques, logs, traces), y compris pour des questions qu'on n'avait pas anticipées lors de la conception du monitoring."
  - q: "Comment éviter la fatigue d'alerte (alert fatigue) dans une équipe ?"
    a: "En ne créant des alertes que pour des situations réellement actionnables et impactant l'utilisateur, en évitant les doublons d'alertes pour un même incident, et en distinguant clairement la sévérité (une alerte qui réveille quelqu'un la nuit doit être réservée aux vraies urgences). Utiliser des SLO (objectifs de niveau de service) pour alerter sur le taux d'erreur perçu par l'utilisateur plutôt que sur chaque petite fluctuation technique réduit aussi fortement le bruit."
---

## Le problème

Une application qui fonctionne en local ou en test ne garantit rien sur son comportement en production, où le trafic réel, la charge concurrente et les pannes d'infrastructure externe créent des situations imprévisibles. Sans monitoring, la première personne informée d'un problème en production est souvent... un utilisateur mécontent, ou pire, un client qui part sans même se plaindre.

Le problème s'aggrave avec la complexité de l'architecture. Sur un monolithe unique, un problème est relativement facile à localiser : il n'y a qu'un seul endroit où chercher. Sur une architecture distribuée avec plusieurs services qui s'appellent entre eux, une requête lente peut avoir traversé cinq services différents — sans outillage adapté, savoir lequel des cinq est responsable du ralentissement devient un exercice de devinette.

## L'idée générale

Le monitoring s'appuie sur trois types de signaux complémentaires, souvent appelés les **trois piliers de l'observabilité** :

- **Les métriques** : des valeurs numériques agrégées dans le temps (nombre de requêtes par seconde, taux d'erreur, latence moyenne, utilisation CPU). Elles sont légères à stocker et parfaites pour détecter une anomalie et définir des seuils d'alerte.
- **Les logs** : des événements horodatés et détaillés, écrits par l'application au fil de son exécution. Ils permettent d'investiguer précisément ce qui s'est passé à un instant donné, avec le contexte complet.
- **Les traces** : le chemin complet d'une requête à travers plusieurs services, avec le temps passé dans chacun. Indispensables sur une architecture distribuée pour localiser où un ralentissement ou une erreur se produit réellement.

Ces trois signaux répondent à des questions différentes et se complètent : une métrique alerte "le taux d'erreur a augmenté", une trace montre "c'est le service de paiement qui répond lentement", et les logs de ce service précisent "c'est un timeout vers la base de données".

Au-dessus de ces signaux, l'**alerting** définit les conditions qui déclenchent une notification vers une équipe — l'objectif étant d'être prévenu avant, ou au pire dès que, l'utilisateur est impacté, sans pour autant noyer l'équipe sous des alertes non actionnables.

## Analogie du quotidien

Le monitoring, c'est comme le tableau de bord et le carnet d'entretien d'une voiture. Les métriques, ce sont les jauges du tableau de bord — vitesse, niveau d'essence, température moteur — des chiffres qui évoluent en continu et déclenchent un voyant si un seuil est dépassé. Les logs, c'est le carnet d'entretien détaillé : chaque vidange, chaque réparation, avec la date et le kilométrage exact, consultable après coup pour comprendre l'historique complet du véhicule. Les traces, ce serait un système qui suivrait précisément le trajet d'un signal électrique depuis la clé de contact jusqu'au démarreur, en passant par chaque relais, pour localiser exactement où la panne se situe quand la voiture ne démarre pas.

Le voyant "température moteur" (une métrique) vous dit qu'il y a un problème. Le carnet d'entretien (les logs) et le diagnostic détaillé du circuit (les traces) vous disent pourquoi.

## Diagramme

{{< mermaid >}}
flowchart TD
    App[Application en production] -->|émet| Metrics[Métriques : latence, taux d'erreur, CPU]
    App -->|émet| Logs[Logs applicatifs horodatés]
    App -->|émet| Traces[Traces distribuées entre services]

    Metrics --> Dash[Dashboard de supervision]
    Logs --> Agg[Agrégateur de logs centralisé]
    Traces --> Viz[Visualisation des traces]

    Dash --> Alert{Seuil dépassé ?}
    Alert -->|oui, actionnable| Notif[Notification à l'équipe d'astreinte]
    Alert -->|non| Dash

    Notif --> Invest[Investigation via logs + traces]
{{< /mermaid >}}

## Exemple de code

```yaml
# alert-rules.yml — règle d'alerte Prometheus sur le taux d'erreur HTTP
groups:
  - name: api-alerts
    rules:
      - alert: TauxErreurEleve
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total[5m]))
          ) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Taux d'erreur HTTP au-dessus de 5% depuis 5 minutes"
          description: "{{ $value | humanizePercentage }} des requêtes échouent sur l'API mon-api."

      - alert: LatenceP99Elevee
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 1.5
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "La latence P99 dépasse 1.5s depuis 10 minutes"
```

```javascript
// Log structuré côté application : facilement filtrable et corrélable
logger.info("commande_creee", {
  requestId: req.id,
  userId: user.id,
  commandeId: commande.id,
  montant: commande.montant,
  duree_ms: Date.now() - debut,
});
```

## Quand mettre en place du monitoring ?

- Dès la mise en production d'un service, même modeste : découvrir un incident via un utilisateur plutôt que via une alerte coûte toujours plus cher en réputation et en temps de résolution.
- De façon renforcée dès qu'une architecture devient distribuée (plusieurs services, microservices) : c'est là que les traces deviennent indispensables pour localiser un problème.
- Avant un événement à fort trafic prévisible (soldes, lancement produit) : le monitoring permet de détecter la dégradation avant la panne complète.
- Un monitoring minimal (métriques de base + alerting) suffit pour un petit projet ; les traces distribuées deviennent réellement nécessaires à partir du moment où une requête traverse plusieurs services.

## Points importants

- Une alerte doit toujours être actionnable : une alerte qui ne mène à aucune action claire de la part de la personne qui la reçoit crée de la fatigue d'alerte et fait ignorer, à terme, les vraies urgences.
- Les SLO (Service Level Objectives) et SLI (Service Level Indicators) formalisent ce qu'on mesure et le seuil acceptable, en s'alignant sur l'impact utilisateur réel plutôt que sur des métriques purement techniques.
- Observabilité et monitoring ne sont pas synonymes : le monitoring surveille des indicateurs connus à l'avance, l'observabilité permet d'explorer et de répondre à des questions qu'on n'avait pas anticipées.
- Le monitoring a un coût (stockage des logs et métriques, charge de calcul) qu'il faut dimensionner : tout logguer en détail indéfiniment devient rapidement coûteux, d'où l'usage de rétentions et d'agrégations différenciées selon l'ancienneté des données.
