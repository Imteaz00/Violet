"use server";

import { BACKEND_URL } from "@/server";
import { BagItemType, ShippingFormInputs } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function submitOrder({
  shippingForm,
  payment,
  bag,
}: {
  shippingForm: ShippingFormInputs;
  payment: { method: string; transactionId?: string };
  bag: BagItemType[];
}) {
  const success: string[] = [];
  bag.forEach(async (item) => {
    try {
      const res = await fetch(`${BACKEND_URL}/connections/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.id,
          noOfShares: item.shares,
          name: shippingForm.name,
          email: shippingForm.email,
          phone: shippingForm.phone,
          address: shippingForm.address,
          district: shippingForm.district,
          paymentMethod: payment.method,
          transactionId: payment.transactionId || null,
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to create connection: ${res.status} ${res.statusText}`);
      }
      success.push(item.title);
    } catch (error) {
      throw new Error("An unexpected error occurred while submitting the order.", { cause: error });
    }
  });
  return success;
}
