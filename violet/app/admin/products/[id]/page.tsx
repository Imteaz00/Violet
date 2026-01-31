import { formatCurrency } from "@/lib/formatters";
import { ProductType } from "@/types";
import { notFound } from "next/navigation";
import { formatDate } from "../../../../lib/formatters";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/ui/table";
import DeleteProduct from "@/components/dashboard/DeleteProduct";
import ValidateProduct from "@/components/admin/ValidateProduct";
import { STATUS, PRICING } from "@/constants";
import MessageUser from "@/components/admin/MessageUser";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import fetchAdminProductsById from "@/actions/fetchAdminProductById";
import calculatePrice from "@/lib/calculatePrice";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: ProductType;
  try {
    product = await fetchAdminProductsById(id);
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-6 bg-card rounded-lg p-6 shadow-lg">
      <div className="w-full lg:w-5/12 flex flex-col items-center justify-center">
        {product.productImages?.length > 0 ? (
          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {product.productImages.map((image, index) => (
                <CarouselItem key={image.id}>
                  <div className="relative w-full aspect-square">
                    <Image
                      src={image.url}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-contain rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6" />
            <CarouselNext className="-right-6" />
          </Carousel>
        ) : (
          <>No Image found</>
        )}
      </div>
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.title}</h1>
        <p className="text-muted-foreground">{product.description}</p>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-center">Seller</TableCell>
              <TableCell className="text-center">{product.user.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Seller Email</TableCell>
              <TableCell className="text-center">{product.user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Seller Phone</TableCell>
              <TableCell className="text-center">{product.user.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Shares</TableCell>
              <TableCell className="text-center">{product.noOfShares}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Quantity</TableCell>
              <TableCell className="text-center">{product.quantity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Remaining Shares</TableCell>
              <TableCell className="text-center">{product.remainingShares}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Asking Price</TableCell>
              <TableCell className="text-center">{formatCurrency(product.askingPrice)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Price per Share</TableCell>
              <TableCell className="text-center">
                {formatCurrency(calculatePrice(product.askingPrice, product.noOfShares))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">District</TableCell>
              <TableCell className="text-center">{product.district}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Location</TableCell>
              <TableCell className="text-center">{product.location}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Created At</TableCell>
              <TableCell className="text-center">
                {formatDate(new Date(product.createdAt))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Expiry Date</TableCell>
              <TableCell className="text-center">
                {formatDate(new Date(product.expiryDate))}
              </TableCell>
            </TableRow>{" "}
            <TableRow>
              <TableCell className="text-center">Bought From</TableCell>
              <TableCell className="text-center">{product.boughtFrom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Condition</TableCell>
              <TableCell className="text-center">{product.condition}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Selling Reason</TableCell>
              <TableCell className="text-center">{product.sellingReason}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Type</TableCell>
              <TableCell className="text-center">{product.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center">Status</TableCell>
              <TableCell className="text-center">{product.status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {product.status === STATUS.VALIDATING && <ValidateProduct productId={product.id} />}
        <MessageUser user={product.user} />
        <DeleteProduct productId={product.id} />
      </div>
    </div>
  );
}
