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
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }
  const results = await Promise.all(
    bag.map(async (item) => {
      const res = await fetch(`${BACKEND_URL}/connections/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      return item.title;
    })
  );
  return results;
}
