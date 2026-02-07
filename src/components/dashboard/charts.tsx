import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

interface DashboardChartsProps {
  categoryData: { name: string; value: number }[];
  priceRangeData: { name: string; value: number }[];
  topRatedData: { name: string; value: number }[];
}

export function DashboardCharts({
  categoryData,
  priceRangeData,
  topRatedData,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
      {/* Products by Category */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Products by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top 10 Rated Products */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Top 10 Rated Products</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topRatedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis dataKey="name" type="category" width={100} fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price Range Distribution */}
      <Card className="lg:col-span-7">
        <CardHeader>
          <CardTitle>Price Range Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={priceRangeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
