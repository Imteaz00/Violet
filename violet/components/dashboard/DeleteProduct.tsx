"use client";

import { Button } from "../ui/button";
import { toast } from "react-toastify";
import deleteProduct from "@/actions/deleteProduct";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function DeleteProduct({ productId }: { productId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  async function handleDelete(productId: string) {
    setIsDeleting(true);
    try {
      const data = await deleteProduct(productId);
      if (data?.error) {
        toast.error(data.error);
        setIsDeleting(false);
        return;
      }
      toast.success("Product deleted successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete product");
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className=" transition-transform duration-300 hover:scale-105"
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to delete this product?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your product.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(productId)} disabled={isDeleting}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
