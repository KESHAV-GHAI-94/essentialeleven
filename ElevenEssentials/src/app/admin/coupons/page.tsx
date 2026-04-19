import { AdminCouponList } from "@/components/admin/AdminCouponList";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between text-left">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Promotions & Coupons</h1>
          <p className="text-navy-400 font-medium">Create discount codes to drive traffic and reward loyal customers.</p>
        </div>
      </div>

      <AdminCouponList />
    </div>
  );
}
