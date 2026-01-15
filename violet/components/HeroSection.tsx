import { Button } from "@/components/ui/button";
import { Users, PlusCircle, Sparkles, Repeat } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full px-6 py-16 md:py-24">
      {/* background glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="h-100 w-150 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* text */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Buy Premium Products — <span className="text-primary">Together</span>
          </h1>

          <p className="mt-4 text-muted-foreground text-lg">
            Join group shares, pay only for what you need, and unlock better prices.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button className="hover:scale-105 transition-all duration-300">
              <Link href={`/products?type=share`}>Browse Active Shares</Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-violet-400 hover:scale-105 transition-all duration-300"
            >
              <Link href="/dashboard/create">Start a Share</Link>
            </Button>
          </div>
        </div>

        {/* cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-4">
          <HeroCard
            icon={<PlusCircle />}
            title="Start a Share"
            description="Create a share and split the cost with others."
          />
          <HeroCard
            icon={<Users />}
            title="Join a Share"
            description="Join existing shares and pay less instantly."
          />
          <HeroCard
            icon={<Sparkles />}
            title="Try Before Committing"
            description="Test if the products suites your needs."
          />
          <HeroCard
            icon={<Repeat />}
            title="Resell with Ease"
            description="List unused portions from your shares and reduce your cost."
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
      relative rounded-2xl bg-card p-6
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
    </div>
  );
}
