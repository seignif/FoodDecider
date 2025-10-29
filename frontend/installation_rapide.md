# 🎉 FoodDecider - Guide Complet d'Installation

Félicitations ! Tu as créé une application fullstack complète ! 🚀

## 📦 Installation

### BACKEND
```bash
cd backend
npm install
docker-compose up -d
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### MOBILE
```bash
cd mobile
npm install
npm start
```

## ⚙️ Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fooddecider"
JWT_SECRET="ton-secret"
PORT=3000
```

### Mobile (src/services/api.ts)
Change l'URL selon ton appareil :
- Android Emulator: `http://10.0.2.2:3000/api`
- iOS Simulator: `http://localhost:3000/api`
- Téléphone: `http://TON_IP:3000/api`

## ✅ Fonctionnalités

**Backend:**
- ✅ Auth JWT (register/login)
- ✅ Suggestions de repas
- ✅ Historique
- ✅ Préférences

**Mobile:**
- ✅ Questionnaire interactif
- ✅ Affichage suggestions
- ✅ Auth (login/register)
- ✅ Profil utilisateur

## 📚 Documentation Complète

Voir README.md dans chaque dossier (backend/ et mobile/)