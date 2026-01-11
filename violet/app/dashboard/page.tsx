import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import { Suspense } from "react";
export default async function DashboardPage() {
  return (
    <Suspense fallback={<div className="w-48 h-10 bg-muted animate-pulse rounded" />}>
      <div className="flex justify-between h-10 mb-5 items-center ml-5">
        <SearchBar />
        <Filter />
      </div>
    </Suspense>
  );
}
