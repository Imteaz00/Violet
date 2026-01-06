import ProductInteraction from "@/components/ProductInteraction";
import { formatCurrency } from "@/lib/formaters";
import { ProductType } from "@/types";
import Image from "next/image";


const fetchProduct = async (id: string) => {
    const res = await fetch(`${process.env.BACKEND_URL}/products/${id}`)
    const data: ProductType = await res.json()
    return data

}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const product = await fetchProduct(id)
    return {
        title: product.title,
        description: product.description,
    };
};

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const product = await fetchProduct(id)

    return (
        <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
            {/* IMAGE */}
            <div className="w-full lg:w-5/12 relative aspect-2/3">
                {/* <Image
                    src={product.images[selectedColor]}
                    alt={product.name}
                    fill
                    className="object-contain rounded-md"
                /> */}
            </div>
            {/* DETAILS */}
            <div className="w-full lg:w-7/12 flex flex-col gap-4">
                <h1 className="text-2xl font-medium">{product.title}</h1>
                <p className="text-muted-foreground">{product.description}</p>
                <p className="text-sm text-muted-foreground">Remaining Shares: {product.remainingShares}/{product.noOfShares}</p>
                <h2 className="text-2xl font-semibold">{formatCurrency(Math.ceil(product.askingPrice / product.noOfShares))}</h2>
                <ProductInteraction
                    product={product}
                />
                {/* CARD INFO */}
                {/* <div className="flex items-center gap-2 mt-4">
                    <Image
                        src="/klarna.png"
                        alt="klarna"
                        width={50}
                        height={25}
                        className="rounded-md"
                    />
                    <Image
                        src="/cards.png"
                        alt="cards"
                        width={50}
                        height={25}
                        className="rounded-md"
                    />
                    <Image
                        src="/stripe.png"
                        alt="stripe"
                        width={50}
                        height={25}
                        className="rounded-md"
                    />
                </div>
                <p className="text-gray-500 text-xs">
                    By clicking Pay Now, you agree to our{" "}
                    <span className="underline hover:text-black">Terms & Conditions</span>{" "}
                    and <span className="underline hover:text-black">Privacy Policy</span>
                    . You authorize us to charge your selected payment method for the
                    total amount shown. All sales are subject to our return and{" "}
                    <span className="underline hover:text-black">Refund Policies</span>.
                </p> */}
            </div>
        </div>
    );
};
