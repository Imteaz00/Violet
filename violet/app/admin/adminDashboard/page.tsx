'use client';

import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

const res = await fetch("http://localhost:8000/api")
const data = await res.json()
console.log(data)


export default function AdminDashboard() {
  return (
    <main className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-pink-500">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of platform activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value="1,248" icon={<Users />} />
          <StatCard title="Active Groups" value="86" icon={<Package />} />
          <StatCard title="Total Orders" value="432" icon={<ShoppingBag />} />
          <StatCard title="Revenue" value="$12,340" icon={<DollarSign />} />
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard title="Manage Users" description="View, ban or verify users." />
          <AdminCard title="Manage Products" description="Approve or remove product listings." />
          <AdminCard title="Group Purchases" description="Monitor active group buys." />
          <AdminCard title="Reports & Analytics" description="View platform performance." />
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-1 text-black">{value}</p>
      </div>
      <div className="text-pink-500">{icon}</div>
    </div>
  );
}

function AdminCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md hover:bg-gray-200 transition cursor-pointer">
      <h3 className="font-semibold text-lg mb-1 text-pink-500">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
