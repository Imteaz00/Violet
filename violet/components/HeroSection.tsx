import { Button } from "@/components/ui/button";
import { Users, PlusCircle, Sparkles, Repeat } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "./SearchBar";

export function HeroSection() {
  return (
    <section className="relative w-full px-6 py-8 md:py-16">
      {/* background glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="h-100 w-150 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* text */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            Buy Premium Products — <span className="text-primary">Together</span>
          </h1>

          <p className="mt-4 text-muted-foreground text-sm md:text-lg">
            Join group shares, pay only for what you need, and unlock better prices.
          </p>

          <div className="mt-8 flex justify-center gap-4 mb-6">
            <Button asChild className="hover:scale-105 transition-all duration-300">
              <Link href={`/products?type=share`}>Browse Products</Link>
            </Button>
            <Button
              variant="secondary"
              className="text-violet-400 hover:scale-105 transition-all duration-300"
            >
              <Link href="/dashboard/create">Resell or Share</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <Suspense fallback={<div className="w-48 h-10 bg-muted animate-pulse rounded" />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        {/* cards */}
        <div className="mt-10 grid gap-6 grid-cols-2 md:grid-cols-4">
          <HeroCard
            icon={<Repeat />}
            title="Resell"
            description="List unused portions of your products and reduce your cost."
            link="/dashboard/create"
          />
          <HeroCard
            icon={<PlusCircle />}
            title="Start a Share"
            description="Create a share and split the cost with others."
            link="/dashboard/create"
          />
          <HeroCard
            icon={<Users />}
            title="Join a Share"
            description="Join existing shares and pay less instantly."
            link="/products?type=share"
          />
          <HeroCard
            icon={<Sparkles />}
            title="WishList"
            description="Create wishlists for products you want to buy"
            link="/"
          />
        </div>
      </div>
    </section>
  );
}

function HeroCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="
      relative rounded-2xl bg-card p-2 md:p-6
      shadow-lg shadow-violet-500/20
      transition-all duration-300
      hover:-translate-y-1 hover:shadow-violet-500/30
    "
    >
      {/* glow */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-violet-600/10 blur-xl" />

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
