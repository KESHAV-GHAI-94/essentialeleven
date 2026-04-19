import { AdminInventoryPanel } from "@/components/admin/AdminInventoryPanel";

export default function AdminInventoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Inventory Control</h1>
          <p className="text-navy-400 font-medium">Monitor stock levels, set low-stock alerts, and adjust variant quantities.</p>
        </div>
      </div>

      <AdminInventoryPanel />
    </div>
  );
}
