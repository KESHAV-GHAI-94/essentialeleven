import { AdminVendorList } from "@/components/admin/AdminVendorList";

export default function AdminVendorsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between text-left">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Vendor Management</h1>
          <p className="text-navy-400 font-medium">Manage and monitor your merchant partners and their listings.</p>
        </div>
      </div>

      <AdminVendorList />
    </div>
  );
}
