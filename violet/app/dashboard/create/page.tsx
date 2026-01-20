"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType, createProductForm, CreateProductType, District } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { createProduct } from "@/actions/createProduct";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { XIcon } from "lucide-react";
import { fetchCategories } from "@/actions/fetchCategories";

export default function CreateProductPage() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateProductType>({
    resolver: zodResolver(createProductForm),
    defaultValues: {
      type: "share",
      district: District.Dhaka,
    },
  });
  const [formData, setFormData] = useState<CreateProductType>();
  const [categories, setCategories] = useState<CategoryType[]>();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const imageUrls = useMemo(() => {
    return images.map((img) => URL.createObjectURL(img));
  }, [images]);

  useEffect(() => {
    fetchCategories()
      .then((categories) => setCategories(categories))
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      toast.error("You can only add up to 5 images");
      return;
    }

    // Validate each file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    const validFiles: File[] = [];

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 5MB limit`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      setImages([...images, ...validFiles]);
    }

    e.target.value = "";
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleForm: SubmitHandler<CreateProductType> = (data) => {
    if (images.length === 0) {
      toast.error("Please upload at least 1 product image");
      return;
    }
    setFormData(data);
  };

  const handleFinalSubmit = async () => {
    if (!formData) return;
    setIsSubmitting(true);
    try {
      await createProduct(formData, images);
      toast.success("Product created successfully!");
      router.push("/dashboard/myProducts");
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-card rounded-lg p-6 max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold">Add your Item</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Fill in the details below to list your item for sale or sharing.
      </p>

      <form onSubmit={handleSubmit(handleForm)} className="space-y-8">
        {/* TITLE + BOUGHT FROM */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 ">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Title</label>
            <input
              {...register("title")}
              placeholder="Jane Doe"
              className="w-full h-10 border-b border-muted-foreground bg-transparent text-sm outline-none focus:border-primary transition-colors"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Bought From</label>
            <input
              {...register("boughtFrom")}
              placeholder="Very famous store"
              className="w-full h-10 border-b border-muted-foreground bg-transparent text-sm outline-none focus:border-primary transition-colors"
            />
            {errors.boughtFrom && (
              <p className="text-xs text-destructive">{errors.boughtFrom.message}</p>
            )}
          </div>
        </div>

        {/* PRICE + EXPIRY + CATEGORY */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Asking Price</label>
            <div className="flex items-center gap-2 h-10 border-b border-muted-foreground">
              <input
                type="number"
                {...register("askingPrice", { valueAsNumber: true })}
                className="w-full bg-transparent text-sm outline-none appearance-none"
              />
              <span className="text-sm text-muted-foreground">TK</span>
            </div>
            {errors.askingPrice && (
              <p className="text-xs text-destructive">{errors.askingPrice.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Expiry Date</label>
            <input
              type="date"
              {...register("expiryDate")}
              className="w-full h-10 border-b border-muted-foreground bg-transparent text-sm outline-none"
            />
            {errors.expiryDate && (
              <p className="text-xs text-destructive">{errors.expiryDate.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="focus:border-primary transition-colors px-5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Description</label>
          <input
            {...register("description")}
            placeholder="This product is great for..."
            className="w-full h-10 border-b border-muted-foreground bg-transparent text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* SELLING REASON + SHARES */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Selling Reason</label>
            <input
              {...register("sellingReason")}
              placeholder="I don't like the smell"
              className="w-full h-10 border-b border-muted-foreground bg-transparent text-sm outline-none focus:border-primary transition-colors"
            />
            {errors.sellingReason && (
              <p className="text-xs text-destructive">{errors.sellingReason.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">
              Number of Shares{" "}
              <span className="text-sm text-muted-foreground">(1 if up for sell)</span>
            </label>
            <input
              disabled={watch("type") === "sell"}
              type="number"
              defaultValue={1}
              {...register("noOfShares", { valueAsNumber: true })}
              className={`w-full h-10 border-b border-muted-foreground bg-transparent text-sm outline-none focus:border-primary transition-colors ${
                watch("type") === "sell" ? "text-muted-foreground" : ""
              }`}
            />
            {errors.noOfShares && (
              <p className="text-xs text-destructive">{errors.noOfShares.message}</p>
            )}
          </div>
        </div>

        {/* TYPE + DISTRICT + QUANTITY */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Select Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-10 border-b border-muted-foreground p-4">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sell">Sell</SelectItem>
                    <SelectItem value="share">Share</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">District</label>
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="p-4 focus:border-primary transition-colors">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(District).map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.district && (
              <p className="text-xs text-destructive">{errors.district.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Quantity</label>
            <input
              {...register("quantity")}
              placeholder="100ml or 19 pieces"
              className="w-full h-10 border-b border-muted-foreground bg-transparent text-sm outline-none focus:border-primary transition-colors"
            />
            {errors.quantity && (
              <p className="text-xs text-destructive">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">
            Location <span className="text-sm text-muted-foreground">(optional)</span>
          </label>
          <input
            {...register("location")}
            placeholder="221B Baker Street"
            className="w-full h-10 border-b border-muted-foreground bg-transparent text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
        </div>

        {/* CONDITION */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Product Condition</label>
          <input
            {...register("condition")}
            placeholder="Barely used or barely usable"
            className="w-full h-10 border-b border-muted-foreground bg-transparent text-sm outline-none focus:border-primary transition-colors"
          />
          {errors.condition && (
            <p className="text-xs text-destructive">{errors.condition.message}</p>
          )}
        </div>

        {/* IMAGES */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-medium">
              Product Images{" "}
              <span className="text-sm text-muted-foreground">(max 5 images, max 5MB each)</span>
            </label>
            <div className="mt-2">
              <input
                name="productImages"
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageAdd}
                disabled={images.length >= 5}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground rounded-lg cursor-pointer transition-colors ${
                  images.length >= 5
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary hover:bg-accent/50"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-2 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Click to upload</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5 images</p>
                </div>
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {images.length === 0 && <span className="text-destructive">*required</span>}
            </p>
          </div>

          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full transition-transform duration-300 pl-10 pr-10 hover:scale-105"
              type="submit"
            >
              Next
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {Object.keys(errors).length > 0 || images.length === 0
                  ? "Warning"
                  : "Confirm Your Submission"}
              </DialogTitle>
              <DialogDescription>
                {Object.keys(errors).length > 0 || images.length === 0 ? (
                  "All required fields are not filled"
                ) : (
                  <div className="gap-2">
                    <p>
                      Title:{" "}
                      <span className="font-medium text-primary-foreground">{formData?.title}</span>
                    </p>
                    <p>
                      Bought From:{" "}
                      <span className="font-medium text-primary-foreground">
                        {formData?.boughtFrom}
                      </span>
                    </p>
                    <p>
                      Asking Price:{" "}
                      <span className="font-medium text-primary-foreground">
                        {formData?.askingPrice}
                      </span>
                    </p>
                    <p>
                      Expiry Date:{" "}
                      <span className="font-medium text-primary-foreground">
                        {formData?.expiryDate}
                      </span>
                    </p>
                    <p>
                      Category:{" "}
                      <span className="font-medium text-primary-foreground">
                        {formData?.category}
                      </span>
                    </p>
                    <p>
                      Description:{" "}
                      <span className="font-medium text-primary-foreground">
                        {formData?.description}
                      </span>
                    </p>
                    {formData?.sellingReason && (
                      <p>
                        {" "}
                        Selling Reason:{" "}
                        <span className="font-medium text-primary-foreground">
                          {formData?.sellingReason}
                        </span>
                      </p>
                    )}
                    <p>
                      Number of Shares:{" "}
                      <span className="font-medium text-primary-foreground">
                        {formData?.noOfShares}
                      </span>
                    </p>
                    <p>
                      Type:{" "}
                      <span className="font-medium text-primary-foreground">{formData?.type}</span>
                    </p>
                    <p>
                      District:{" "}
                      <span className="font-medium text-primary-foreground">
                        {formData?.district}
                      </span>
                    </p>
                    <p>
                      Quantity:{" "}
                      <span className="font-medium text-primary-foreground">
                        {formData?.quantity}
                      </span>
                    </p>
                    {formData?.location && (
                      <p>
                        Location:{" "}
                        <span className="font-medium text-primary-foreground">
                          {formData?.location}
                        </span>
                      </p>
                    )}
                    <p>
                      Condition:{" "}
                      <span className="font-medium text-primary-foreground">
                        {formData?.condition}
                      </span>
                    </p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            {!(Object.keys(errors).length > 0 || images.length === 0) && (
              <Button
                className="transition-transform duration-300 pl-10 pr-10 hover:scale-105 w-full"
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Confirm & Submit"}
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
}
