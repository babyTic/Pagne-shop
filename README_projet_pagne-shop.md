# 🪡 PagneShop — E-commerce de vente de pagnes africains

![PagneShop](https://img.shields.io/badge/PagneShop-v1.0-orange)
![Laravel](https://img.shields.io/badge/Laravel-11-red)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-cyan)
![License](https://img.shields.io/badge/license-MIT-green)

> Application e-commerce fullstack de vente de pagnes africains (Wax, Kita, Bogolan, Bazin) avec système de paiement intégré (Stripe + CinetPay) et assistant IA.

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [API Routes](#api-routes)
- [Paiement](#paiement)
- [Déploiement](#déploiement)

---

## 🎯 Aperçu

PagneShop est une application e-commerce complète permettant :
- Aux **clients** de parcourir, acheter des pagnes et suivre leurs commandes
- Aux **admins** de gérer les produits, commandes et consulter les statistiques
- Le **paiement** via carte bancaire (Stripe) ou Mobile Money (CinetPay)
- Un **assistant IA** flottant pour répondre aux questions des clients

---

## ✨ Fonctionnalités

### 🛍️ Client
- Inscription / Connexion avec redirection par rôle
- Catalogue de produits avec recherche en temps réel
- Panier persistant (ajout, suppression, modification quantité)
- Commande avec choix du mode de paiement
- Historique des commandes avec statuts
- Page profil utilisateur
- Chat assistant IA flottant et déplaçable

### 🛠️ Admin
- Dashboard avec statistiques (KPI, top produits, stock faible)
- Gestion complète des produits (CRUD + upload image)
- Gestion des commandes avec mise à jour des statuts
- Visualisation des revenus par statut

### 💳 Paiement
- **Stripe** — Carte bancaire (Visa, Mastercard)
- **CinetPay** — Mobile Money (Orange Money, MTN MoMo, Moov)

---

## 🛠️ Stack technique

| Côté | Technologie | Version |
|---|---|---|
| Backend | Laravel | 11 |
| Auth | Laravel Sanctum | - |
| Base de données | PostgreSQL | - |
| Frontend | React | 18 |
| Styling | Tailwind CSS | v4 |
| HTTP Client | Axios | - |
| Paiement 1 | Stripe | - |
| Paiement 2 | CinetPay | - |
| Stockage | Laravel Storage | - |

---

## 📦 Prérequis

- PHP >= 8.2
- Composer
- Node.js >= 18
- PostgreSQL
- Git

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/TON_USERNAME/pagne-shop.git
git clone https://github.com/TON_USERNAME/pagne-frontend.git
```

### 2. Backend Laravel

```bash
cd pagne-shop

# Installer les dépendances
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# puis lancer les migrations et seeders
php artisan migrate --seed

# Créer le lien symbolique pour le stockage
php artisan storage:link

# Lancer le serveur
php artisan serve
```

### 3. Frontend React

```bash
cd pagne-frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Lancer le serveur de développement
npm run dev
```

---

## ⚙️ Configuration

### Backend — `.env`

```env
APP_NAME=PagneShop
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173

# Base de données PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=pagne_shop
DB_USERNAME=postgres
DB_PASSWORD=ton_mot_de_passe

# Stripe
STRIPE_KEY=pk_test_XXXXXXXXXXXXXXXX
STRIPE_SECRET=sk_test_XXXXXXXXXXXXXXXX

# CinetPay
CINETPAY_API_KEY=XXXXXXXXXXXXXXXX
CINETPAY_SITE_ID=XXXXXXXXXXXXXXXX
CINETPAY_BASE_URL=https://api-checkout.cinetpay.com/v2

# Anthropic (optionnel)
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXX
```

### Frontend — `.env`

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXX
```

---

## 📁 Structure du projet

```
pagne-shop/                          # Backend Laravel
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php      # Inscription, connexion, déconnexion
│   │   │   ├── ProductController.php   # CRUD produits + upload image
│   │   │   ├── OrderController.php     # Gestion commandes
│   │   │   ├── StripeController.php    # Paiement Stripe
│   │   │   ├── PaymentController.php   # Paiement CinetPay
│   │   │   └── ChatController.php      # Assistant IA (optionnel)
│   │   └── Resources/
│   │       └── ProductResource.php     # Formatage API produits
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       ├── Category.php
│       ├── Order.php
│       └── OrderItem.php
├── database/
│   ├── migrations/                     # Toutes les migrations
│   └── seeders/                        # CategorySeeder, UserSeeder
├── routes/
│   └── api.php                         # Toutes les routes API
└── storage/app/public/products/        # Images des produits

pagne-frontend/                      # Frontend React
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                  # Navigation principale
│   │   ├── PrivateRoute.jsx            # Protection routes client
│   │   ├── AdminRoute.jsx              # Protection routes admin
│   │   ├── FloatingChat.jsx            # Assistant IA flottant
│   │   ├── StripePaymentModal.jsx      # Modale paiement Stripe
│   │   └── PaymentModal.jsx            # Modale paiement CinetPay
│   ├── context/
│   │   ├── AuthContext.jsx             # Gestion authentification
│   │   └── CartContext.jsx             # Gestion panier
│   ├── layouts/
│   │   └── MainLayout.jsx              # Layout principal
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   ├── Orders.jsx
│   │   ├── Profile.jsx
│   │   └── admin/
│   │       └── Dashboard.jsx           # Dashboard admin complet
│   ├── services/
│   │   └── api.js                      # Configuration Axios
│   └── App.jsx                         # Routes de l'application
```

---

## 🔌 API Routes

### Publiques
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/register` | Inscription |
| POST | `/api/login` | Connexion |

### Protégées (auth:sanctum)
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/logout` | Déconnexion |
| GET | `/api/profile` | Profil utilisateur |
| GET | `/api/products` | Liste des produits |
| GET | `/api/products/{id}` | Détail produit |
| POST | `/api/products` | Créer produit (admin) |
| PUT | `/api/products/{id}` | Modifier produit (admin) |
| DELETE | `/api/products/{id}` | Supprimer produit (admin) |
| POST | `/api/orders` | Créer une commande |
| GET | `/api/my-orders` | Commandes du client |
| GET | `/api/orders` | Toutes les commandes (admin) |
| PUT | `/api/orders/{id}/status` | Modifier statut (admin) |
| POST | `/api/stripe/intent` | Créer PaymentIntent Stripe |
| POST | `/api/stripe/confirm` | Confirmer paiement Stripe |
| POST | `/api/payment/initiate` | Initier paiement CinetPay |
| POST | `/api/payment/check` | Vérifier paiement CinetPay |

### Webhook (public)
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/payment/notify` | Webhook CinetPay |

---

## 💳 Paiement

### Stripe — Carte test
```
Numéro  : 4242 4242 4242 4242
Date    : 12/34
CVC     : 123
Code postal : 00000
```

### CinetPay — Mobile Money test
```
Orange Money : 07 00 00 00 01
MTN MoMo     : 05 00 00 00 01
Code OTP     : 000000
```

---

## 👥 Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@pagne.com | password |
| Client | client@pagne.com | password |

---

## 🚢 Déploiement

### Backend — Railway / Heroku
```bash
# Variables d'environnement à configurer sur le serveur
APP_ENV=production
APP_URL=https://ton-domaine.com
DB_CONNECTION=pgsql
STRIPE_SECRET=sk_live_XXXXXXXXXXXXXXXX
CINETPAY_API_KEY=XXXXXXXXXXXXXXXX
```

### Frontend — Vercel / Netlify
```bash
npm run build
# Configurer VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXXXXXXXXXXXXX
```

---

## 📝 Licence

MIT License — Libre d'utilisation pour tout projet personnel ou commercial.

---

## 👨‍💻 Auteur

Développé avec ❤️ pour la culture africaine 🌍

**PagneShop** — *L'authenticité africaine, à portée de clic.*
