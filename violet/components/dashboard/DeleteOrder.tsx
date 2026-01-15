"use client";

import { Button } from "../ui/button";
import { toast } from "react-toastify";
import deleteOrder from "@/actions/deleteOrder";
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

export default function DeleteOrder({ orderId }: { orderId: string }) {
  async function handleDelete(orderId: string) {
    setIsDeleting(true);
    try {
      const data = await deleteOrder(orderId);
      if (data?.error) {
        toast.error(data.error);
        setIsDeleting(false);
        return;
      }
      toast.success("Order deleted successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete order");
      setIsDeleting(false);
    }
  }

  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className=" transition-transform duration-300 hover:scale-105"
        >
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to cancel this order?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(orderId)} disabled={isDeleting}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
