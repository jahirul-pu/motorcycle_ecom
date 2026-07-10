'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, MapPin } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { cartService } from '@/services/cart.service';
import { ordersService } from '@/services/orders.service';
import { addressesService } from '@/services/addresses.service';
import ShippingSelector from '@/components/checkout/ShippingSelector';
import PaymentSelector from '@/components/checkout/PaymentSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import type { Address } from '@motohub/types';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, setCart, couponCode, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = React.useState('');
  const [shipping, setShipping] = React.useState<{ id: string; price: number }>({ id: 'inside-dhaka', price: 60 });
  const [paymentMethod, setPaymentMethod] = React.useState('Cash on Delivery');
  const [deliveryNote, setDeliveryNote] = React.useState('');
  const [placing, setPlacing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    Promise.all([cartService.getCart(), addressesService.getAddresses()])
      .then(([cartData, addrData]) => {
        setCart(cartData);
        setAddresses(addrData);
        const def = addrData.find((a: Address) => a.isDefault) ?? addrData[0];
        if (def) setSelectedAddressId(def.id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, setCart]);


  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { toast.error('Please select a delivery address'); return; }
    if (!cart || cart.items.length === 0) { toast.error('Your cart is empty'); return; }

    setPlacing(true);
    try {
      const order = await ordersService.checkout({
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: couponCode ?? undefined,
        deliveryNote: deliveryNote || undefined,
      });
      clearCart();
      router.push(`/order-success?order=${order.orderNumber}&id=${order.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto max-w-xl px-4 py-24 text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-zinc-200 mb-4" />
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-2 text-zinc-500">Please sign in to continue.</p>
        <Link href="/login" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">Sign In</Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-100" />)}
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-zinc-100" />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-primary" />
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address selection */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Delivery Address
            </h2>

            {addresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
                <p className="text-sm text-zinc-500">No saved addresses.</p>
                <Link href="/account/addresses" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
                  Add an address →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-primary bg-primary/5'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">
                        {addr.recipientName}
                        {addr.isDefault && (
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Default</span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{addr.phone}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {addr.addressLine1}, {addr.area}, {addr.city}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <ShippingSelector
              selected={shipping.id}
              onChange={(id, price) => setShipping({ id, price })}
            />
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <PaymentSelector selected={paymentMethod} onChange={setPaymentMethod} />
          </section>

          {/* Delivery note */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-2">
            <label htmlFor="delivery-note" className="text-sm font-semibold text-zinc-700">
              Delivery Note <span className="font-normal text-zinc-400">(optional)</span>
            </label>
            <textarea
              id="delivery-note"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              rows={2}
              placeholder="Any special instructions for delivery..."
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </section>

          {/* Place Order CTA */}
          <button
            onClick={handlePlaceOrder}
            disabled={placing || !selectedAddressId || !cart?.items.length}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-bold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {placing ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Placing Order...</>
            ) : (
              <><ShieldCheck className="h-5 w-5" /> Place Order</>
            )}
          </button>
        </div>

        {/* Right: Summary */}
        <div>
          <OrderSummary shipping={shipping.price} />
        </div>
      </div>
    </main>
  );
}
