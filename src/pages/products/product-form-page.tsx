import { useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { productSchema, type ProductSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { ImageUpload } from "@/components/products/image-upload";
import { toast } from "sonner";
import type { Category } from "@/types/product.types";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(parseInt(id!)),
    enabled: isEdit,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discountPercentage: 0,
      stock: 0,
      brand: "",
      category: "",
      thumbnail: "",
      images: [],
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        description: product.description,
        price: product.price,
        discountPercentage: product.discountPercentage || 0,
        stock: product.stock,
        brand: product.brand,
        category: product.category,
        thumbnail: product.thumbnail,
        images: product.images || [],
      });
    }
  }, [product, form]);

  const mutation = useMutation({
    mutationFn: (data: ProductSchema) =>
      isEdit
        ? productService.update(parseInt(id!), data)
        : productService.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Product ${isEdit ? "updated" : "added"} successfully`);
      navigate("/products");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: ProductSchema) => {
    mutation.mutate(data);
  };

  if (isEdit && productLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="iPhone 15 Pro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Apple" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="capitalize">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed product description..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          label="Thumbnail Image (Required)"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          label="Product Gallery"
                          value={field.value}
                          onChange={field.onChange}
                          multiple
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isEdit ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
