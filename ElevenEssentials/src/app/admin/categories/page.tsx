import { AdminCategoryList } from "@/components/admin/AdminCategoryList";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Category Manager</h1>
          <p className="text-navy-400 font-medium">Organize your products into logical sections for easy browsing.</p>
        </div>
      </div>

      <AdminCategoryList />
    </div>
  );
}
