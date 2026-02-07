import { useTheme } from "@/components/theme-provider";
import { useSettingsStore } from "@/stores/settings-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const {
    tableDensity,
    setTableDensity,
    pageSize,
    setPageSize,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useSettingsStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <div className="grid gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the dashboard looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select your interface theme.
                </p>
              </div>
              <Select value={theme} onValueChange={(val: any) => setTheme(val)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display & Data</CardTitle>
            <CardDescription>
              Control how tables and data are presented.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Table Density</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust the spacing in data tables.
                </p>
              </div>
              <Select
                value={tableDensity}
                onValueChange={(val: any) => setTableDensity(val)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Default Page Size</Label>
                <p className="text-sm text-muted-foreground">
                  Number of items to show per page.
                </p>
              </div>
              <Select
                value={pageSize.toString()}
                onValueChange={(val) => setPageSize(parseInt(val))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 items</SelectItem>
                  <SelectItem value="20">20 items</SelectItem>
                  <SelectItem value="50">50 items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sidebar Sidebar</Label>
                <p className="text-sm text-muted-foreground">
                  Start with the sidebar collapsed.
                </p>
              </div>
              <Switch
                checked={sidebarCollapsed}
                onCheckedChange={setSidebarCollapsed}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
