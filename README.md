# Party Shop - E-commerce Platform for Party Supplies

Un proiect full-stack pentru un magazin online de accesorii pentru petreceri, construit cu Next.js (frontend), Express.js (backend) și Prisma (bază de date).

## Tehnologii Utilizate

- **Frontend**: Next.js 16, React 18, CSS Modules
- **Backend**: Express.js, Node.js
- **Bază de Date**: Prisma ORM cu PostgreSQL
- **Autentificare**: JWT tokens
- **Plăți**: Stripe (Checkout)
- **Altele**: Axios pentru API, Multer pentru upload imagini, Nodemailer pentru email-uri

## Funcționalități

### Pentru Utilizatori
- Înregistrare și autentificare
- Căutare și navigare produse după categorii
- Coș de cumpărături (persistent în localStorage)
- Checkout cu Stripe
- Gestionare favorite
- Istoric comenzi
- Confirmare email pentru înregistrare

### Pentru Admin
- Autentificare cu parolă
- Gestionare completă produse (CRUD): adăugare, modificare, ștergere
- Upload imagini multiple pentru produse
- Gestionare categorii și stoc
- Vizualizare comenzi

## Instalare și Setup

### Cerințe
- Node.js 18+
- PostgreSQL
- npm sau yarn

### Pași de Instalare

1. **Clonează repository-ul**:
   ```bash
   git clone <url-repo>
   cd party-shop
   ```

2. **Instalează dependențele**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Configurează baza de date**:
   - Creează o bază de date PostgreSQL
   - Copiază `.env.example` în `.env` și completează variabilele:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/party_shop"
     JWT_SECRET="your-secret-key"
     ADMIN_PASSWORD="admin-password"
     STRIPE_SECRET_KEY="sk_test_..."
     FRONTEND_URL="http://localhost:3000"
     EMAIL_USER="your-email@gmail.com"
     EMAIL_PASS="your-app-password"
     ```

4. **Rulează migrațiile Prisma**:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed  # opțional, pentru date de test
   ```

5. **Pornește serverele**:
   ```bash
   # Backend (port 4000)
   cd backend
   npm run dev

   # Frontend (port 3000) - în alt terminal
   cd frontend
   npm run dev
   ```

6. **Accesează aplicația**:
   - Magazin: http://localhost:3000
   - Admin: http://localhost:3000/admin/login

## Structura Proiectului

```
party-shop/
├── backend/                 # Server Express
│   ├── src/
│   │   ├── routes.js        # Rute API
│   │   ├── calc.js          # Utilitare prețuri
│   │   └── utils/
│   │       ├── mailer.js    # Trimitere email-uri
│   │       └── crypto.js    # Hash parole
│   ├── prisma/
│   │   ├── schema.prisma    # Schema DB
│   │   └── migrations/      # Migrații DB
│   └── uploads/             # Imagini încărcate
├── frontend/                # Aplicație Next.js
│   ├── pages/               # Pagini și API routes
│   ├── components/          # Componente React
│   ├── lib/                 # Utilitare și API client
│   └── styles/              # Stiluri CSS
└── README.md
```

## API Endpoints

### Produse
- `GET /api/products` - Listare produse
- `GET /api/products/slug/:slug` - Produs după slug
- `POST /api/products` (admin) - Creare produs
- `PUT /api/products/:id` (admin) - Update produs
- `DELETE /api/products/:id` (admin) - Ștergere produs

### Utilizatori
- `POST /api/auth/register` - Înregistrare
- `POST /api/auth/login` - Autentificare
- `GET /api/auth/confirm-email` - Confirmare email

### Coș și Comenzi
- `POST /api/cart/validate` - Validare coș
- `POST /api/orders` - Creare comandă
- `GET /api/orders/:id` - Detalii comandă

### Admin
- `POST /api/admin/login` - Login admin
- `POST /api/upload/product-image` - Upload imagine

## Dezvoltare

### Comenzi Utile
```bash
# Backend
npm run dev          # Dezvoltare cu nodemon
npm start            # Producție

# Frontend
npm run dev          # Dezvoltare
npm run build        # Build pentru producție
npm run start        # Producție

# Database
npx prisma studio    # Interfață grafică DB
npx prisma migrate dev  # Migrații
```

### Testare
- Rulează aplicația local și testează fluxurile: înregistrare, adăugare în coș, checkout.
- Pentru plăți Stripe, folosește chei de test.

