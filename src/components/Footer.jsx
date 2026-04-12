
import { ShieldCheck, Truck, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-pink bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-brand-rose">AURA</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Empowering confidence through elegant, high-quality intimate apparel. 
              Designed for the modern woman in Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Shop</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-rose">All Products</a></li>
                <li><a href="#" className="hover:text-brand-rose">New Arrivals</a></li>
                <li><a href="#" className="hover:text-brand-rose">Best Sellers</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Support</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-rose">Size Guide</a></li>
                <li><a href="#" className="hover:text-brand-rose">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-brand-rose">Returns & Exchanges</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Privacy</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-rose">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-rose">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-brand-pink pt-8 sm:grid-cols-3">
          <div className="flex items-center gap-3 text-slate-600">
            <ShieldCheck className="h-6 w-6 text-brand-rose" />
            <span className="text-sm font-medium">Discrete Packaging</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Truck className="h-6 w-6 text-brand-rose" />
            <span className="text-sm font-medium">Fast Delivery (BD Wide)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Lock className="h-6 w-6 text-brand-rose" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Aura Intimates. All rights reserved.
        </div>
      </div>
    </footer>);

}