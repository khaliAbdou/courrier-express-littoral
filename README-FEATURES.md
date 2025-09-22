# ANOR Desktop - Fonctionnalités Complètes

## Vue d'ensemble
ANOR Desktop est une application de gestion des dossiers qualité conçue pour le déploiement en exécutable Windows (.exe). Elle offre un contrôle total sur les données avec stockage exclusif sur disque dur.

## ✅ Fonctionnalités Implémentées

### 🔐 Système de Licence
- **Période d'essai** : 3 mois gratuits (90 jours)
- **Licence complète** : 80 000 FCFA par utilisateur/an
- **Activation** : Clés au format ANOR-XXXX-XXXX-XXXX-XXXX
- **Vérification automatique** au démarrage
- **Alertes de rappel** : 30, 14 et 7 jours avant expiration
- **Interface de gestion** dans les paramètres

### 🛠️ Configuration Personnalisable
- **Nom du service** : Modifiable par l'utilisateur
- **Logo personnalisé** : Upload d'images (JPG, PNG, GIF - max 5MB)
- **Gestion des employés** : Ajout/suppression par bureau
- **5 bureaux prédéfinis** :
  - Normalisation
  - Promotion (Kome Ntengue, Amougou Noelle)
  - Contrôle Qualité
  - PECAE
  - Certification Produits Locaux (Ngam Giovanni, Ondoa Magalie)

### 💾 Stockage Exclusif Disque Dur
- **Suppression complète** du stockage navigateur (localStorage, IndexedDB)
- **API File System Access** pour accès natif aux fichiers
- **Stockage illimité** selon la capacité du disque
- **Sauvegarde automatique** toutes les 5 minutes
- **Import/Export** de données JSON
- **Résilience** : Données conservées entre redémarrages

### 📊 Gestion Complète des Dossiers
- **Courriers entrants et sortants**
- **Changement de statut 1 clic**
- **Suivi des échéances**
- **Système de priorités**
- **Attribution par bureau/collaborateur**
- **Commentaires et historique**

### 📈 Rapports et Analyses
- **Rapports périodiques** : Hebdomadaire, mensuel, annuel
- **Filtrage avancé** : Par collaborateur ou bureau
- **Métriques de performance** :
  - Dossiers attribués/complétés
  - Taux de retard
  - Charge de travail
- **Export CSV** automatique
- **Graphiques interactifs** avec Recharts

### 🎨 Interface Utilisateur
- **Design responsive** avec Tailwind CSS
- **Composants Shadcn/ui** pour cohérence
- **Navigation intuitive** avec sidebar collapsible
- **Thème personnalisable**
- **Notifications toast** pour feedback utilisateur

## 🏗️ Architecture Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** pour build optimisé
- **React Router** pour navigation SPA
- **TanStack Query** pour gestion d'état
- **Tailwind CSS** + **Shadcn/ui** pour design system

### Stockage
- **File System Access API** (Chrome/Edge 86+)
- **Electron Bridge** pour environnement desktop
- **JSON** comme format de données
- **Compression automatique** des gros volumes

### Déploiement
- **Electron** pour empaquetage desktop
- **Electron Builder** pour génération .exe
- **Auto-updater** (configurable)
- **Signature de code** Windows (optionnel)

## 📦 Structure des Fichiers

```
src/
├── components/
│   ├── config/           # Configuration personnalisable
│   ├── license/          # Gestion des licences
│   ├── storage/          # Interface stockage
│   ├── alerts/           # Notifications système
│   └── ui/               # Composants Shadcn/ui
├── utils/
│   ├── licenseManager.ts # Logique de licence
│   ├── configManager.ts  # Configuration app
│   ├── storageAdapter.ts # Abstraction stockage
│   ├── fileSystemStorage.ts # API File System
│   └── electronBridge.ts # Interface Electron
├── pages/
│   ├── Settings.tsx      # Page de configuration
│   └── [autres pages]
└── types/                # Définitions TypeScript
```

## 🚀 Commandes de Déploiement

### Développement
```bash
npm run dev              # Mode développement
npm run build           # Build production React
npm run preview         # Aperçu build
```

### Electron
```bash
npm run electron:dev    # Electron + React dev
npm run electron:build  # Build complet
npm run electron:dist   # Génération .exe
```

### Tests
```bash
npm run test           # Tests unitaires
npm run test:e2e       # Tests end-to-end
npm run lint           # Vérification code
```

## 🔧 Configuration Electron

### Installation
```bash
npm install --save-dev electron electron-builder
npm install --save-dev concurrently wait-on
```

### Build Script (package.json)
```json
{
  "main": "electron/main.js",
  "build": {
    "appId": "com.anor.desktop",
    "productName": "ANOR Desktop",
    "win": {
      "target": "nsis",
      "icon": "electron/icon.ico"
    }
  }
}
```

## 🛡️ Sécurité

### Protection des Données
- **Stockage local exclusif** - Aucune donnée sur internet
- **Chiffrement des fichiers sensibles** (licence)
- **Validation d'intégrité** des données
- **Sauvegarde automatique** préventive

### Licence
- **Binding machine** via ID système
- **Vérification intégrité** des clés
- **Expiration automatique** après 1 an
- **Mode dégradé** après expiration

## 📋 Liste de Contrôle Déploiement

### Prérequis
- [ ] Node.js 18+ installé
- [ ] Environnement Windows pour build .exe
- [ ] Certificat de signature de code (optionnel)
- [ ] Serveur de distribution (optionnel)

### Configuration
- [ ] Personnaliser les paramètres dans configManager.ts
- [ ] Configurer les clés de licence
- [ ] Tester l'API File System Access
- [ ] Vérifier les permissions de fichiers

### Tests
- [ ] Test installation propre
- [ ] Test mise à jour de licence
- [ ] Test stockage/récupération données
- [ ] Test export/import
- [ ] Test performance avec gros volumes

### Distribution
- [ ] Build de production
- [ ] Test sur machines cibles
- [ ] Documentation utilisateur
- [ ] Formation équipes
- [ ] Support technique

## 🎯 Avantages Clés

1. **Autonomie totale** : Aucune dépendance internet
2. **Stockage illimité** : Selon capacité disque
3. **Performance optimale** : Application native
4. **Sécurité renforcée** : Données 100% locales
5. **Personnalisation complète** : Logo, employés, services
6. **Licence équitable** : 3 mois d'essai + prix abordable
7. **Installation simple** : Un seul fichier .exe
8. **Maintenance facile** : Mise à jour automatisée

## 📞 Support

Pour toute question technique ou commerciale :
- 📧 **Email** : support-anor@littoral.fr
- 📱 **Téléphone** : +33 X XX XX XX XX
- 🌐 **Site web** : https://anor-littoral.fr
- 📋 **Documentation** : Incluse dans l'application

---

**ANOR Desktop v1.0** - Solution professionnelle de gestion documentaire
*Développé spécialement pour le Service Technique de l'Antenne du Littoral*