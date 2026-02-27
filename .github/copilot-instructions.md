# Party Shop – AI Coding Agent Instructions

## Project Overview
**Party Shop** is a full-stack e-commerce application for selling party supplies. It uses:
- **Frontend**: Next.js 16 + React 18 (port 3000)
- **Backend**: Express.js (port 4000) with JSON file-based data storage
- **Architecture**: Client-side cart persistence (localStorage) + backend validation + role-based admin interface

---

## Critical Architecture Patterns

### 1. **Data Validation Layer**
The backend **validates cart contents** before checkout. Clients submit cart items `[{id, qty}, ...]` to `POST /api/cart/validate`, which:
- Checks product existence in `backend/src/products.json`
- Enforces minimum qty of 1
- Returns validated items with priceCents and totalCents (in EUR cents)
- Returns errors list if products are missing

**Key files**: `backend/src/routes.js` (validation logic), `backend/src/calc.js` (Euro formatting), `frontend/lib/api.js` (client wrapper)

### 2. **Cart State Management**
Cart lives in **React Context** (`CartContext` in `frontend/pages/_app.js`):
- Loaded from `localStorage` on app mount (client-side only check: `typeof window !== "undefined"`)
- Persisted to `localStorage` on every change
- Minimal structure: `{id, qty}` pairs only
- Cart page (`frontend/pages/cart.js`) validates before display using backend endpoint

### 3. **Admin Authentication**
Simple token-based auth (stateless):
- Login at `POST /api/admin/login` (hardcoded password check in backend—not yet implemented)
- Token stored in `localStorage` (frontend) / `sessionStorage` (admin login page)
- Passed as `Authorization` header in product CRUD calls
- `AdminGuard` component wraps protected pages; redirects to login if no token

**Key files**: `frontend/lib/auth.js` (AdminContext), `frontend/components/AdminGuard.js` (route protection)

### 4. **Product Management (Admin)**
Full CRUD operations in `frontend/pages/admin/products.js`:
- Schema: `{id, name, priceCents, image, stock, description}`
- API functions in `frontend/lib/api.js`: `adminGetProducts`, `adminCreateProduct`, `adminUpdateProduct`, `adminDeleteProduct`
- All calls require `Authorization` header with token
- **Note**: Backend admin routes not yet shown in provided files—implement matching endpoints in `backend/src/routes.js`

---

## Development Workflows

### **Running Both Servers**
```powershell
# Terminal 1 – Backend (port 4000)
cd backend
npm install  # if needed
npm run dev  # uses nodemon

# Terminal 2 – Frontend (port 3000)
cd frontend
npm install  # if needed
npm run dev
```
Visit `http://localhost:3000` for the storefront, `http://localhost:3000/admin/login` for admin.

### **Building for Production**
```powershell
# Frontend
cd frontend
npm run build
npm run start  # starts Next.js production server

# Backend
cd backend
npm start  # runs server.js
```

---

## Project-Specific Conventions

### **Pricing in EUR Cents**
All prices are stored/transmitted as **cents** (`priceCents`):
- Product `priceCents: 499` = €4.99
- Use `formatEuro(cents)` from `backend/src/calc.js` to convert for display
- Frontend display: `€${(priceCents / 100).toFixed(2)}`

### **JSON File-Based Storage**
Data files are JSON:
- `backend/src/products.json` – product catalog (array of objects)
- `backend/src/orders.json` – likely for order tracking (not yet detailed)

**When modifying data**: Always read from disk with `readProducts()`, modify, write back. No in-memory database.

### **CORS & API Configuration**
- Backend CORS is open: `origin: "*"` in `server.js`
- Frontend API base: `http://localhost:4000/api`
- All product/cart endpoints go to `/api/products`, `/api/cart/validate`, `/api/admin/*`

### **ES Modules**
Both backend and frontend use ES modules (`import`/`export`):
- Backend: `"type": "module"` in `package.json`; requires `__dirname` fix: `const __dirname = path.dirname(fileURLToPath(import.meta.url))`
- Frontend: Next.js handles this automatically

---

## Key Files Reference

| Path | Purpose |
|------|---------|
| `backend/server.js` | Express app, CORS, static image serving |
| `backend/src/routes.js` | Product list, cart validation endpoints |
| `backend/src/products.json` | Product catalog |
| `backend/src/calc.js` | `formatEuro()` utility |
| `frontend/lib/api.js` | Axios-based API client (products, cart, admin CRUD) |
| `frontend/lib/auth.js` | `AdminContext` & token management |
| `frontend/pages/_app.js` | `CartContext`, cart CRUD logic, localStorage sync |
| `frontend/pages/cart.js` | Cart display & validation |
| `frontend/pages/admin/login.js` | Admin password login |
| `frontend/pages/admin/products.js` | Product management interface |

---

## Common Tasks

### **Add a New Product Endpoint**
1. Define handler in `backend/src/routes.js` (e.g., `router.post("/products", ...)`)
2. Read/write to `backend/src/products.json` using `readProducts()` and `fs.writeFileSync()`
3. Add corresponding API function in `frontend/lib/api.js`
4. Call from React component via Context or direct API call

### **Protect an Admin Route**
1. Wrap component with `AdminGuard` (e.g., `<AdminGuard><AdminProducts /></AdminGuard>`)
2. Pass token in `Authorization` header for backend calls
3. Backend validates token (implement if missing)

### **Modify Cart Logic**
1. Update context actions in `frontend/pages/_app.js` (`addToCart`, `updateQty`, `removeFromCart`)
2. Validation logic stays in backend `POST /api/cart/validate`
3. Frontend validates by calling `validateCart()` from `lib/api.js`

---

## Known Gaps / To-Implement

- Backend admin authentication (`/api/admin/login`) – currently commented in frontend code
- Backend admin product CRUD endpoints – API calls exist but backend routes not shown
- Order tracking & admin orders page (`/admin/orders`)
- Image upload for products – currently expects existing images in `backend/public/images/`

---

## Testing Notes

- **No automated tests** in project (add Jest/Vitest if needed)
- Test login with placeholder admin password
- Test cart validation by adding products with invalid IDs
- Test localStorage persistence by clearing cookies and reloading
