# Mon Ours Est Jaune - Blog Hugo

Blog technique construit avec [Hugo](https://gohugo.io/) et le thème Ghostwriter.

## 🚀 Démarrage rapide

### Prérequis

- [Hugo Extended](https://gohugo.io/installation/) (version 0.112.0 ou supérieure recommandée)
- Git

### Installation de Hugo

**macOS :**
```bash
brew install hugo
```

**Windows :**
```bash
choco install hugo-extended
```

**Linux :**
```bash
sudo snap install hugo
```

Vérifiez l'installation :
```bash
hugo version
```

## 💻 Développement local

### 1. Cloner le repository

```bash
git clone https://github.com/Rajekevin/monoursestjaune.git
cd monoursestjaune
```

### 2. Initialiser les submodules (thème)

```bash
git submodule update --init --recursive
```

### 3. Lancer le serveur de développement

```bash
hugo server -D
```

Le site sera accessible sur `http://localhost:1313`

**Options utiles :**
- `hugo server -D` : Inclut les brouillons (drafts)
- `hugo server --disableFastRender` : Désactive le rendu rapide (si problèmes d'affichage)
- `hugo server --bind 0.0.0.0` : Rend le site accessible depuis d'autres appareils sur le réseau

### 4. Créer un nouvel article

```bash
hugo new posts/mon-article.md
```

L'article sera créé dans `content/posts/mon-article.md`

## 📝 Structure du projet

```
.
├── archetypes/          # Templates pour nouveaux contenus
├── content/             # Vos articles et pages
│   └── posts/          # Articles du blog
├── static/              # Fichiers statiques (images, CSS, JS)
│   └── uploads/        # Images uploadées
├── themes/              # Thèmes Hugo
│   └── ghostwriter/    # Thème actuel
├── config.toml          # Configuration du site
└── public/              # Site généré (ne pas versionner)
```

## 🌐 Déploiement sur Netlify

### Méthode 1 : Déploiement automatique via Git (recommandé)

1. **Connecter votre repository GitHub à Netlify :**
   - Allez sur [netlify.com](https://www.netlify.com)
   - Cliquez sur "Add new site" → "Import an existing project"
   - Sélectionnez GitHub et autorisez Netlify
   - Choisissez le repository `monoursestjaune`

2. **Configuration du build :**
   - Build command : `hugo --gc --minify`
   - Publish directory : `public`
   - Environment variables :
     - `HUGO_VERSION` : `0.125.0` (ou votre version)

3. **Créer le fichier `netlify.toml`** (à la racine du projet) :

```toml
[build]
  publish = "public"
  command = "hugo --gc --minify"

[build.environment]
  HUGO_VERSION = "0.125.0"
  HUGO_ENV = "production"
  HUGO_ENABLEGITINFO = "true"

[context.production.environment]
  HUGO_ENV = "production"

[context.deploy-preview]
  command = "hugo --gc --minify --buildFuture -b $DEPLOY_PRIME_URL"

[context.branch-deploy]
  command = "hugo --gc --minify -b $DEPLOY_PRIME_URL"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

4. **Déployer :**
   - Chaque push sur la branche `master` déclenchera automatiquement un build
   - Les pull requests créeront des previews automatiques

### Méthode 2 : Déploiement manuel

```bash
# 1. Générer le site
hugo --gc --minify

# 2. Installer Netlify CLI
npm install -g netlify-cli

# 3. Se connecter à Netlify
netlify login

# 4. Déployer
netlify deploy --prod --dir=public
```

### Configuration du domaine personnalisé

1. Dans Netlify, allez dans "Domain settings"
2. Ajoutez votre domaine `bearisyellow.me`
3. Configurez les DNS selon les instructions de Netlify
4. Activez HTTPS automatique

## 🎨 Personnalisation

### Modifier le thème

Les fichiers du thème sont dans `themes/ghostwriter/`. Pour personnaliser sans modifier le thème directement :

1. Copiez le fichier à modifier depuis `themes/ghostwriter/layouts/` vers `layouts/`
2. Modifiez votre copie
3. Hugo utilisera automatiquement votre version

### Ajouter du CSS personnalisé

Créez `static/css/custom.css` et ajoutez-le dans `config.toml` :

```toml
[params]
  customCSS = ["css/custom.css"]
```

## 🔧 Commandes utiles

```bash
# Générer le site en production
hugo --gc --minify

# Nettoyer les fichiers générés
rm -rf public resources

# Mettre à jour le thème
git submodule update --remote --merge

# Vérifier les liens cassés
hugo --printPathWarnings

# Mesurer les performances de build
hugo --templateMetrics
```

## 📦 Dépendances

- Hugo Extended (pour SCSS)
- Theme Ghostwriter

## 🐛 Troubleshooting

**Le site ne se génère pas :**
- Vérifiez que les submodules sont initialisés : `git submodule update --init`
- Vérifiez la version de Hugo : `hugo version`

**Les styles ne s'appliquent pas :**
- Videz le cache : `hugo --gc`
- Vérifiez que vous utilisez Hugo Extended

**Erreur lors du déploiement Netlify :**
- Vérifiez la variable `HUGO_VERSION` dans Netlify
- Consultez les logs de build dans l'interface Netlify

## 📄 License

MIT License

## 🔗 Liens utiles

- [Documentation Hugo](https://gohugo.io/documentation/)
- [Thème Ghostwriter](https://github.com/jbub/ghostwriter)
- [Documentation Netlify](https://docs.netlify.com/)
- [Hugo Discourse](https://discourse.gohugo.io/)
