import { AdminOrderTable } from "@/components/admin/AdminOrderTable";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Orders Management</h1>
          <p className="text-navy-400 font-medium">View and manage all customer orders across the platform.</p>
        </div>
      </div>

      <AdminOrderTable />
    </div>
  );
}
