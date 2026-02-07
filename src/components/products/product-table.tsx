import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, Eye, ArrowUpDown } from "lucide-react";
import type { Product } from "@/types/product.types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onSort: (column: string) => void;
  selectedIds: number[];
  onSelectChange: (ids: number[]) => void;
}

export function ProductTable({
  products,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onSort,
  selectedIds,
  onSelectChange,
}: ProductTableProps) {
  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      onSelectChange([]);
    } else {
      onSelectChange(products.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onSelectChange([...selectedIds, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 w-full animate-pulse bg-muted rounded-md"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  products.length > 0 && selectedIds.length === products.length
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Thumbnail</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="-ml-4 h-8"
                onClick={() => onSort("title")}
              >
                Title <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="-ml-4 h-8"
                onClick={() => onSort("price")}
              >
                Price <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="-ml-4 h-8"
                onClick={() => onSort("stock")}
              >
                Stock <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="-ml-4 h-8"
                onClick={() => onSort("rating")}
              >
                Rating <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow
                key={product.id}
                className={
                  selectedIds.includes(product.id) ? "bg-muted/50" : ""
                }
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => toggleSelectOne(product.id)}
                  />
                </TableCell>
                <TableCell>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-10 w-10 rounded object-cover border"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell className="capitalize">{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <Badge
                    variant={product.stock < 10 ? "destructive" : "secondary"}
                  >
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(product)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(product)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
