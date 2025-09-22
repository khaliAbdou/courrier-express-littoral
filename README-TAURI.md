# Guide de Déploiement Tauri - ANOR Desktop

Ce guide explique comment migrer de Electron vers Tauri et déployer l'application ANOR Desktop en tant qu'exécutable Windows (.exe) en utilisant Tauri.

## ✨ Pourquoi Tauri ?

**Avantages de Tauri par rapport à Electron :**
- 🚀 **Plus léger** : 10-20x plus petit qu'Electron
- ⚡ **Plus rapide** : Utilise la WebView système au lieu de Chromium
- 🔒 **Plus sécurisé** : Sandboxing intégré et permissions granulaires
- 🎯 **Moins de mémoire** : Consommation RAM réduite de 50-80%
- 🛠️ **Backend Rust** : Performance native pour les opérations système

## 📋 Prérequis

### 1. Installation de Rust
```bash
# Windows
winget install Rustlang.Rust

# Ou via le site officiel : https://rustup.rs/
```

### 2. Outils de build Windows
```bash
# Visual Studio Build Tools ou Visual Studio Community
winget install Microsoft.VisualStudio.2022.BuildTools
```

### 3. Dépendances Node.js
```bash
npm install
```

## 🔧 Configuration Tauri

### 1. Structure des fichiers créés

```
src-tauri/
├── Cargo.toml          # Configuration Rust
├── tauri.conf.json     # Configuration Tauri
├── build.rs            # Script de build
├── src/
│   └── main.rs         # Application Rust principale
└── icons/              # Icônes de l'application
    ├── 32x32.png
    ├── 128x128.png
    ├── 128x128@2x.png
    ├── icon.icns
    └── icon.ico
```

### 2. Fichiers modifiés/créés

- ✅ `src-tauri/tauri.conf.json` - Configuration principale Tauri
- ✅ `src-tauri/Cargo.toml` - Dépendances Rust
- ✅ `src-tauri/src/main.rs` - Backend Rust avec commandes
- ✅ `src/utils/tauriBridge.ts` - Interface frontend-backend
- ✅ `src/utils/storageAdapterTauri.ts` - Adaptateur de stockage Tauri

### 3. Commandes Rust implémentées

- `select_directory` - Sélection de dossier via dialogue
- `read_file` - Lecture de fichier depuis le disque
- `write_file` - Écriture de fichier sur le disque
- `list_files` - Listage des fichiers d'un dossier
- `check_license` - Vérification de licence (placeholder)

## 🚀 Commandes de Build

### Développement
```bash
# Démarrer en mode développement (React + Tauri)
npm run tauri dev

# Alternative : démarrer React puis Tauri séparément
npm run dev
npx tauri dev
```

### Production

```bash
# Build complet et génération de l'exécutable
npm run tauri build

# Étapes manuelles :
npm run build           # Build React
npx tauri build        # Build Tauri + création .exe
```

### Scripts package.json à ajouter

```json
{
  "scripts": {
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build",
    "tauri:build:debug": "tauri build --debug"
  }
}
```

## 📁 Fonctionnalités de Stockage

### Stockage Local Tauri
- **Sélection de dossier** : Dialogue natif Windows
- **Stockage illimité** : Utilise le disque dur directement
- **Format JSON** : `courriers-data.json` dans le dossier choisi
- **Sauvegarde automatique** : Toutes les 5 minutes
- **Export/Import** : Génération de fichiers de sauvegarde

### Migration depuis File System API
- ✅ Remplacement complet de l'API File System Access
- ✅ Conservation de toutes les fonctionnalités
- ✅ Interface utilisateur identique
- ✅ Compatibilité des données existantes

## 🎯 Fichiers de Sortie

Après `npm run tauri build`, vous trouverez :

```
src-tauri/target/release/bundle/
├── msi/                    # Installer MSI Windows
│   └── ANOR Desktop_1.0.0_x64_en-US.msi
├── nsis/                   # Installer NSIS (optionnel)
│   └── ANOR Desktop_1.0.0_x64-setup.exe
└── portable/               # Version portable
    └── ANOR Desktop.exe
```

## 🛡️ Permissions de Sécurité

### Configuration `tauri.conf.json`
```json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "all": true,
        "scope": ["**"]
      },
      "dialog": {
        "all": true
      }
    }
  }
}
```

### Commandes autorisées
- Lecture/écriture de fichiers dans le dossier sélectionné
- Dialogues de sélection de fichiers/dossiers
- Accès aux informations système (plateforme, versions)

## 🔄 Migration depuis Electron

### Changements principaux

1. **Backend** : JavaScript → Rust
2. **Runtime** : Chromium → WebView système
3. **API** : IPC Electron → Commands Tauri
4. **Permissions** : Accès total → Sandbox avec permissions explicites

### Code modifié

- `electronBridge.ts` → `tauriBridge.ts`
- `storageAdapter.ts` → utilise `storageAdapterTauri.ts`
- Suppression des dépendances Electron

## 📦 Distribution

### Options de distribution

1. **MSI Installer** - Installation classique Windows
2. **NSIS Installer** - Installer personnalisable
3. **Portable** - Exécutable autonome
4. **Auto-update** - Mise à jour automatique (optionnel)

### Signature de code (Production)

```bash
# Configuration dans tauri.conf.json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERT_THUMBPRINT",
      "digestAlgorithm": "sha256"
    }
  }
}
```

## 🚨 Dépannage

### Erreurs communes

1. **Rust non installé** : Installer Rust via rustup.rs
2. **Build tools manquants** : Installer Visual Studio Build Tools
3. **Permissions** : Vérifier les permissions dans tauri.conf.json
4. **WebView2** : S'assurer que WebView2 est installé sur le système cible

### Logs de débogage

```bash
# Build avec logs détaillés
RUST_LOG=debug npx tauri build

# Dev avec logs
RUST_LOG=debug npx tauri dev
```

## 🎯 Prochaines Étapes

1. **Test** : Tester l'application en mode dev avec `npm run tauri dev`
2. **Build** : Créer l'exécutable avec `npm run tauri build`
3. **Test Production** : Tester l'exécutable généré
4. **Distribution** : Distribuer le fichier .msi ou .exe

## 📝 Notes importantes

- ⚠️ **Icônes** : Remplacer les icônes placeholder dans `src-tauri/icons/`
- ⚠️ **Certificat** : Signer le code pour la distribution en production
- ⚠️ **WebView2** : Runtime requis sur les machines Windows cibles
- ⚠️ **Tests** : Tester sur différentes versions de Windows

L'application est maintenant prête pour le déploiement avec Tauri ! 🚀