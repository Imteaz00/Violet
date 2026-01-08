import ProductInteraction from "@/components/ProductInteraction";
import { formatCurrency } from "@/lib/formaters";
import { ProductType } from "@/types";
import Image from "next/image";

const fetchProduct = async (id: string) => {
  const res = await fetch(`${process.env.BACKEND_URL}/products/${id}`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }
  const data: ProductType = await res.json();
  return data;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await fetchProduct(id);
    return {
      title: product.title,
      description: product.description,
    };
  } catch (error) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
      <div className="w-full lg:w-5/12 relative aspect-2/3">
        {/* <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-contain rounded-md"
                /> */}
      </div>
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.title}</h1>
        <p className="text-muted-foreground">{product.description}</p>
        <p className="text-sm text-muted-foreground">
          Remaining Shares:{" "}
          <span className="text-accent-foreground text-lg">{product.remainingShares}</span> /
          {product.noOfShares}
        </p>
        <h2 className="text-2xl font-semibold">
          {formatCurrency(
            product.noOfShares > 0
              ? Math.ceil(product.askingPrice / product.noOfShares)
              : product.askingPrice
          )}
        </h2>
        <ProductInteraction product={product} />
      </div>
    </div>
  );
}
