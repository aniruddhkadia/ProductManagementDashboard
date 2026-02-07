import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard, PublicGuard } from "@/components/auth-guard";
import LoginPage from "@/pages/login-page";
import MainLayout from "@/components/layout/main-layout";
import DashboardPage from "@/pages/dashboard-page";
import ProductListPage from "@/pages/products/product-list-page";
import ProductDetailPage from "@/pages/products/product-detail-page";
import ProductFormPage from "@/pages/products/product-form-page";
import UsersPage from "@/pages/users-page";
import SettingsPage from "@/pages/settings-page";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicGuard />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />

            <Route path="/products">
              <Route index element={<ProductListPage />} />
              <Route path=":id" element={<ProductDetailPage />} />
              <Route path="add" element={<ProductFormPage />} />
              <Route path="edit/:id" element={<ProductFormPage />} />
            </Route>

            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
