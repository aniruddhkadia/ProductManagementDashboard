import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product.types";
import { Badge } from "@/components/ui/badge";

interface RecentProductsProps {
  products: Product[];
}

export function RecentProducts({ products }: RecentProductsProps) {
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Products</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/products">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-10 w-10 rounded object-cover border"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell className="capitalize">{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <Badge
                    variant={product.stock < 10 ? "destructive" : "secondary"}
                  >
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell>{product.rating} / 5</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
