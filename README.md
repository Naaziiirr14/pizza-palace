# 🍕 Pizza Palace — Full Stack MERN Application

> A production-ready online pizza ordering platform built on the MERN stack.

---

## 📁 Project Structure

```
pizza-palace/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → Business logic (auth, pizza, order, payment)
│   ├── middleware/     → JWT auth, isAdmin, error handler
│   ├── models/         → Mongoose schemas (User, Pizza, Order, Payment)
│   ├── routes/         → Express route definitions
│   ├── seed/           → Database seeder script
│   ├── server.js       → Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/ → Navbar, Footer, PizzaCard, Skeletons, AdminLayout
    │   ├── context/    → AuthContext, CartContext
    │   ├── pages/      → Home, Menu, Detail, Login, Register
    │   │   ├── customer/  → Cart, Checkout, OrderHistory, Profile
    │   │   └── admin/     → Dashboard, Pizzas, Orders, Users, Payments
    │   ├── services/   → Axios API instance
    │   ├── App.jsx     → Routes
    │   └── main.jsx    → Entry point
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Razorpay test account (free)

---

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/pizza-palace.git
cd pizza-palace

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

### 2. Backend Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/pizza-palace
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster → Connect → Connect your application
3. Copy the connection string, replace `<password>`

**Get Razorpay Keys:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Settings → API Keys → Generate Test Key
3. Copy Key ID and Key Secret

---

### 3. Frontend Environment Variables

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
```

---

### 4. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- 1 Admin user
- 5 Customer users
- 15 Pizzas
- 10 Orders
- 10 Payments

**Login credentials after seeding:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pizzapalace.com | Admin@123 |
| Customer | rahul@test.com | Test@123 |

---

### 5. Run the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → App running on http://localhost:5173
```

---

### 6. Test Razorpay Payment

Use these test card details:
- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date (e.g. 12/26)
- **CVV:** Any 3 digits (e.g. 123)
- **Name:** Any name
- **OTP:** 1234 (if prompted)

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new customer |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/profile` | Bearer | Get current user profile |
| PUT | `/api/auth/profile` | Bearer | Update name / password |

### Pizzas
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/pizzas` | Public | List all available pizzas |
| GET | `/api/pizzas/:id` | Public | Get pizza by ID |
| POST | `/api/pizzas` | Admin | Create pizza |
| PUT | `/api/pizzas/:id` | Admin | Update pizza |
| DELETE | `/api/pizzas/:id` | Admin | Delete pizza |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Bearer | Place new order |
| GET | `/api/orders/my` | Bearer | My order history |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| DELETE | `/api/orders/:id` | Bearer | Cancel order |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payment/create-order` | Bearer | Create Razorpay order |
| POST | `/api/payment/verify-payment` | Bearer | Verify payment signature |
| GET | `/api/payment/all` | Admin | All payment records |

---

## ☁️ Deployment

### Backend → Render

1. Push `backend/` folder to GitHub
2. Go to [Render.com](https://render.com) → New → Web Service
3. Connect your repo
4. Configure:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables (same as `.env`)
6. Deploy — Render gives you a URL like `https://pizza-palace-api.onrender.com`

### Frontend → Vercel

1. Push `frontend/` folder to GitHub
2. Go to [Vercel.com](https://vercel.com) → New Project
3. Import repo
4. Add environment variables:
   ```
   VITE_API_URL=https://pizza-palace-api.onrender.com/api
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
   ```
5. Deploy — Vercel gives you a URL like `https://pizza-palace.vercel.app`

### Update CORS on Backend

After deploying frontend, update your Render env var:
```
CLIENT_URL=https://pizza-palace.vercel.app
```

---

## 🔐 Security Notes

- Passwords hashed with bcryptjs (salt rounds: 12)
- JWT tokens expire in 24 hours
- Admin routes protected by `isAdmin` middleware
- Helmet.js sets security HTTP headers
- CORS restricted to frontend origin
- Rate limiting: 100 requests per 15 minutes
- Environment variables never committed to Git

---

## 🧪 Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## 📱 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@pizzapalace.com | Admin@123 |
| 🛒 Customer | rahul@test.com | Test@123 |
| 🛒 Customer | priya@test.com | Test@123 |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Animations | Framer Motion |
| Notifications | React Toastify |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Payment | Razorpay (Test Mode) |
| Hosting | Vercel (FE) + Render (BE) |

---

Built with ❤️ · MERN Stack · Pizza Palace © 2025
