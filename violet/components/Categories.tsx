"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { CONSTANT } from "@/constants";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/actions/fetchCategories";
import { CategoryType } from "@/types";
import { Skeleton } from "./ui/skeleton";

export default function Categories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const selectedCategory = searchParams.get(CONSTANT.CATEGORY);
  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set(CONSTANT.CATEGORY, value || "all");
    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };
  useEffect(() => {
    let mounted = true;

    fetchCategories()
      .then((data) => {
        if (!mounted) return;
        setCategories([
          {
            name: "All",
            slug: "all",
          },
          ...(data ?? []),
        ]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const renderSkeletons = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 rounded-lg text-sm bg-muted mb-4 mt-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-6 rounded-md" />
      ))}
    </div>
  );

  return isLoading ? (
    renderSkeletons()
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 rounded-lg text-sm bg-muted mb-4 mt-2">
      {categories.map((category) => (
        <Button
          className="flex h-6 items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md"
          key={category.slug}
          variant={(selectedCategory ?? "all") === category.slug ? "default" : "link"}
          onClick={() => handleChange(category.slug)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