## Deployment

### Frontend (Vercel)
1. Conectează repo-ul la Vercel
2. Setează variabile de mediu
3. Deploy automat

### Backend (Railway/Render)
1. Conectează repo-ul
2. Setează variabile de mediu (DB, Stripe etc.)
3. Deploy

### Bază de Date
- Pentru producție, folosește PostgreSQL cloud (Neon, Supabase)
- Rulează migrații în producție

## Contribuție

1. Fork repository-ul
2. Creează branch pentru feature
3. Commit schimbări
4. Push și creează PR

## Licență

Acest proiect este pentru uz educațional.

---
// English Verrsion//

# Party Shop - E-commerce Platform for Party Supplies (English Version)

A full-stack project for an online party supplies store, built with Next.js (frontend), Express.js (backend), and Prisma (database).

## Technologies Used

- **Frontend**: Next.js 16, React 18, CSS Modules
- **Backend**: Express.js, Node.js
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: JWT tokens
- **Payments**: Stripe (Checkout)
- **Others**: Axios for API, Multer for image uploads, Nodemailer for emails

## Features

### For Users
- Registration and authentication
- Product search and browsing by categories
- Shopping cart (persistent in localStorage)
- Checkout with Stripe
- Favorites management
- Order history
- Email confirmation for registration

### For Admin
- Password authentication
- Full product management (CRUD): add, edit, delete
- Multiple image uploads for products
- Category and stock management
- Order viewing

## Installation and Setup

### Requirements
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd party-shop
   ```

2. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Configure the database**:
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` and fill in the variables:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/party_shop"
     JWT_SECRET="your-secret-key"
     ADMIN_PASSWORD="admin-password"
     STRIPE_SECRET_KEY="sk_test_..."
     FRONTEND_URL="http://localhost:3000"
     EMAIL_USER="your-email@gmail.com"
     EMAIL_PASS="your-app-password"
     ```

4. **Run Prisma migrations**:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed  # optional, for test data
   ```

5. **Start the servers**:
   ```bash
   # Backend (port 4000)
   cd backend
   npm run dev

   # Frontend (port 3000) - in another terminal
   cd frontend
   npm run dev
   ```

6. **Access the application**:
   - Store: http://localhost:3000
   - Admin: http://localhost:3000/admin/login

## Project Structure

```
party-shop/
├── backend/                 # Express server
│   ├── src/
│   │   ├── routes.js        # API routes
│   │   ├── calc.js          # Price utilities
│   │   └── utils/
│   │       ├── mailer.js    # Email sending
│   │       └── crypto.js    # Password hashing
│   ├── prisma/
│   │   ├── schema.prisma    # DB schema
│   │   └── migrations/      # DB migrations
│   └── uploads/             # Uploaded images
├── frontend/                # Next.js app
│   ├── pages/               # Pages and API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API client
│   └── styles/              # CSS styles
└── README.md
```

## API Endpoints

### Products
- `GET /api/products` - List products
- `GET /api/products/slug/:slug` - Product by slug
- `POST /api/products` (admin) - Create product
- `PUT /api/products/:id` (admin) - Update product
- `DELETE /api/products/:id` (admin) - Delete product

### Users
- `POST /api/auth/register` - Registration
- `POST /api/auth/login` - Authentication
- `GET /api/auth/confirm-email` - Email confirmation

### Cart and Orders
- `POST /api/cart/validate` - Cart validation
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Order details

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/upload/product-image` - Image upload

## Development

### Useful Commands
```bash
# Backend
npm run dev          # Development with nodemon
npm start            # Production

# Frontend
npm run dev          # Development
npm run build        # Build for production
npm run start        # Production

# Database
npx prisma studio    # DB GUI
npx prisma migrate dev  # Migrations
```

### Testing
- Run the app locally and test flows: registration, add to cart, checkout.
- For Stripe payments, use test keys.

## Deployment

### Frontend (Vercel)
1. Connect repo to Vercel
2. Set environment variables
3. Automatic deploy

### Backend (Railway/Render)
1. Connect repo
2. Set environment variables (DB, Stripe, etc.)
3. Deploy

### Database
- For production, use cloud PostgreSQL (Neon, Supabase)
- Run migrations in production

## Contribution

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and create PR

## License

This project is for educational use. 
