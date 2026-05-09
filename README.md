# Herd Shop Frontend

A modern, high-performance e-commerce frontend built with React, Vite, and TailwindCSS.

## 🌟 Features

- **Premium UI/UX:** Built with Framer Motion for smooth transitions and a high-end feel.
- **Dynamic Catalog:** Advanced product filtering, search, and categorization.
- **Journal/Blog:** Fully integrated reading experience with categories, likes, and comments.
- **Security Dashboard:** User settings for password changes and 2FA management with modal-based flows.
- **State Management:** Powered by Redux Toolkit for consistent data flow across the app.
- **Responsive Design:** Optimized for mobile, tablet, and desktop experiences.

## 🛠 Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** Redux Toolkit
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router 6

## 📁 Project Structure

```text
src/
├── api/            # API services and axios configuration
├── assets/         # Images, fonts, and static files
├── components/     # Reusable UI components (Button, Modal, Input, etc.)
├── features/       # Redux slices and feature-specific logic (auth, cart, products)
├── hooks/          # Custom React hooks
├── layouts/        # Layout wrappers (MainLayout, AdminLayout)
├── pages/          # Page-level components
├── store/          # Redux store configuration
└── utils/          # Helper functions and constants
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 💡 How It Works

1. **Data Fetching:** All external data is handled through the `src/api` layer, which communicates with the Laravel backend.
2. **Global State:** The `cart`, `auth`, and `settings` are managed via Redux, ensuring that user actions (like adding to cart) are reflected instantly across all pages.
3. **Authentication:** Uses JWT/Sanctum tokens stored securely. Protected routes handle authorization for the user dashboard and admin area.
4. **Theme & Styling:** Uses a centralized `tailwind.config.js` for consistent branding, colors, and typography.

---
© 2026 Herd Shop. Premium Lifestyle & Journal.
