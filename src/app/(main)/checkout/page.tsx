"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, CreditCard, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

const DISTRICTS = [
  { name: 'Dhaka', shipping: 60 },
  { name: 'Chittagong', shipping: 120 },
  { name: 'Sylhet', shipping: 120 },
  { name: 'Rajshahi', shipping: 120 },
  { name: 'Khulna', shipping: 120 },
  { name: 'Barisal', shipping: 120 },
  { name: 'Rangpur', shipping: 120 },
  { name: 'Mymensingh', shipping: 120 },
];

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, loginWithGoogle } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    district: 'Dhaka',
    area: '',
    address: '',
    paymentMethod: 'COD' as 'COD' | 'Online'
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const shippingCost = DISTRICTS.find(d => d.name === formData.district)?.shipping || 120;
  const discountAmount = (totalPrice * appliedDiscount) / 100;
  const grandTotal = totalPrice + shippingCost - discountAmount;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'AURA10') {
      setAppliedDiscount(10);
    } else if (code === 'WELCOME20') {
      setAppliedDiscount(20);
    } else {
      setCouponError('Invalid coupon code');
      setAppliedDiscount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await loginWithGoogle();
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          images: item.images
        })),
        total: grandTotal,
        status: 'pending',
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          district: formData.district,
          area: formData.area,
          address: formData.address
        },
        paymentMethod: formData.paymentMethod,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderSuccess(docRef.id);
      clearCart();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-6 px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-slate-900">Order Placed Successfully!</h2>
          <p className="text-slate-500">Your order ID is <span className="font-bold text-slate-900">#{orderSuccess}</span></p>
          <p className="text-sm text-slate-400 italic">We've sent a confirmation email to your inbox.</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => router.push('/account')}
            className="rounded-full bg-brand-rose px-8 py-4 font-bold text-white shadow-lg shadow-brand-rose/20 transition-all hover:bg-rose-500 hover:scale-105 active:scale-95"
          >
            Track My Order
          </button>
          <button
            onClick={() => router.push('/')}
            className="rounded-full border-2 border-brand-rose px-8 py-4 font-bold text-brand-rose transition-all hover:bg-brand-pink hover:scale-105 active:scale-95"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push('/cart')}
        className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-brand-rose"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </button>

      <h1 className="mb-12 text-4xl font-serif font-bold text-slate-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Shipping Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
              <Truck className="h-6 w-6 text-brand-rose" /> Shipping Details
            </h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-slate-700">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 outline-none ring-brand-rose/20 transition-all focus:border-brand-rose focus:ring-4"
                  placeholder="e.g., Nusrat Jahan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-slate-700">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 outline-none ring-brand-rose/20 transition-all focus:border-brand-rose focus:ring-4"
                  placeholder="e.g., 017XXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-slate-700">District</label>
                <select
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: e.target.value})}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 outline-none ring-brand-rose/20 transition-all focus:border-brand-rose focus:ring-4"
                >
                  {DISTRICTS.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-slate-700">Area / Thana</label>
                <input
                  required
                  type="text"
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 outline-none ring-brand-rose/20 transition-all focus:border-brand-rose focus:ring-4"
                  placeholder="e.g., Dhanmondi"
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-slate-700">Full Address</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 outline-none ring-brand-rose/20 transition-all focus:border-brand-rose focus:ring-4"
                  placeholder="House #, Road #, Flat #"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-brand-rose" /> Payment Method
            </h2>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'COD'})}
                className={cn(
                  "flex items-center justify-between rounded-2xl border-2 p-6 transition-all",
                  formData.paymentMethod === 'COD' 
                    ? "border-brand-rose bg-brand-pink/30" 
                    : "border-slate-100 hover:border-brand-rose"
                )}
              >
                <div className="text-left">
                  <p className="font-bold text-slate-900">Cash on Delivery</p>
                  <p className="text-xs text-slate-500">Pay when you receive</p>
                </div>
                <div className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center",
                  formData.paymentMethod === 'COD' ? "border-brand-rose bg-brand-rose" : "border-slate-200"
                )}>
                  {formData.paymentMethod === 'COD' && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'Online'})}
                className={cn(
                  "flex items-center justify-between rounded-2xl border-2 p-6 transition-all",
                  formData.paymentMethod === 'Online' 
                    ? "border-brand-rose bg-brand-pink/30" 
                    : "border-slate-100 hover:border-brand-rose"
                )}
              >
                <div className="text-left">
                  <p className="font-bold text-slate-900">Online Payment</p>
                  <p className="text-xs text-slate-500">bKash, Nagad, Card</p>
                </div>
                <div className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center",
                  formData.paymentMethod === 'Online' ? "border-brand-rose bg-brand-rose" : "border-slate-200"
                )}>
                  {formData.paymentMethod === 'Online' && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-rose" /> Order Summary
            </h2>
            
            <div className="max-h-60 overflow-y-auto space-y-4 mb-6 pr-2">
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                  <img src={item.images[0]} alt="" className="h-16 w-12 rounded-lg object-cover" />
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Qty: {item.quantity} | {item.selectedSize}</p>
                    <p className="text-sm font-bold text-brand-rose">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-brand-pink pt-6 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>৳{totalPrice.toLocaleString()}</span>
              </div>
              
              {/* Coupon Section */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon Code"
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-brand-rose"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-500">{couponError}</p>}
                {appliedDiscount > 0 && (
                  <p className="text-[10px] text-green-600 font-bold">
                    Coupon applied! {appliedDiscount}% discount
                  </p>
                )}
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Shipping ({formData.district})</span>
                <span>৳{shippingCost.toLocaleString()}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-brand-pink pt-4">
                <div className="flex justify-between text-xl font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-brand-rose">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-rose py-5 text-lg font-bold text-white shadow-xl shadow-brand-rose/20 transition-all hover:bg-rose-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? 'Processing...' : user ? 'Confirm Order' : 'Login to Order'}
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-brand-pink/50 p-4 text-brand-rose">
            <ShieldCheck className="h-6 w-6" />
            <p className="text-xs font-bold uppercase tracking-wider">Discrete & Private Packaging Guaranteed</p>
          </div>
        </div>
      </form>
    </div>
  );
}
