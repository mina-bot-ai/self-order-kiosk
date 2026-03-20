# 🍔 QuickBite — Fast Food Self-Ordering Kiosk

A touchscreen-optimized self-ordering kiosk web app built with React + Vite (frontend) and Node.js + Express (backend).

![Kiosk Screenshot](https://placehold.co/800x400/1a1a2e/ff6b35?text=QuickBite+Kiosk)

## ✨ Features

- **Welcome Screen** — Animated "Touch to Start" landing page
- **Menu Browsing** — Category tabs (Burgers, Sides, Drinks, Desserts) with item grid
- **Item Detail Modal** — Size selector, quantity picker, add to cart
- **Cart Sidebar** — Slide-in cart with item management, subtotal
- **Checkout Page** — Full order summary with tax calculation
- **Order Confirmation** — Order number, estimated wait time, auto-reset
- Designed for **touchscreens** — large tap targets, smooth animations, dark theme

## 🏗️ Project Structure

```
self-order-kiosk/
├── backend/
│   ├── data/
│   │   └── menu.json          # Menu data (categories + items)
│   ├── routes/
│   │   ├── menu.js            # GET /api/menu
│   │   └── orders.js          # POST /api/orders, GET /api/orders/:id
│   ├── server.js              # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CartSidebar.jsx    # Slide-in cart panel
│   │   │   ├── ItemModal.jsx      # Item detail / size / qty modal
│   │   │   └── MenuGrid.jsx       # Menu item cards grid
│   │   ├── context/
│   │   │   └── CartContext.jsx    # Global cart state (useReducer)
│   │   ├── data/
│   │   │   └── menuFallback.js    # Offline fallback menu data
│   │   ├── pages/
│   │   │   ├── CheckoutPage.jsx   # Order summary + pay button
│   │   │   ├── ConfirmationPage.jsx # Order placed screen
│   │   │   ├── MenuPage.jsx       # Main menu browsing page
│   │   │   └── WelcomeScreen.jsx  # "Touch to Start" screen
│   │   ├── App.jsx                # Screen router
│   │   ├── index.css              # Tailwind + custom styles
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js             # Dev proxy: /api → localhost:3001
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Run the Backend

```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

For development with auto-reload:
```bash
npm run dev
```

### 4. Run the Frontend

```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:3001`, so both can run simultaneously.

### 5. Open in Browser

Navigate to **http://localhost:5173** and tap "Touch to Start"!

> **Note:** The frontend includes offline fallback menu data, so it works even without the backend running. Orders will still simulate successfully in offline mode.

## 🌐 API Reference

### `GET /api/menu`
Returns all menu categories and items.

**Response:**
```json
{
  "categories": [
    {
      "id": "burgers",
      "name": "Burgers",
      "icon": "🍔",
      "items": [
        {
          "id": "b1",
          "name": "Classic Burger",
          "price": 5.99,
          "sizes": ["Regular", "Large"],
          "sizePrices": [0, 1.5],
          ...
        }
      ]
    }
  ]
}
```

### `POST /api/orders`
Create a new order.

**Request body:**
```json
{
  "items": [
    { "id": "b1", "name": "Classic Burger", "size": "Regular", "quantity": 2, "price": 5.99 }
  ],
  "total": 12.93
}
```

**Response:**
```json
{
  "orderNumber": "#1001",
  "waitTime": 8,
  "status": "received",
  "createdAt": "2024-01-15T12:00:00.000Z"
}
```

### `GET /api/orders/:id`
Get order status by order number.

**Response:**
```json
{
  "id": "#1001",
  "items": [...],
  "total": 12.93,
  "status": "preparing",
  "waitTime": 8,
  "createdAt": "2024-01-15T12:00:00.000Z"
}
```

## 🍔 Sample Menu

| Category | Items |
|----------|-------|
| 🍔 Burgers | Classic Burger $5.99, Cheese Burger $6.99, Bacon Burger $7.99, Veggie Burger $6.49 |
| 🍟 Sides | French Fries $2.99, Onion Rings $3.49, Coleslaw $1.99 |
| 🥤 Drinks | Cola $1.99, Lemonade $2.49, Water $0.99, Milkshake $3.99 |
| 🍦 Desserts | Ice Cream $2.49, Apple Pie $1.99, Cookies $1.49 |

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite 5, TailwindCSS 3 |
| Backend | Node.js, Express 4 |
| State | React Context + useReducer |
| Styling | TailwindCSS + custom CSS |
| Images | placehold.co placeholder images |
| Data | In-memory (orders) + JSON (menu) |

## 📱 Kiosk Deployment Tips

- Run in kiosk/fullscreen mode: `chromium --kiosk http://localhost:5173`
- Disable screen sleep on the kiosk device
- Use `npm run build` + `npm run preview` for production serving
- Consider nginx as a reverse proxy for production

## 📄 License

MIT
