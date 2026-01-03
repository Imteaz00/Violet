'use client';

import Link from 'next/link';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { useState } from 'react';
import Form from 'next/form'

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white border-b">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-pink-500" />
                    <span className="font-bold text-black text-lg">ShareBeauty</span>
                </Link>

                {/* Search Bar (Desktop) */}
                {/* <div className="hidden md:flex max-w-md ml-auto">
					<Form action="/" className="relative w-full">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search products, brands..."
							className="w-full pl-10 pr-4 py-2 border border-pink-500 rounded-lg placeholder-gray-400 text-gray-600"
						/>
					</Form>
				</div> */}

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/browse" className="hover:text-pink-500 text-gray-500">Explore</Link>
                    <Link href="/how-it-works" className="hover:text-pink-500 text-gray-500">How it Works</Link>
                    <Link href="/login" className="hover:text-pink-500 text-gray-500">Login</Link>
                    <Link
                        href="/signup"
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                    >
                        Sign Up
                    </Link>
                    <button>hi</button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X /> : <Menu className='text-pink500' />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden border-t bg-white px-6 py-4 space-y-4">
                    {/* Mobile Search */}
                    {/* <div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search products..."
							className="w-full pl-10 pr-4 py-2 border rounded-lg placeholder-gray-400 text-gray-600 border-pink-500"
						/>
					</div> */}

                    <Link href="/explore" className="block text-gray-500">Explore</Link>
                    <Link href="/how-it-works" className="block text-gray-500">How it Works</Link>
                    <Link href="/login" className="block text-gray-500">Login</Link>
                    <Link
                        href="/signup"
                        className="block text-center bg-pink-500 text-white py-2 rounded-lg"
                    >
                        Sign Up
                    </Link>
                </div>
            )}
        </header>
    );
}
