"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function Sort() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex items-center justify-end text-sm my-6 gap-2">
      <Select onValueChange={handleFilter} defaultValue="newest">
        <SelectTrigger className="md:w-40 rounded-md ring-1 ring-secondary focus:ring-1">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>

        <SelectContent className="rounded-md">
          <SelectGroup>
            <SelectLabel>Sort By</SelectLabel>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="asc">Price: Low to High</SelectItem>
            <SelectItem value="desc">Price: High to Low</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
