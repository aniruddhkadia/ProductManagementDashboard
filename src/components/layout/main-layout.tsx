import { Outlet } from "react-router-dom";
import Header from "./header";
import { Sidebar } from "./sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export default function MainLayout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex h-screen overflow-hidden bg-background w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
