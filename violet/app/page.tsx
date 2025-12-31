import { ShoppingBag, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { JSX } from 'react';

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Buy Beauty Together</h1>
          <p className="text-lg md:text-xl mb-6">
            Share cosmetic purchases, save money, and reduce waste.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-xl shadow">Get Started</button>
            <button className="border border-white px-6 py-3 rounded-xl">Browse Groups</button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <Feature
              icon={<ShoppingBag />}
              title="Create or Join a Group"
              description="Start a group purchase or join others buying the same product."
            />
            <Feature
              icon={<Users />}
              title="Split the Cost"
              description="Pay only for the portion you need. No waste, no overspending."
            />
            <Feature
              icon={<ShieldCheck />}
              title="Secure & Trusted"
              description="Payments are protected and users are verified."
            />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Popular Group Buys</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow p-5">
                <div className="h-40 bg-gray-200 rounded mb-4" />
                <h3 className="font-semibold text-lg">Luxury Serum Set</h3>
                <p className="text-sm text-gray-600 mt-2">4 / 6 spots filled</p>
                <button className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg">
                  Join Group
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-pink-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Start Sharing Today</h2>
        <p className="mb-6">Join thousands who save money and reduce beauty waste.</p>
        <button className="bg-white text-pink-600 px-8 py-3 rounded-xl font-semibold">
          Create an Account
        </button>
      </section>
    </main>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-6 bg-gray-50 rounded-xl">
      <div className="flex justify-center text-pink-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
