"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, MapPin, Heart, LogOut, User as UserIcon, ChevronRight, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Account() {
  const { user, profile, logout, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist'>('orders');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-6 px-4 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-pink text-brand-rose">
          <UserIcon className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-slate-900">Welcome to AURA</h2>
          <p className="text-slate-500">Login to track your orders and manage your wishlist.</p>
        </div>
        <button
          onClick={loginWithGoogle}
          className="rounded-full bg-brand-rose px-8 py-4 font-bold text-white shadow-lg shadow-brand-rose/20 transition-all hover:bg-rose-500 hover:scale-105 active:scale-95"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-4">
          <div className="rounded-3xl bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-pink text-brand-rose text-3xl font-serif font-bold">
              {user.displayName?.[0] || 'U'}
            </div>
            <h2 className="font-serif text-xl font-bold text-slate-900">{user.displayName}</h2>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>

          <nav className="rounded-3xl bg-white p-4 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                activeTab === 'orders' ? "bg-brand-pink text-brand-rose" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Package className="h-5 w-5" /> My Orders
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                activeTab === 'profile' ? "bg-brand-pink text-brand-rose" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <UserIcon className="h-5 w-5" /> Profile Info
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                activeTab === 'wishlist' ? "bg-brand-pink text-brand-rose" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Heart className="h-5 w-5" /> Wishlist
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-500 transition-all hover:bg-rose-50"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-grow space-y-8">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Order History</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-32 w-full animate-pulse rounded-3xl bg-white shadow-sm" />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-50 p-6 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Order #{order.id.slice(-8)}</p>
                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="h-4 w-4" />
                            {order.createdAt?.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <div className={cn(
                          "rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest",
                          order.status === 'pending' ? "bg-amber-100 text-amber-600" :
                          order.status === 'shipped' ? "bg-blue-100 text-blue-600" :
                          "bg-green-100 text-green-600"
                        )}>
                          {order.status}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-4 overflow-hidden">
                            {order.items.slice(0, 3).map((item: any, i: number) => (
                              <img
                                key={i}
                                src={item.images[0]}
                                alt=""
                                className="inline-block h-12 w-10 rounded-lg border-2 border-white object-cover"
                              />
                            ))}
                            {order.items.length > 3 && (
                              <div className="flex h-12 w-10 items-center justify-center rounded-lg border-2 border-white bg-slate-100 text-xs font-bold text-slate-500">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">Total Amount</p>
                            <p className="text-lg font-bold text-brand-rose">৳{order.total.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-3xl bg-white text-center shadow-sm">
                  <Package className="h-12 w-12 text-slate-100" />
                  <p className="text-slate-500">You haven't placed any orders yet.</p>
                  <button onClick={() => router.push('/shop')} className="text-sm font-bold text-brand-rose hover:underline">
                    Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Profile Information</h2>
              <div className="rounded-3xl bg-white p-8 shadow-sm space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</p>
                    <p className="font-bold text-slate-900">{user.displayName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                    <p className="font-bold text-slate-900">{user.email}</p>
                  </div>
                </div>
                
                <div className="border-t border-slate-50 pt-8">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-brand-rose" /> Saved Addresses
                    </h3>
                    <button className="text-xs font-bold uppercase tracking-widest text-brand-rose hover:underline">
                      Add New
                    </button>
                  </div>
                  
                  {profile?.addresses && profile.addresses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {profile.addresses.map((addr: any) => (
                        <div key={addr.id} className="rounded-2xl border-2 border-slate-50 p-6">
                          <p className="font-bold text-slate-900">{addr.fullName}</p>
                          <p className="text-sm text-slate-500">{addr.phone}</p>
                          <p className="mt-2 text-sm text-slate-600">{addr.address}, {addr.area}, {addr.district}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No addresses saved yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-slate-900">My Wishlist</h2>
              <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-3xl bg-white text-center shadow-sm">
                <Heart className="h-12 w-12 text-slate-100" />
                <p className="text-slate-500">Your wishlist is currently empty.</p>
                <button onClick={() => router.push('/shop')} className="text-sm font-bold text-brand-rose hover:underline">
                  Find some favorites
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
