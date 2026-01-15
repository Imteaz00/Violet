import { HeroSection } from "@/components/HeroSection";
import ProductList from "@/components/ProductList";

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) {
  const category = (await searchParams).category;
  return (
    <div>
      <HeroSection />
      <ProductList category={category} params="homepage" />
    </div>
  );
}
