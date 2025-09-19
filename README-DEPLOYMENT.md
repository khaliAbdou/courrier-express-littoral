# Déploiement en Exécutable Local (.exe)

Cette application est conçue pour fonctionner comme un exécutable local sur PC Windows avec un stockage exclusivement sur disque dur.

## Configuration pour Tauri

Pour créer un exécutable .exe, nous recommandons l'utilisation de **Tauri** qui permet de transformer l'application React en application de bureau native.

### Étapes d'installation de Tauri

1. **Prérequis**
   - Rust (https://rustup.rs/)
   - Visual Studio Build Tools ou Visual Studio Community avec C++ workload
   - WebView2 (généralement déjà installé sur Windows 10/11)

2. **Installation des dépendances Tauri**
   ```bash
   npm install @tauri-apps/api@^1
   npm install @tauri-apps/cli@^1 --save-dev
   ```

3. **Initialisation de Tauri**
   ```bash
   npx tauri init
   ```

4. **Configuration src-tauri/tauri.conf.json**
   ```json
   {
     "build": {
       "beforeBuildCommand": "npm run build",
       "beforeDevCommand": "npm run dev",
       "devPath": "http://localhost:8080",
       "distDir": "../dist"
     },
     "package": {
       "productName": "Courrier Express Littoral",
       "version": "1.0.0"
     },
     "tauri": {
       "allowlist": {
         "all": false,
         "fs": {
           "all": true,
           "readFile": true,
           "writeFile": true,
           "readDir": true,
           "copyFile": true,
           "createDir": true,
           "removeDir": true,
           "removeFile": true
         },
         "path": {
           "all": true
         },
         "dialog": {
           "all": true,
           "open": true,
           "save": true
         }
       },
       "bundle": {
         "active": true,
         "targets": "all",
         "identifier": "com.courrier-express-littoral.app",
         "icon": [
           "icons/32x32.png",
           "icons/128x128.png",
           "icons/128x128@2x.png",
           "icons/icon.icns",
           "icons/icon.ico"
         ]
       },
       "security": {
         "csp": null
       },
       "windows": [
         {
           "fullscreen": false,
           "resizable": true,
           "title": "Courrier Express Littoral",
           "width": 1200,
           "height": 800,
           "minWidth": 800,
           "minHeight": 600
         }
       ]
     }
   }
   ```

### Scripts npm à ajouter

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  }
}
```

### Commandes de développement et build

- **Mode développement** : `npm run tauri:dev`
- **Build production** : `npm run tauri:build`

Le fichier .exe sera généré dans `src-tauri/target/release/bundle/nsis/`

## Avantages du déploiement local

1. **Stockage 100% local** : Toutes les données restent sur le disque dur de l'utilisateur
2. **Pas de dépendance internet** : L'application fonctionne complètement hors ligne
3. **Performance optimale** : Accès direct aux ressources système
4. **Sécurité renforcée** : Aucune transmission de données sensibles
5. **Installation simple** : Un seul fichier .exe à distribuer

## Structure de stockage sur disque

L'application utilise le File System Access API et crée :
- Un dossier de stockage choisi par l'utilisateur
- `mail-data.json` : Fichier principal contenant tous les courriers
- `app-storage.json` : Fichier pour les données auxiliaires (commentaires, paramètres, etc.)

## Migration depuis le stockage web

L'application détecte automatiquement l'ancien stockage localStorage/IndexedDB et propose la migration vers le stockage sur disque lors de la première utilisation.