import ProductInteraction from "@/components/ProductInteraction";
import { formatCurrency } from "@/lib/formaters";
import { ProductType } from "@/types";
import Image from "next/image";

// TEMPORARY
const product: ProductType = {
    id: 1,
    name: "Adidas CoreFit T-Shirt",
    description:
        "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    price: 59.9,
    images: {
        gray: "/products/1g.png",
        purple: "/products/1p.png",
        green: "/products/1gr.png",
    },
    noOfShares: 4,
    remainingShares: 2
};

export const generateMetadata = async ({
    params,
}: {
    params: { id: string };
}) => {
    // TODO:get the product from db
    // TEMPORARY
    return {
        title: product.name,
        description: product.description,
    };
};

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {

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
                <h1 className="text-2xl font-medium">{product.name}</h1>
                <p className="text-muted-foreground">{product.description}</p>
                <p className="text-sm text-muted-foreground">Remaining Shares: {product.remainingShares}/{product.noOfShares}</p>
                <h2 className="text-2xl font-semibold">{formatCurrency(product.price)}</h2>
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
