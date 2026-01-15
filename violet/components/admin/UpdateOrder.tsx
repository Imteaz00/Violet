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
import updateOrder from "@/actions/updateOrder";
import { OrderType } from "@/types";
import { STATUS } from "@/constants";
import { Input } from "../ui/input";

export default function UpdateOrder({ order }: { order: OrderType }) {
  const [id, setId] = useState("");
  async function handleValidate(orderId: string) {
    setIsValidating(true);
    try {
      const data = await updateOrder(orderId);
      if (data?.error) {
        toast.error(data.error);
        setIsValidating(false);
        return;
      }
      toast.success("Order updated successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update order");
      setIsValidating(false);
    }
  }

  const [isValidating, setIsValidating] = useState(false);
  let newStatus;
  switch (order.status) {
    case STATUS.AWAITING:
      newStatus = STATUS.PENDING;
      break;
    case STATUS.PENDING:
      newStatus = STATUS.DELIVERING;
      break;
    case STATUS.DELIVERING:
      newStatus = STATUS.CONFIRMING;
      break;
    case STATUS.CONFIRMING:
      newStatus = STATUS.DONE;
      break;
    default:
      newStatus = STATUS.PENDING;
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" className=" transition-transform duration-300 hover:scale-105">
          Update
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to update this order?</AlertDialogTitle>
          <AlertDialogDescription>
            {order.status} to {newStatus}
            <div>
              Transaction Id: {order.transactionId}
              <Input
                placeholder="paste transaction id here"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              {id === order.transactionId ? (
                <span className="text-green-500">Matched</span>
              ) : (
                <span className="text-red-500">Not Matched</span>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleValidate(order.id)} disabled={isValidating}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
