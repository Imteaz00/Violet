import Link from "next/link";

export default function Footer() {
  return (
    <div className="mt-16 flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-0 md:justify-between bg-secondary p-8 rounded-lg">
      <div className="flex flex-col gap-4 items-center md:items-start">
        <Link href="/" className="flex items-center">
          <p className="text-2xl text-primary font-semibold tracking-wider font-serif">
            {" "}
            {/* hidden md:block */}
            VIOLET
          </p>
        </Link>
        {/* <p className="text-sm text-secondary-foreground">2025 Violet</p>
                <p className="text-sm text-secondary-foreground">All rights reserved.</p> */}
      </div>
      <div className="flex flex-col gap-4 text-sm text-secondary-foreground items-center md:items-start">
        <p className="text-sm text-muted-foreground">Links</p>
        <Link href="/">Homepage</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/">Terms of Services</Link>
        <Link href="/">Privacy Policy</Link>
      </div>
      <div className="flex flex-col gap-4 text-sm text-secondary-foreground items-center md:items-start">
        <p className="text-sm text-muted-foreground">Products</p>
        <Link href="/products">All Products</Link>
        <Link href="/">New Arrivals</Link>
        <Link href="/">Best Sellers</Link>
        <Link href="/">Sale</Link>
      </div>
      <div className="flex flex-col gap-4 text-sm text-secondary-foreground items-center md:items-start">
        <p className="text-sm text-muted-foreground">Company</p>
        <Link href="/">About</Link>
        <Link href="/">Contact</Link>
        <Link href="/">Blog</Link>
        <Link href="/">Affiliate Program</Link>
      </div>
    </div>
  );
}
