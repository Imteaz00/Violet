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

export default function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex items-center justify-end text-sm my-6 gap-2">
      <Select onValueChange={handleFilter} defaultValue="all">
        <SelectTrigger className="md:w-40 rounded-md ring-1 ring-secondary focus:ring-1">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>

        <SelectContent className="rounded-md">
          <SelectGroup>
            <SelectLabel>Filter</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
            <SelectItem value="share">Share</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
