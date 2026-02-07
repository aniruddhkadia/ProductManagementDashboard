import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settings-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Products", icon: Package, href: "/products" },
  { label: "Users", icon: Users, href: "/users" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-card transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center justify-between px-3 border-b">
        {!sidebarCollapsed && (
          <span className="font-bold text-lg truncate">Admin Panel</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto shrink-0"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {NAV_ITEMS.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex d-flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                      sidebarCollapsed && "justify-center px-0",
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </NavLink>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
