import { shippingForm, ShippingFormInputs } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShippingForm({
  setShippingForm,
}: {
  setShippingForm: (data: ShippingFormInputs) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingForm),
  });

  const router = useRouter();

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
        <label htmlFor="district" className="text-foreground font-medium">
          District
        </label>
        <input
          type="text"
          id="district"
          placeholder="Bogura"
          {...register("district")}
          className="border-b border-muted-foreground py-2 outline-none text-sm"
          autoComplete="off"
        ></input>
        {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
      </div>
      <Button
        type="submit"
        className="w-full duration-300 hover:scale-110 hover:text-accent-foreground p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight className="w-3 h-3" />
      </Button>
    </form>
  );
}
