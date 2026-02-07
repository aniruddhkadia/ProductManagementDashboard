# Product Management Dashboard

A production-ready Product Management Dashboard built for Aptech Solutions. This application provides a comprehensive interface for managing products and viewing business metrics using React, TypeScript, and modern ecosystem tools.

## 🚀 Demo Features

- **Authentication Module**
  - Secure login with JWT using DummyJSON API.
  - State persistence with Zustand.
  - Automatic Token Refresh logic (interceptors).
  - Public/Protected Route Guards.

- **Dashboard Module**
  - Summary Statistics Cards (Total Products, Users, Low Stock).
  - Data Visualizations with Recharts (Category distribution, Price ranges, Ratings).
  - Recent Products preview table.

- **Product Management**
  - Advanced Data Table with server-side pagination.
  - Debounced search and Category filtering.
  - Client-side sorting (Title, Price, Stock, Rating).
  - URL synchronization for filter states.
  - Bulk actions and row-level CRUD operations.
  - Multi-step image upload to Cloudinary.

- **User Management**
  - Read-only user listing with profile detail modal.

- **Settings & UX**
  - Light/Dark/System theme support.
  - Persistent UI settings (Sidebar collapse, Page size).
  - Responsive design for mobile and desktop.

## 🛠 Tech Stack

- **Framework**: [React 18+](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **API Client**: [Axios](https://axios-http.com/)

## 📋 Prerequisites

- Node.js 18 or higher
- npm or pnpm or yarn
- Cloudinary Account (for image uploads)

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd product-management-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory based on `.env.example`:

   ```env
   VITE_API_BASE_URL=https://dummyjson.com
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📖 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI & Layout components
│   ├── dashboard/  # Dashboard specific charts & cards
│   ├── layout/     # Sidebar, Header, MainLayout
│   ├── products/   # Product table, forms, upload
│   └── ui/         # ShadCN primitive components
├── config/         # App constants and configuration
├── hooks/          # Custom React hooks (useDebounce, useTheme)
├── lib/            # Utility functions & API client
├── pages/          # Page components & Route definitions
├── services/       # API service layers
├── stores/         # State management (Zustand)
└── types/          # TypeScript interfaces & types
```

## ⚠️ Notes for Assessment

- **Token Refresh**: During login, `expiresInMins` is set to `1` (inside `login-page.tsx`) to allow quick verification of the refresh flow. The interceptor in `api-client.ts` will automatically call `/auth/refresh` on the first 401 error.
- **Image Upload**: The upload functionality uses Cloudinary. Please ensure valid credentials are provided in `.env` to test this feature.
- **Data Persistence**: User session and dashboard settings are persisted in `localStorage`.

---

_Developed as part of the Senior Frontend Developer Assessment for Aptech Solutions._
