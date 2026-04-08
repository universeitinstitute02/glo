"use client";

import { motion } from 'motion/react';
import { ArrowRight, Ruler, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/constants';
import ProductCard from '@/components/ProductCard';
import { useState } from 'react';
import SizeCalculator from '@/components/SizeCalculator';

export default function Home() {
  const [isSizeCalcOpen, setIsSizeCalcOpen] = useState(false);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-brand-pink">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/lingerie-hero/1920/1080?blur=4"
            alt="Hero"
            className="h-full w-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-pink via-brand-pink/40 to-transparent" />
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-serif font-bold leading-tight tracking-tight text-slate-900 sm:text-7xl">
                Elegance in <br />
                <span className="text-brand-rose italic">Every Layer</span>
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-slate-600">
                Discover our curated collection of premium intimate apparel. 
                Designed for comfort, crafted for confidence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="flex items-center gap-2 rounded-full bg-brand-rose px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-brand-rose/20 transition-all hover:bg-rose-500 hover:scale-105 active:scale-95"
              >
                Shop Collection <ArrowRight className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setIsSizeCalcOpen(true)}
                className="flex items-center gap-2 rounded-full border-2 border-brand-rose bg-white/50 px-8 py-4 text-lg font-semibold text-brand-rose backdrop-blur-md transition-all hover:bg-white hover:scale-105 active:scale-95"
              >
                Find Your Size <Ruler className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 rounded-3xl bg-white p-8 shadow-sm sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink text-brand-rose">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Discrete Packaging</h4>
              <p className="text-xs text-slate-500">Your privacy is our priority</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink text-brand-rose">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Fast Delivery</h4>
              <p className="text-xs text-slate-500">Across all districts in BD</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink text-brand-rose">
              <Ruler className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Perfect Fit</h4>
              <p className="text-xs text-slate-500">Interactive size calculator</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-serif font-bold text-slate-900">Shop by Category</h2>
          <p className="mt-2 text-slate-500 italic">Find the perfect piece for every mood</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {['Bras', 'Panties', 'Nightwear', 'Sets'].map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100"
            >
              <img
                src={`https://picsum.photos/seed/${cat.toLowerCase()}/800/1000`}
                alt={cat}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-serif font-bold text-white">{cat}</h3>
                <Link
                  href={`/shop?category=${cat}`}
                  className="mt-2 flex items-center gap-2 text-sm font-semibold text-brand-pink transition-colors hover:text-white"
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-serif font-bold text-slate-900">Trending Now</h2>
            <p className="mt-2 text-slate-500 italic">Our most loved pieces this season</p>
          </div>
          <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-brand-rose hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <SizeCalculator isOpen={isSizeCalcOpen} onClose={() => setIsSizeCalcOpen(false)} />
    </div>
  );
}
