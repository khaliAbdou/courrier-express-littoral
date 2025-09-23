# Guide de Build Tauri - ANOR Desktop

## 📋 Prérequis

### 1. Installation de Rust
```bash
# Télécharger et installer Rust depuis https://rustup.rs/
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Visual Studio Build Tools (Windows)
- Télécharger Visual Studio Installer
- Installer "Build Tools for Visual Studio 2022"
- Cocher "C++ build tools" et "Windows 10/11 SDK"

### 3. Dépendances Node.js
```bash
npm install
```

## 🚀 Scripts à Ajouter au package.json

Ajoutez ces scripts dans la section `"scripts"` de votre `package.json` :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build",
    "tauri:build:debug": "tauri build --debug",
    "tauri:android": "tauri android dev",
    "tauri:ios": "tauri ios dev"
  }
}
```

## 🛠️ Commandes de Build

### Développement
```bash
# Test en mode développement avec Tauri
npm run tauri:dev
```

### Production
```bash
# Build complet pour production
npm run tauri:build

# Build en mode debug (plus rapide, pour tests)
npm run tauri:build:debug
```

## 📁 Fichiers Générés

Après `npm run tauri:build`, vous trouverez les exécutables dans :

```
src-tauri/target/release/bundle/
├── msi/                    # Installeur Windows (.msi)
├── nsis/                   # Installeur NSIS (.exe)
└── portable/               # Version portable (.exe)
```

## ✅ Validation du Build

### 1. Test en développement
```bash
npm run tauri:dev
```
- Vérifiez que l'application se lance
- Testez les fonctionnalités de stockage de fichiers
- Vérifiez la sélection de dossiers

### 2. Test de l'exécutable
```bash
npm run tauri:build
```
- Lancez le .exe généré
- Testez sur une machine sans environnement de développement
- Vérifiez que toutes les fonctionnalités marchent

## 🔧 Personnalisation

### Icônes
Remplacez les icônes dans `src-tauri/icons/` :
- `32x32.png` - Icône système 32x32
- `128x128.png` - Icône système 128x128  
- `128x128@2x.png` - Icône haute résolution
- `icon.icns` - Icône macOS
- `icon.ico` - Icône Windows

### Configuration
Modifiez `src-tauri/tauri.conf.json` pour :
- Changer le nom de l'application
- Ajuster la taille de fenêtre
- Modifier les permissions
- Configurer la signature de code

## 🚨 Sécurité

### Signature de Code (Recommandée)
```json
// Dans tauri.conf.json
"bundle": {
  "windows": {
    "certificateThumbprint": "VOTRE_THUMBPRINT",
    "digestAlgorithm": "sha256",
    "timestampUrl": "http://timestamp.sectigo.com"
  }
}
```

### Permissions Minimales
Vérifiez que `tauri.conf.json` n'accorde que les permissions nécessaires :
- `fs` pour l'accès aux fichiers
- `dialog` pour les boîtes de dialogue
- `path` et `os` pour les informations système

## 🎯 Distribution

### Pour les Utilisateurs Finaux
1. **Installeur MSI** (recommandé) : Installation propre avec désinstallation
2. **Installeur NSIS** : Plus de contrôle sur l'installation
3. **Version portable** : Pas d'installation requise

### Auto-Update (Optionnel)
```json
// Dans tauri.conf.json
"updater": {
  "active": true,
  "endpoints": ["https://releases.myapp.com/{{target}}/{{current_version}}"],
  "dialog": true,
  "pubkey": "VOTRE_CLE_PUBLIQUE"
}
```

## 🔍 Dépannage

### Erreurs Communes
- **Rust non trouvé** : Redémarrez le terminal après installation
- **Build tools manquants** : Installez Visual Studio Build Tools
- **Permissions refusées** : Exécutez en tant qu'administrateur
- **WebView2 manquant** : Sera installé automatiquement sur Windows 10/11

### Logs de Debug
```bash
# Activer les logs détaillés
RUST_LOG=debug npm run tauri:build
```

## 📋 Checklist Final

- [ ] Rust installé et fonctionnel
- [ ] Scripts ajoutés au package.json
- [ ] Test `npm run tauri:dev` réussi
- [ ] Build `npm run tauri:build` réussi
- [ ] Icônes personnalisées ajoutées
- [ ] Exécutable testé sur machine propre
- [ ] Configuration de sécurité vérifiée
- [ ] Méthode de distribution choisie

## 🎉 Prochaines Étapes

Une fois l'exécutable généré avec succès :
1. Testez-le sur différentes machines Windows
2. Considérez la signature de code pour éviter les avertissements de sécurité
3. Mettez en place un système de distribution (site web, Microsoft Store, etc.)
4. Documentez le processus d'installation pour vos utilisateurs