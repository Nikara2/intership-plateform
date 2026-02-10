# 🎓 Plateforme de Gestion de Stages

Plateforme web et mobile complète pour la gestion des stages étudiants, développée avec Flutter et NestJS.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement du Backend](#lancement-du-backend)
- [Lancement du Frontend Web](#lancement-du-frontend-web)
- [Lancement de l'Application Mobile](#lancement-de-lapplication-mobile)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)

---

## ✨ Fonctionnalités

### Pour les Étudiants
- 🔐 **Authentification complète** (inscription, connexion, onboarding)
- 👤 **Gestion du profil** avec upload de CV (PDF/DOC/DOCX)
- 📊 **Suivi de complétion du profil** (66-100%)
- 💼 **Recherche et filtrage d'offres** de stage
- 📝 **Gestion des candidatures** avec tracking de statut
- 🔔 **Système de notifications** avec persistance locale
- 🌙 **Thème clair/sombre** (en développement)
- ⚙️ **Paramètres et préférences**
- ❓ **Centre d'aide** avec FAQ

### Dashboard SuperDesign
- 📈 Statistiques en temps réel
- 🎨 Interface moderne et responsive
- 🚀 Performance optimisée
- 📱 Support multi-plateforme (Web, Android, iOS, Desktop)

---

## 🛠️ Technologies utilisées

### Frontend
- **Flutter** 3.x (Dart)
- **Provider** (State Management)
- **SharedPreferences** (Persistance locale)
- **FilePicker** (Upload de fichiers)
- **HTTP** (Appels API)

### Backend
- **NestJS** 10.x (Node.js + TypeScript)
- **PostgreSQL** (Base de données)
- **TypeORM** (ORM)
- **JWT** (Authentification)
- **Multer** (Upload de fichiers)

---

## 📦 Prérequis

Assurez-vous d'avoir installé :

### Pour le Backend
- **Node.js** >= 18.x
- **npm** >= 9.x ou **yarn**
- **PostgreSQL** >= 14.x

### Pour le Frontend/Mobile
- **Flutter SDK** >= 3.0.0
- **Dart** >= 3.0.0
- **Android Studio** (pour Android)
- **Xcode** (pour iOS, macOS uniquement)
- **Chrome** (pour Web)

### Vérification des installations

```bash
# Vérifier Node.js
node --version

# Vérifier Flutter
flutter --version
flutter doctor

# Vérifier PostgreSQL
psql --version
```

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <url-du-repo>
cd Intership-plateforme
```

### 2. Configuration de la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE internship_db;

# Quitter psql
\q
```

### 3. Installer les dépendances

#### Backend
```bash
cd Backend/internship-backend
npm install
```

#### Frontend/Mobile
```bash
cd flutter_app/internship_app_new
flutter pub get
```

---

## 🖥️ Lancement du Backend

### 1. Configuration

Créez un fichier `.env` dans `Backend/internship-backend/` :

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=votre_mot_de_passe
DATABASE_NAME=internship_db

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRATION=7d

# Server
PORT=3001
```

### 2. Démarrer le serveur

```bash
cd Backend/internship-backend

# Mode développement (avec hot-reload)
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

Le backend sera accessible sur **http://localhost:3001**

### 3. Vérification

```bash
# Tester l'API
curl http://localhost:3001/health

# Devrait retourner : {"status":"ok"}
```

---

## 🌐 Lancement du Frontend Web

### 1. Configuration

Vérifiez que l'URL du backend est correcte dans `flutter_app/internship_app_new/lib/constants/api_constants.dart` :

```dart
static const String baseUrl = 'http://localhost:3001';
```

### 2. Lancer l'application web

```bash
cd flutter_app/internship_app_new

# Lancer sur Chrome
flutter run -d chrome

# Ou avec hot-reload
flutter run -d chrome --web-port 3000
```

L'application web sera accessible sur **http://localhost:3000** (ou un autre port si 3000 est occupé)

### 3. Build pour production

```bash
# Build optimisé
flutter build web --release

# Les fichiers seront dans build/web/
```

---

## 📱 Lancement de l'Application Mobile

### Pour Android

#### 1. Configuration

Assurez-vous que l'URL du backend pointe vers votre machine (pas localhost) :

```dart
// Pour émulateur Android
static const String baseUrl = 'http://10.0.2.2:3001';

// Pour appareil physique (remplacez par votre IP locale)
static const String baseUrl = 'http://192.168.1.X:3001';
```

#### 2. Lancer sur émulateur

```bash
cd flutter_app/internship_app_new

# Lister les appareils disponibles
flutter devices

# Lancer sur un émulateur Android
flutter run

# Ou spécifier un appareil
flutter run -d <device-id>
```

#### 3. Build APK

```bash
# Debug APK
flutter build apk --debug

# Release APK
flutter build apk --release

# APK sera dans build/app/outputs/flutter-apk/
```

#### 4. Installer sur un appareil

```bash
# Via ADB
adb install build/app/outputs/flutter-apk/app-release.apk
```

### Pour iOS

#### 1. Configuration

```bash
cd flutter_app/internship_app_new/ios
pod install
cd ..
```

#### 2. Lancer sur simulateur

```bash
# Ouvrir simulateur iOS
open -a Simulator

# Lancer l'app
flutter run -d iPhone

# Ou via Xcode
open ios/Runner.xcworkspace
```

#### 3. Build pour App Store

```bash
flutter build ios --release
```

---

## 📁 Structure du projet

```
Intership-plateforme/
├── Backend/
│   └── internship-backend/
│       ├── src/
│       │   ├── auth/              # Authentification
│       │   ├── students/          # Gestion étudiants
│       │   ├── offers/            # Gestion offres
│       │   ├── applications/      # Gestion candidatures
│       │   └── main.ts
│       ├── cvs/                   # Stockage CV
│       └── package.json
│
└── flutter_app/
    └── internship_app_new/
        ├── lib/
        │   ├── core/              # Theme, widgets, constants
        │   ├── features/          # Écrans (auth, home, profile, etc.)
        │   ├── models/            # Modèles de données
        │   ├── providers/         # State management
        │   └── main.dart
        ├── android/               # Config Android
        ├── ios/                   # Config iOS
        ├── web/                   # Config Web
        └── pubspec.yaml
```

---

## 🔌 API Endpoints

### Authentification
```
POST   /auth/register          # Inscription
POST   /auth/login             # Connexion
```

### Profil Étudiant
```
GET    /students/me            # Obtenir profil
PATCH  /students/me            # Modifier profil
POST   /students/me/cv         # Upload CV
GET    /students/me/cv         # Télécharger CV
DELETE /students/me/cv         # Supprimer CV
POST   /students/me/skills     # Ajouter compétence
DELETE /students/me/skills/:id # Supprimer compétence
```

### Offres de Stage
```
GET    /offers                 # Liste des offres
GET    /offers/:id             # Détails d'une offre
POST   /offers                 # Créer offre (admin)
PATCH  /offers/:id             # Modifier offre (admin)
DELETE /offers/:id             # Supprimer offre (admin)
```

### Candidatures
```
GET    /applications/student   # Mes candidatures
POST   /applications           # Postuler
PATCH  /applications/:id       # Modifier candidature
DELETE /applications/:id       # Annuler candidature
```

---

## 🐛 Dépannage

### Backend ne démarre pas
- Vérifiez que PostgreSQL est lancé
- Vérifiez les credentials dans `.env`
- Vérifiez que le port 3001 est libre

### Frontend ne se connecte pas au backend
- Vérifiez que le backend est lancé
- Vérifiez l'URL dans `api_constants.dart`
- Pour mobile : utilisez l'IP locale, pas localhost

### Upload de CV échoue
- Vérifiez que le dossier `cvs/` existe dans le backend
- Vérifiez les permissions du dossier
- Vérifiez la taille du fichier (max 5MB)

### Erreurs Flutter
```bash
# Nettoyer le cache
flutter clean
flutter pub get

# Réparer Flutter
flutter doctor
flutter upgrade
```

---

## 📝 Comptes de test

### Étudiant
- **Email:** `student@example.com`
- **Mot de passe:** `password123`

### Admin
- **Email:** `admin@example.com`
- **Mot de passe:** `admin123`

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 👥 Auteurs

- **Développement** - Équipe de développement
- **Co-Authored-By** - Claude Sonnet 4.5

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@example.com
- 🐛 Issues : [GitHub Issues](lien-vers-issues)

---

## 🎉 Démarrage rapide (TL;DR)

```bash
# 1. Backend
cd Backend/internship-backend
npm install
# Configurer .env
npm run start:dev

# 2. Frontend Web (nouveau terminal)
cd flutter_app/internship_app_new
flutter pub get
flutter run -d chrome

# 3. Mobile Android (nouveau terminal)
cd flutter_app/internship_app_new
# Modifier baseUrl dans api_constants.dart
flutter run

# Voilà ! 🚀
```

---

**Dernière mise à jour:** Février 2026
