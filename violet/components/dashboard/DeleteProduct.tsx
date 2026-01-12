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

export default function DeleteProduct({ productId }: { productId: string }) {
  async function handleDelete(productId: string) {
    setIsDeleting(true);
    const data = await deleteProduct(productId);
    toast.success("Product deleted successfully!");
    window.location.reload();
    setIsDeleting(false);
  }
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger>
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
