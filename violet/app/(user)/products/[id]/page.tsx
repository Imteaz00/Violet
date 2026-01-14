import ProductInteraction from "@/components/ProductInteraction";
import { formatCurrency } from "@/lib/formaters";
import { BACKEND_URL } from "@/server";
import { ProductType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "../../../../lib/formaters";

const fetchProduct = async (id: string) => {
  const res = await fetch(`${BACKEND_URL}/products/${id}`, {
    next: { revalidate: 120 },
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
  let product: ProductType;
  try {
    product = await fetchProduct(id);
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-6 bg-card rounded-lg p-6 shadow-lg">
      <div className="w-full lg:w-5/12 relative aspect-2/3">
        {/* <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-contain rounded-md"
                /> */}
      </div>
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-medium">{product.title}</h1>
          <p className="text-muted-foreground text-sm">
            Category:{" "}
            <Link href={`/products?category=${product.category}`} className="underline">
              {product.category}
            </Link>
          </p>
        </div>
        <p className="text-muted-foreground">{product.description}</p>
        <p className="text-sm text-muted-foreground">
          Remaining Shares:{" "}
          <span className="text-accent-foreground text-lg">{product.remainingShares}</span> /
          {product.noOfShares}
        </p>
        <p className="text-muted-foreground text-sm">Quantity: {product.quantity} (whole)</p>
        <h2 className="text-2xl font-semibold">
          {formatCurrency(
            product.noOfShares > 0
              ? Math.ceil(product.askingPrice / product.noOfShares)
              : product.askingPrice
          )}{" "}
          <span className="text-sm font-normal text-muted-foreground"> per share</span>
        </h2>
        <ProductInteraction product={product} />
        <div className="text-sm text-muted-foreground">
          <p>Location: {product.district}</p>
          <p>Condition: {product.condition}</p>
          <p>Date of Expiration: {formatDate(new Date(product.expiryDate))}</p>
        </div>
      </div>
    </div>
  );
}
