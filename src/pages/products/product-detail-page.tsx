import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  ArrowLeft,
  Pencil,
  Trash2,
  Star,
  StarHalf,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mainImage, setMainImage] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(parseInt(id!)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => productService.delete(parseInt(id!)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successful");
      navigate("/products");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  const currentMainImage = mainImage || product.thumbnail;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < 10) return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "secondary" as const };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/products/edit/${product.id}`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this product?")) {
                deleteMutation.mutate();
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden border bg-white flex items-center justify-center">
            <img
              src={currentMainImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[product.thumbnail, ...product.images]
              .slice(0, 5)
              .map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    currentMainImage === img
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/50"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge className="capitalize">{product.category}</Badge>
            <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
          </div>

          <div className="space-y-2">
            <div className="text-4xl font-bold">${product.price}</div>
            {product.discountPercentage > 0 && (
              <p className="text-sm text-green-600 font-medium">
                {product.discountPercentage}% OFF
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-muted-foreground">
              ({product.rating} / 5.0)
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Card className="bg-muted/50 border-none">
            <CardContent className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Brand
                </p>
                <p className="font-medium">{product.brand}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Stock
                </p>
                <p className="font-medium">{product.stock} units</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
