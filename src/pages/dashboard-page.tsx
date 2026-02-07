import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { userService } from "@/services/user.service";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { DashboardCharts } from "@/components/dashboard/charts";
import { RecentProducts } from "@/components/dashboard/recent-products";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "dashboard"],
    queryFn: () => productService.getAll(100, 0), // Get enough for stats
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", "dashboard"],
    queryFn: () => userService.getAll(1, 0), // Just to get total
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  if (productsLoading || usersLoading || categoriesLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;
  const totalUsers = usersData?.total || 0;
  const categoriesCount = categories?.length || 0;

  // Stats Calculations
  const lowStockItems = products.filter((p) => p.stock < 10).length;
  const averagePrice = (
    products.reduce((acc, p) => acc + p.price, 0) / products.length || 0
  ).toFixed(2);
  const averageRating = (
    products.reduce((acc, p) => acc + p.rating, 0) / products.length || 0
  ).toFixed(2);

  // Chart Data: Products by Category
  const categoryCountMap: Record<string, number> = {};
  products.forEach((p) => {
    categoryCountMap[p.category] = (categoryCountMap[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCountMap)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
    .slice(0, 6); // Limit to top 6 categories for readability

  // Chart Data: Price Range Distribution
  const ranges = [
    { name: "0-500", min: 0, max: 500, value: 0 },
    { name: "500-1000", min: 500, max: 1000, value: 0 },
    { name: "1000-2000", min: 1000, max: 2000, value: 0 },
    { name: "2000+", min: 2000, max: Infinity, value: 0 },
  ];
  products.forEach((p) => {
    const range = ranges.find((r) => p.price >= r.min && p.price < r.max);
    if (range) range.value++;
  });
  const priceRangeData = ranges.map(({ name, value }) => ({ name, value }));

  // Chart Data: Top 10 Rated Products
  const topRatedData = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)
    .map((p) => ({ name: p.title.substring(0, 15) + "...", value: p.rating }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <DashboardStats
        totalProducts={totalProducts}
        totalUsers={totalUsers}
        lowStockItems={lowStockItems}
        averagePrice={averagePrice}
        averageRating={averageRating}
        categoriesCount={categoriesCount}
      />

      <DashboardCharts
        categoryData={categoryData}
        priceRangeData={priceRangeData}
        topRatedData={topRatedData}
      />

      <RecentProducts products={products.slice(0, 5)} />
    </div>
  );
}
