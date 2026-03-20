# 🍔 Self-Order Kiosk

A full-featured fast food self-ordering kiosk app with Stripe payments, an admin dashboard, and custom menu management.

**Live Demo:**
- 🛒 Kiosk: https://self-order-kiosk-sigma.vercel.app
- ⚙️ Admin: https://self-order-kiosk-sigma.vercel.app/admin
- 🔌 API: https://backend-rho-gray-28.vercel.app

---

## Features

### 🛒 Kiosk App (`/`)
- Browse menu by category (Burgers, Chicken, Sides, Drinks, Desserts)
- Add items to cart with size selection
- Checkout with Stripe card payment
- Order confirmation with wait time

### 💳 Stripe Payment Integration
- Secure card payment modal with Stripe Card Element
- Test mode — use Stripe test card `4242 4242 4242 4242`
- PaymentIntent flow: create intent → confirm card → confirm order

### ⚙️ Admin Dashboard (`/admin`)
- Password-protected (default: `admin123`)
- **Orders tab:** View all orders, advance status (received → preparing → ready → completed), auto-refreshes every 10s
- **Menu tab:** View all menu items; add/edit/delete custom specials

### 🍽️ Custom Menu Items
- Add custom items via Admin → Menu tab
- Custom items persist to `backend/data/custom-menu.json`
- Merged with default menu on every `GET /api/menu` call

---

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your Stripe secret key
npm install
npm start
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env with your Stripe publishable key and API URL
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_your_key_here` |
| `PORT` | Server port | `3001` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | (same origin) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_your_key_here` |

---

## API Reference

### Public Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/menu` | Get menu (default + custom items merged) |
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders/:id` | Get order status |
| `POST` | `/api/create-payment-intent` | Create Stripe PaymentIntent |
| `POST` | `/api/confirm-order` | Confirm order after payment |

### Admin Endpoints (require `x-admin-token: admin123` header)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/orders` | Get all orders |
| `PATCH` | `/api/admin/orders/:id` | Update order status |
| `GET` | `/api/admin/menu` | Get full menu |
| `POST` | `/api/admin/menu/items` | Add custom menu item |
| `PUT` | `/api/admin/menu/items/:id` | Update custom item |
| `DELETE` | `/api/admin/menu/items/:id` | Delete custom item |

---

## Stripe Test Cards

| Card | Description |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Decline (insufficient funds) |
| `4000 0025 0000 3155` | 3D Secure required |

Use any future expiry date and any 3-digit CVC.

---

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Stripe.js
- **Backend:** Node.js, Express, Stripe SDK
- **Deployment:** Vercel
