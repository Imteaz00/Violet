"use client";
import { District, shippingForm, ShippingFormInputs, UserType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import fetchUserData from "@/actions/fetchUserData";

export default function ShippingForm({
  setShippingForm,
}: {
  setShippingForm: (data: ShippingFormInputs) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingForm),
  });

  const router = useRouter();

  useEffect(() => {
    fetchUserData()
      .then((data) => {
        if (data) {
          setValue("name", data.name || "");
          setValue("email", data.email || "");
          setValue("phone", data.phone || "");
          setValue("address", data.location || "");
          setValue("district", "Dhaka");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [setValue]);

  const handleShippingForm: SubmitHandler<ShippingFormInputs> = (data) => {
    setShippingForm(data);
    router.replace("/bag?step=3", { scroll: false });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleShippingForm)}>
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-foreground font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Jane Doe"
          {...register("name")}
          className="border-b border-muted-foreground py-2 outline-none text-sm"
          autoComplete="off"
        ></input>
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-foreground font-medium">
          Email <span className="text-muted-foreground">(Optional)</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="jane@email.com"
          {...register("email")}
          className="border-b border-muted-foreground py-2 outline-none text-sm"
          autoComplete="off"
        ></input>
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-foreground font-medium">
          Phone
        </label>
        <input
          type="text"
          id="Phone"
          placeholder="011223344"
          {...register("phone")}
          className="border-b border-muted-foreground py-2 outline-none text-sm"
        ></input>
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-foreground font-medium">
          Address
        </label>
        <input
          type="text"
          id="address"
          placeholder="221B Baker Street"
          {...register("address")}
          className="border-b border-muted-foreground py-2 outline-none text-sm"
          autoComplete="off"
        ></input>
        {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
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
        {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
      </div>
      <Button
        type="submit"
        className="w-full duration-300 hover:scale-110 p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight className="w-3 h-3" />
      </Button>
    </form>
  );
}
