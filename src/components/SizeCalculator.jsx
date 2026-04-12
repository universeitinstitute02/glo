"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler } from 'lucide-react';







export default function SizeCalculator({ isOpen, onClose }) {
  const [underbust, setUnderbust] = useState('');
  const [bust, setBust] = useState('');
  const [result, setResult] = useState(null);

  const calculateSize = () => {
    const u = parseFloat(underbust);
    const b = parseFloat(bust);

    if (isNaN(u) || isNaN(b)) return;

    // Simplified calculation for demonstration
    // Standard logic: Band size = underbust + 4 or 5 (to make it even)
    // Cup size = bust - band size
    let bandSize = Math.round(u);
    if (bandSize % 2 !== 0) bandSize += 1;

    const diff = b - bandSize;
    const cups = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F'];
    const cupIndex = Math.floor(diff);
    const cup = cups[cupIndex] || (diff > 7 ? 'G+' : 'AA');

    setResult(`${bandSize}${cup}`);
  };

  return (
    <AnimatePresence>
      {isOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
          <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl">
          
            <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
            
              <X className="h-6 w-6" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink text-brand-rose">
                <Ruler className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-semibold">Find Your Size</h2>
                <p className="text-sm text-slate-500">Enter your measurements in inches</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Underbust Measurement
                </label>
                <input
                type="number"
                value={underbust}
                onChange={(e) => setUnderbust(e.target.value)}
                placeholder="e.g., 30"
                className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 outline-none ring-brand-rose/20 transition-all focus:border-brand-rose focus:ring-4" />
              
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Bust Measurement
                </label>
                <input
                type="number"
                value={bust}
                onChange={(e) => setBust(e.target.value)}
                placeholder="e.g., 34"
                className="w-full rounded-xl border-slate-200 bg-slate-50 p-3 outline-none ring-brand-rose/20 transition-all focus:border-brand-rose focus:ring-4" />
              
              </div>

              <button
              onClick={calculateSize}
              className="w-full rounded-xl bg-brand-rose py-4 font-semibold text-white shadow-lg shadow-brand-rose/20 transition-all hover:bg-rose-500 active:scale-95">
              
                Calculate My Size
              </button>

              {result &&
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 rounded-2xl bg-brand-pink p-6 text-center">
              
                  <p className="text-sm uppercase tracking-widest text-brand-rose">Your Recommended Size</p>
                  <p className="text-5xl font-serif font-bold text-brand-rose">{result}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    *This is a guide. Fit may vary by style and fabric.
                  </p>
                </motion.div>
            }
            </div>
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}