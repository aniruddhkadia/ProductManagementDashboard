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
        sidebarCollapsed ? "w-16 tablet:w-64" : "w-64 tablet:w-16",
      )}
    >
      <div className="flex h-14 items-center justify-between px-3 border-b">
        <span
          className={cn(
            "font-bold text-lg truncate",
            sidebarCollapsed ? "hidden tablet:block" : "block tablet:hidden",
          )}
        >
          Admin Panel
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto shrink-0"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 tablet:rotate-180" />
          ) : (
            <ChevronLeft className="h-4 w-4 tablet:rotate-180" />
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
                  end={item.href === "/"}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
                      isActive
                        ? " bg-blue-600 text-white hover:bg-blue-400 hover:text-white font-medium shadow-sm "
                        : " text-muted-foreground hover:bg-blue-400 hover:text-white ",
                      sidebarCollapsed && "justify-center px-0",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-all duration-200",
                          isActive ? "opacity-100" : "opacity-0",
                          sidebarCollapsed && "h-8",
                        )}
                      />
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform duration-200",
                          isActive ? "scale-110" : "group-hover:scale-110",
                        )}
                      />
                      <span
                        className={cn(
                          "truncate",
                          sidebarCollapsed
                            ? "hidden tablet:block"
                            : "block tablet:hidden",
                        )}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              </TooltipTrigger>
              <span className="tablet:hidden">
                {sidebarCollapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </span>
              <span className="hidden tablet:block">
                {!sidebarCollapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </span>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
