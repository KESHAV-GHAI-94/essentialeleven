import { AdminCustomerList } from "@/components/admin/AdminCustomerList";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Customer Management</h1>
          <p className="text-navy-400 font-medium">Verify profiles, check order history, and manage user status.</p>
        </div>
      </div>

      <AdminCustomerList />
    </div>
  );
}
