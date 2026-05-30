'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CreditCard, Mail, Phone, MapPin, Package, Calendar, Tag } from 'lucide-react';

// Components
import AdminLayout from '@/components/admin/layout/AdminLayout';
import Button from '@/components/ui/button';
import Badge from '@/components/admin/ui/badge';
import { formatCurrency } from '@/lib/formatCurrency';

// Hooks
import { useDashboardData } from '@/hooks/admin/useDashboardData';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const { orders, loading, alert, updateOrderStatus } = useDashboardData();
  const [order, setOrder] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const found = orders.find((o) => o._id === orderId || o.orderId === orderId);
      if (found) {
        setOrder(found);
      }
    }
  }, [orderId, orders]);

  const formatDate = (dateStr: string) => {
    if (!mounted || !dateStr) return '';
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details" subtitle="Loading transaction profile...">
        <div className="py-24 text-center select-none space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose mx-auto" />
          <p className="text-[10px] text-light-brown font-bold tracking-widest uppercase">
            Loading Order Profile...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Details" subtitle="Transaction profiles">
        <div className="py-24 text-center select-none space-y-4">
          <span className="text-3xl">⚠️</span>
          <h3 className="font-playfair text-lg font-bold text-foreground mt-4 mb-1">Order not found</h3>
          <p className="text-xs text-light-brown">We could not locate transaction log: {orderId}</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="mt-4 px-6 py-2.5 bg-rose text-white text-[10px] font-bold tracking-wider uppercase rounded-full"
          >
            Back to Orders
          </button>
        </div>
      </AdminLayout>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Shipped': return 'info';
      case 'Processing': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'primary';
    }
  };

  return (
    <AdminLayout title={`Order Details: ${order.orderId}`} subtitle="Verify checkout items and shipment state">
      {/* Alert toast info */}
      {alert && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 border rounded-2xl flex items-center shadow-lg animate-fadeIn font-semibold text-xs ${
          alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {alert.text}
        </div>
      )}

      <div className="space-y-6 max-w-5xl animate-fadeIn">
        
        {/* Back Link */}
        <button
          onClick={() => router.push('/admin/orders')}
          className="flex items-center gap-1.5 text-xs font-bold text-light-brown hover:text-rose transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Orders Log
        </button>

        {/* Invoice & Moderation Control panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Invoice Panel */}
            <div className="bg-background border border-border-custom/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex justify-between items-start border-b border-border-custom/20 pb-6">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-foreground">INVOICE</h2>
                  <p className="text-[10px] text-light-brown font-semibold uppercase tracking-wider mt-1 flex items-center gap-1">
                    <Calendar size={12} /> {formatDate(order.createdAt || '')}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  <p className="text-xs text-foreground font-bold mt-2">ID: {order.orderId}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Package size={14} className="text-rose" /> Ordered Products ({order.orderItems?.length})
                </h3>
                <div className="border border-border-custom/25 rounded-2xl overflow-hidden divide-y divide-border-custom/10">
                  {order.orderItems?.map((item: any) => (
                    <div key={item._id} className="flex gap-4 p-4 items-center">
                      <div className="w-12 h-16 bg-cream rounded-lg overflow-hidden border border-border-custom/10 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-rose/10 text-rose font-bold text-xs uppercase">
                            {item.name.slice(0, 1)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-foreground truncate">{item.name}</h4>
                        <div className="flex gap-3 text-[10px] text-light-brown font-semibold mt-1">
                          <span className="uppercase tracking-wider">Size: <strong className="text-foreground">{item.size}</strong></span>
                          <span>Qty: <strong className="text-foreground">{item.quantity}</strong></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-xs text-foreground">{formatCurrency(item.price)}</p>
                        <p className="text-[10px] text-light-brown font-medium mt-0.5">Total: {formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation summary */}
              <div className="border-t border-border-custom/20 pt-6 space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between text-xs text-light-brown">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-light-brown">
                  <span>Tax Amount:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(order.taxPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-xs text-light-brown">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(order.shippingPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold border-t border-border-custom/10 pt-2 text-foreground">
                  <span className="uppercase tracking-wider">Total Value:</span>
                  <span className="text-rose text-sm">{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Customer Info & Status moderations */}
          <div className="space-y-6">
            
            {/* Status Change Control */}
            <div className="bg-background border border-border-custom/30 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Tag size={14} className="text-rose" /> Dispatch Controls
              </h3>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider">
                  Update Shipment State
                </label>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="w-full px-4 py-3 border border-border-custom bg-cream rounded-xl text-xs focus:outline-none focus:border-rose text-foreground cursor-pointer"
                >
                  <option value="Pending" className="bg-background text-foreground">Pending Approval</option>
                  <option value="Processing" className="bg-background text-foreground">Processing</option>
                  <option value="Shipped" className="bg-background text-foreground">Shipped In-Transit</option>
                  <option value="Delivered" className="bg-background text-foreground">Delivered (Close Order)</option>
                  <option value="Cancelled" className="bg-background text-foreground">Cancel Transaction</option>
                </select>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="bg-background border border-border-custom/30 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={14} className="text-rose" /> Customer Profile
              </h3>
              <div className="space-y-3 text-left">
                <div>
                  <h4 className="font-bold text-foreground text-xs">{order.customerDetails?.fullName || order.shippingAddress?.fullName}</h4>
                  <p className="text-[10px] text-light-brown uppercase tracking-widest font-semibold mt-0.5">Buyer</p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-mid">
                  <Mail size={12} className="text-light-brown" />
                  <span className="truncate">{order.customerDetails?.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-mid">
                  <Phone size={12} className="text-light-brown" />
                  <span>{order.customerDetails?.phone || 'No phone supplied'}</span>
                </div>

                <div className="border-t border-border-custom/10 pt-3 mt-3">
                  <span className="block text-[10px] font-bold text-light-brown uppercase tracking-wider mb-1">
                    Shipment Address
                  </span>
                  <p className="text-xs text-mid leading-relaxed">
                    {order.customerDetails?.address || order.shippingAddress?.address},<br />
                    {order.customerDetails?.city || order.shippingAddress?.city}, {order.customerDetails?.state || ''} - {order.customerDetails?.pincode || order.shippingAddress?.postalCode}<br />
                    <span className="font-bold text-foreground">{order.shippingAddress?.country || 'India'}</span>
                  </p>
                </div>

                <div className="border-t border-border-custom/10 pt-3 mt-3 flex items-center justify-between text-xs text-mid">
                  <span className="flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider">
                    <CreditCard size={12} className="text-light-brown" /> Method
                  </span>
                  <span className="font-semibold text-foreground uppercase tracking-wider bg-cream border border-border-custom/20 px-2 py-0.5 rounded-md text-[9px]">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-mid">
                  <span className="font-bold uppercase text-[9px] tracking-wider">Payment Status</span>
                  <Badge variant={order.isPaid ? 'success' : 'danger'}>
                    {order.isPaid ? 'Paid' : 'Unpaid COD'}
                  </Badge>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
