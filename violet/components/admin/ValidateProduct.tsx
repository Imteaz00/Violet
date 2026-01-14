"use client";

import { Button } from "../ui/button";
import { toast } from "react-toastify";
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
import validateProduct from "@/actions/validateProduct";

export default function ValidateProduct({ productId }: { productId: string }) {
  async function handleValidate(productId: string) {
    setIsValidating(true);
    try {
      const data = await validateProduct(productId);
      if (data?.error) {
        toast.error(data.error);
        setIsValidating(false);
        return;
      }
      toast.success("Product validated successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to validate product");
      setIsValidating(false);
    }
  }

  const [isValidating, setIsValidating] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" className=" transition-transform duration-300 hover:scale-105">
          Validate
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to validate this product?</AlertDialogTitle>
          <AlertDialogDescription>This will put the product up on list.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleValidate(productId)} disabled={isValidating}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
