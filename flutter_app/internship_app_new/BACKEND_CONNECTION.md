# 🔌 Connexion Backend - Guide de Test

## ✅ Ce qui est configuré

### 1. **AuthProvider** - Complet
- ✅ Login avec email/password
- ✅ Register (inscription étudiant)
- ✅ Fetch student profile
- ✅ Update profile
- ✅ Logout
- ✅ Token persistence (SharedPreferences)
- ✅ Auto-login au démarrage
- ✅ Gestion des erreurs détaillées

### 2. **API Configuration**
- ✅ Base URL : `http://localhost:3000`
- ✅ Endpoints définis dans `lib/constants/api_constants.dart`
- ✅ Headers automatiques (Auth Bearer token)

### 3. **Packages installés**
- ✅ `http: ^1.2.0` - Requêtes HTTP
- ✅ `shared_preferences: ^2.2.2` - Stockage local du token

## 🚀 Comment tester

### Étape 1 : Démarrer le backend

```bash
cd Backend/internship-backend
npm install
npm run dev
```

Le backend doit écouter sur `http://localhost:3000`

### Étape 2 : Vérifier l'URL selon votre plateforme

Dans `lib/constants/api_constants.dart`, l'URL est configurée :

```dart
static const String baseUrl = 'http://localhost:3000';
```

**Important** : Selon votre environnement de test :

| Plateforme | URL à utiliser |
|------------|----------------|
| **iOS Simulator** | `http://localhost:3000` ✅ |
| **Android Emulator** | `http://10.0.2.2:3000` ⚠️ |
| **Device Physique** | `http://YOUR_LOCAL_IP:3000` (ex: `http://192.168.1.10:3000`) |
| **Web (Chrome)** | `http://localhost:3000` ✅ |

### Étape 3 : Lancer l'app Flutter

```bash
cd flutter_app/internship_app_new
flutter run
```

Ou utilisez VS Code / Android Studio pour lancer l'app.

### Étape 4 : Tester la connexion

#### Test 1 : Inscription (Register)
1. Lancez l'app
2. Sur l'écran Onboarding, cliquez "Commencer"
3. Sur l'écran Login, cliquez "S'inscrire"
4. Remplissez le formulaire :
   - Prénom : Jean
   - Nom : Dupont
   - Email : `jean.dupont@ecole.fr`
   - École : HEC
   - Niveau : Master 1
   - Mot de passe : `password123`
   - Acceptez les conditions
5. Cliquez "S'inscrire"

**Résultat attendu** :
- ✅ Un compte est créé dans la base de données
- ✅ Vous êtes automatiquement connecté
- ✅ Redirection vers HomeScreen

#### Test 2 : Connexion (Login)
1. Sur l'écran Login, entrez :
   - Email : `jean.dupont@ecole.fr`
   - Mot de passe : `password123`
2. Cliquez "Se connecter"

**Résultat attendu** :
- ✅ Token JWT reçu et stocké
- ✅ Profil étudiant chargé
- ✅ Redirection vers HomeScreen

#### Test 3 : Auto-login
1. Fermez et relancez l'app
2. L'app devrait automatiquement vous reconnecter
3. Vous devriez arriver directement sur HomeScreen

## 🐛 Débogage

### Problème : "Impossible de se connecter au serveur"

**Solution** :
1. Vérifiez que le backend est lancé : `http://localhost:3000/health`
2. Si Android Emulator, changez l'URL vers `http://10.0.2.2:3000`
3. Désactivez le firewall temporairement
4. Vérifiez les logs Flutter : Recherchez les messages commençant par 🔑, 📡, ❌

### Voir les logs détaillés

Les logs de connexion affichent :
- 🔑 Login attempt
- 📧 Email utilisé
- 📡 Response status code
- 📄 Response body
- ❌ Erreurs détaillées

Exemple dans la console :
```
🔑 Logging in to: http://localhost:3000/auth/login
📧 Email: jean.dupont@ecole.fr
📡 Response status: 200
📄 Response body: {"access_token":"eyJhbG...","user":{...}}
👤 Fetching profile from: http://localhost:3000/students/me
📡 Profile response status: 200
```

### Problème : "Email ou mot de passe incorrect"

**Vérifications** :
1. Le compte existe-t-il dans la base de données ?
2. Le mot de passe est-il correct ?
3. Le backend valide-t-il correctement les credentials ?

### Problème : Token invalide après redémarrage

**Solution** :
1. Vérifiez que le JWT secret est le même dans le backend
2. Vérifiez l'expiration du token (dans le backend)
3. Supprimez les données de l'app : Settings > Apps > StageConnect > Clear Data

## 📝 Structure des réponses API attendues

### POST /auth/register
**Request** :
```json
{
  "email": "jean.dupont@ecole.fr",
  "password": "password123",
  "role": "STUDENT",
  "firstName": "Jean",
  "lastName": "Dupont",
  "school": "HEC",
  "level": "Master 1"
}
```

**Response (200)** :
```json
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "jean.dupont@ecole.fr",
    "role": "STUDENT"
  }
}
```

### POST /auth/login
**Request** :
```json
{
  "email": "jean.dupont@ecole.fr",
  "password": "password123"
}
```

**Response (200)** :
```json
{
  "access_token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "jean.dupont@ecole.fr",
    "role": "STUDENT"
  }
}
```

### GET /students/me
**Headers** :
```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

**Response (200)** :
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "school": "HEC",
  "program": "Finance",
  "level": "Master 1",
  "phone": "+33 6 12 34 56 78"
}
```

## 🎯 Prochaines étapes

Après avoir testé la connexion backend :
1. ✅ Login / Register fonctionnels
2. 🔄 Implémenter les autres écrans (Dashboard, Offers, Applications)
3. 🔄 Connecter les autres endpoints (Offers, Applications, etc.)

---

**Besoin d'aide ?** Vérifiez les logs console Flutter et backend pour identifier le problème exact.
