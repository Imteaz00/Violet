'use client';

import { Search, Filter } from 'lucide-react';
import { JSX } from 'react';

const items = [
	{
		id: 1,
		name: 'Luxury Face Serum',
		brand: 'GlowLab',
		price: '$24 / share',
		image: 'https://via.placeholder.com/300x200',
	},
	{
		id: 2,
		name: 'Vitamin C Cleanser',
		brand: 'PureSkin',
		price: '$18 / share',
		image: 'https://via.placeholder.com/300x200',
	},
	{
		id: 3,
		name: 'Hydrating Night Cream',
		brand: 'Lumière',
		price: '$30 / share',
		image: 'https://via.placeholder.com/300x200',
	},
];

export default function BrowsePage():JSX.Element {
	return (
		<main className="flex-1 bg-gray-50 px-6 py-10">
			{/* Header */}
			<div className="max-w-7xl mx-auto mb-8">
				<h1 className="text-2xl font-bold mb-2 text-pink-500">Browse Items</h1>
				<p className="text-gray-600">Discover and join shared beauty purchases</p>
			</div>

			{/* Search & Filters */}
			<div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						placeholder="Search products or brands"
						className="w-full pl-10 pr-4 py-2 border rounded-lg border-pink-500 focus:ring-2 focus:ring-pink-500 placeholder-gray-400 text-gray-600"
					/>
				</div>
				{/* <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
					<Filter className="w-4 h-4" />
					Filters
				</button> */}
			</div>

			{/* Product Grid */}
			<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{items.map((item) => (
					<div key={item.id} className="bg-white rounded-xl shadow hover:shadow-md transition hover:bg-gray-200">
						<img
							src={item.image}
							alt={item.name}
							className="w-full h-48 object-cover rounded-t-xl text-black"
						/>
						<div className="p-4">
							<h3 className="font-semibold text-lg text-black">{item.name}</h3>
							<p className="text-sm text-gray-500">{item.brand}</p>
							<p className="mt-2 font-medium text-pink-600">{item.price}</p>
							<button className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600">
								View Group
							</button>
						</div>
					</div>
				))}
			</div>
		</main>
	);
}
