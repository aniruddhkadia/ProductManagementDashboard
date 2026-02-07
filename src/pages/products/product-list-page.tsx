import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { ProductTable } from "@/components/products/product-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Trash2, RotateCcw } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import type { Product, Category } from "@/types/product.types";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Extraction of params
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const limitValue = parseInt(searchParams.get("limit") || "10");

  const debouncedSearch = useDebounce(search, 300);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Queries
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", page, debouncedSearch, category, limitValue],
    queryFn: async () => {
      const skip = (page - 1) * limitValue;
      if (debouncedSearch) {
        return productService.search(debouncedSearch, limitValue, skip);
      }
      if (category !== "all") {
        return productService.getByCategory(category, limitValue, skip);
      }
      return productService.getAll(limitValue, skip);
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      return Promise.all(ids.map((id) => productService.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedIds([]);
      toast.success("Selected products deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete some products");
    },
  });

  // Helpers
  const handleParamChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "all" || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    // Always reset to page 1 on search/filter changes
    if (key !== "page") newParams.delete("page");
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Memoized sorted products
  const sortedProducts = useMemo(() => {
    if (!productsData?.products) return [];
    if (!sortConfig) return productsData.products;

    return [...productsData.products].sort((a: Product, b: Product) => {
      const valA = (a as any)[sortConfig.key];
      const valB = (b as any)[sortConfig.key];
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [productsData, sortConfig]);

  const totalPages = Math.ceil((productsData?.total || 0) / limitValue);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button onClick={() => navigate("/products/add")}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-row flex-wrap gap-2 items-center flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleParamChange("search", e.target.value)
              }
            />
          </div>

          <Select
            value={category}
            onValueChange={(val: string) => handleParamChange("category", val)}
          >
            <SelectTrigger className="w-full sm:w-48 capitalize">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat: Category) => (
                <SelectItem
                  key={cat.slug}
                  value={cat.slug}
                  className="capitalize"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || category !== "all") && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          )}
        </div>

        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => {
              if (
                confirm(
                  `Are you sure you want to delete ${selectedIds.length} products?`,
                )
              ) {
                bulkDeleteMutation.mutate(selectedIds);
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Bulk Delete (
            {selectedIds.length})
          </Button>
        )}
      </div>

      <ProductTable
        products={sortedProducts}
        isLoading={isLoading}
        onView={(p) => navigate(`/products/${p.id}`)}
        onEdit={(p) => navigate(`/products/edit/${p.id}`)}
        onDelete={(p) => {
          if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
            deleteMutation.mutate(p.id);
          }
        }}
        onSort={handleSort}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
      />

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
        <div className="text-sm text-muted-foreground font-medium">
          Showing {(page - 1) * limitValue + 1} to{" "}
          {Math.min(page * limitValue, productsData?.total || 0)} of{" "}
          {productsData?.total || 0} entries
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={limitValue.toString()}
            onValueChange={(val: string) => handleParamChange("limit", val)}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => handleParamChange("page", (page - 1).toString())}
            >
              Previous
            </Button>
            <div className="flex gap-1 px-4 items-center font-medium text-sm">
              Page {page} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handleParamChange("page", (page + 1).toString())}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
