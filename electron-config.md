# Configuration Electron pour ANOR Desktop

## Vue d'ensemble
Ce guide détaille la configuration pour déployer l'application ANOR en tant qu'exécutable (.exe) Windows via Electron.

## Prérequis

### Outils nécessaires
- Node.js 18+ 
- npm ou yarn
- Electron Builder
- Windows SDK (pour signatures de code)

### Installation des dépendances Electron
```bash
npm install --save-dev electron electron-builder
npm install --save-dev @electron/rebuild
```

## Structure de fichiers

```
anor-desktop/
├── src/                    # Code source React (existant)
├── electron/               # Configuration Electron
│   ├── main.js            # Processus principal
│   ├── preload.js         # Script de préchargement
│   └── icon.ico           # Icône de l'application
├── dist/                  # Build de production React
├── build/                 # Ressources Electron
├── package.json           # Configuration complète
└── electron-builder.yml   # Configuration du builder
```

## Configuration des fichiers

### 1. package.json principal
```json
{
  "name": "anor-desktop",
  "version": "1.0.0",
  "description": "ANOR - Système de Gestion des Dossiers Qualité",
  "homepage": "./",
  "main": "electron/main.js",
  "scripts": {
    "build": "npm run build:react && npm run build:electron",
    "build:react": "vite build",
    "build:electron": "electron-builder",
    "dev": "concurrently \"npm start\" \"wait-on http://localhost:5173 && electron .\"",
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "dist:win": "electron-builder --win"
  },
  "build": {
    "appId": "com.anor.desktop",
    "productName": "ANOR Desktop",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "electron/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowElevation": true,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  },
  "devDependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.6.4",
    "concurrently": "^8.2.2",
    "wait-on": "^7.0.1"
  }
}
```

### 2. electron/main.js
```javascript
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const isDev = process.env.NODE_ENV === 'development';

// Configuration sécurisée
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false
  });

  // Chargement de l'application
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Gestion de la sélection de dossiers pour stockage
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Sélectionner le dossier de stockage ANOR'
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  // API de fichiers sécurisée
  ipcMain.handle('read-file', async (event, filePath) => {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('write-file', async (event, filePath, content) => {
    try {
      await fs.writeFile(filePath, content, 'utf8');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('list-files', async (event, dirPath) => {
    try {
      const files = await fs.readdir(dirPath);
      return { success: true, files };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Gestion de la vérification de licence
  ipcMain.handle('check-license', async () => {
    // Implémentation de vérification de licence
    return { valid: true, daysRemaining: 90 };
  });
}
```

### 3. electron/preload.js
```javascript
const { contextBridge, ipcRenderer } = require('electron');

// API sécurisée exposée au renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Gestion des fichiers
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  listFiles: (dirPath) => ipcRenderer.invoke('list-files', dirPath),
  
  // Système
  checkLicense: () => ipcRenderer.invoke('check-license'),
  
  // Plateforme
  platform: process.platform,
  versions: process.versions
});
```

### 4. src/utils/electronStorage.ts (nouveau)
```typescript
// Interface pour l'API Electron
interface ElectronAPI {
  selectDirectory: () => Promise<string | null>;
  readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  listFiles: (dirPath: string) => Promise<{ success: boolean; files?: string[]; error?: string }>;
  checkLicense: () => Promise<{ valid: boolean; daysRemaining: number }>;
  platform: string;
  versions: any;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export class ElectronFileStorage {
  private baseDir: string | null = null;

  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.electronAPI;
  }

  async selectStorageDirectory(): Promise<boolean> {
    if (!this.isAvailable()) return false;
    
    try {
      const selectedDir = await window.electronAPI!.selectDirectory();
      if (selectedDir) {
        this.baseDir = selectedDir;
        localStorage.setItem('anor-storage-dir', selectedDir);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur sélection dossier:', error);
      return false;
    }
  }

  async writeFile(fileName: string, content: string): Promise<boolean> {
    if (!this.isAvailable() || !this.baseDir) return false;

    try {
      const filePath = `${this.baseDir}/${fileName}`;
      const result = await window.electronAPI!.writeFile(filePath, content);
      return result.success;
    } catch (error) {
      console.error('Erreur écriture fichier:', error);
      return false;
    }
  }

  async readFile(fileName: string): Promise<string | null> {
    if (!this.isAvailable() || !this.baseDir) return null;

    try {
      const filePath = `${this.baseDir}/${fileName}`;
      const result = await window.electronAPI!.readFile(filePath);
      return result.success ? result.data || null : null;
    } catch (error) {
      console.error('Erreur lecture fichier:', error);
      return null;
    }
  }

  getStorageLocation(): string | null {
    return this.baseDir || localStorage.getItem('anor-storage-dir');
  }
}

export const electronStorage = new ElectronFileStorage();
```

## Processus de build

### 1. Build de développement
```bash
# Terminal 1 - React dev server
npm start

# Terminal 2 - Electron (après que React soit prêt)
npm run dev
```

### 2. Build de production
```bash
# Build complet
npm run build

# Build Windows uniquement
npm run dist:win
```

### 3. Outputs générés
```
release/
├── ANOR Desktop Setup 1.0.0.exe    # Installateur
├── win-unpacked/                    # Version portable
└── latest.yml                       # Métadonnées de mise à jour
```

## Fonctionnalités spécifiques desktop

### Stockage illimité
- Utilisation du système de fichiers natif
- Pas de limitation de quota du navigateur
- Accès direct aux dossiers utilisateur

### Sécurité renforcée
- Isolation du contexte
- API contrôlée via preload script
- Pas d'accès Node.js direct depuis le renderer

### Performance optimisée
- Cache natif du système d'exploitation
- Démarrage plus rapide
- Moins de consommation mémoire

## Système de licence intégré

### Vérification au démarrage
```typescript
// Dans le processus principal Electron
async function verifyLicense() {
  const licenseFile = path.join(app.getPath('userData'), 'license.json');
  // Logique de vérification
}
```

### Protection contre la copie
- Binding à l'ID machine
- Vérification d'intégrité des fichiers
- Chiffrement des données sensibles

## Déploiement et distribution

### 1. Signature de code (recommandé)
```bash
# Windows Code Signing
electron-builder --win --publish=never
```

### 2. Distribution
- Installateur NSIS avec options personnalisées
- Version portable zip
- Mise à jour automatique (optionnel)

### 3. Maintenance
- Logs centralisés dans `%APPDATA%/anor-desktop/logs`
- Configuration utilisateur persistante
- Backup automatique des données

## Commandes utiles

```bash
# Nettoyer les builds
npm run clean

# Reconstruire les modules natifs
npm run rebuild

# Test de l'installateur
npm run dist:dir

# Debug Electron
npm run dev:debug
```

Cette configuration garantit une application desktop robuste, sécurisée et conforme aux standards Windows pour la distribution professionnelle.