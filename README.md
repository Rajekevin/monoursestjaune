Mon Ours Est Jaune - Blog Hugo
Blog technique construit avec Hugo et le thème Ghostwriter.
🚀 Démarrage rapide
Prérequis

Hugo Extended (version 0.112.0 ou supérieure recommandée)
Git

Installation de Hugo
macOS :
bashbrew install hugo
Windows :
bashchoco install hugo-extended
Linux :
bashsudo snap install hugo
Vérifiez l'installation :
bashhugo version
💻 Développement local
1. Cloner le repository
bashgit clone https://github.com/Rajekevin/monoursestjaune.git
cd monoursestjaune
2. Initialiser les submodules (thème)
bashgit submodule update --init --recursive
3. Lancer le serveur de développement
bashhugo server -D
Le site sera accessible sur http://localhost:1313
Options utiles :

hugo server -D : Inclut les brouillons (drafts)
hugo server --disableFastRender : Désactive le rendu rapide (si problèmes d'affichage)
hugo server --bind 0.0.0.0 : Rend le site accessible depuis d'autres appareils sur le réseau

4. Créer un nouvel article
bashhugo new posts/mon-article.md
L'article sera créé dans content/posts/mon-article.md
📝 Structure du projet
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
