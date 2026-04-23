import { AdminBrandList } from "@/components/admin/AdminBrandList";

export default function AdminBrandsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Brand Manager</h1>
          <p className="text-navy-400 font-medium">Manage and establish the brand identities associated with your catalog.</p>
        </div>
      </div>

      <AdminBrandList />
    </div>
  );
}
