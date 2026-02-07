import {
  Package,
  Users,
  AlertTriangle,
  DollarSign,
  Star,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  className?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  totalProducts: number;
  totalUsers: number;
  lowStockItems: number;
  averagePrice: string;
  averageRating: string;
  categoriesCount: number;
}

export function DashboardStats({
  totalProducts,
  totalUsers,
  lowStockItems,
  averagePrice,
  averageRating,
  categoriesCount,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Products"
        value={totalProducts}
        icon={Package}
        description="Total items in catalog"
      />
      <StatCard
        title="Total Users"
        value={totalUsers}
        icon={Users}
        description="Registered customers"
      />
      <StatCard
        title="Low Stock Items"
        value={lowStockItems}
        icon={AlertTriangle}
        className={lowStockItems > 0 ? "border-amber-500/50" : ""}
        description="Stock count < 10"
      />
      <StatCard
        title="Average Price"
        value={`$${averagePrice}`}
        icon={DollarSign}
        description="Across all products"
      />
      <StatCard
        title="Average Rating"
        value={averageRating}
        icon={Star}
        description="Customer satisfaction"
      />
      <StatCard
        title="Categories"
        value={categoriesCount}
        icon={Layers}
        description="Product categories"
      />
    </div>
  );
}
