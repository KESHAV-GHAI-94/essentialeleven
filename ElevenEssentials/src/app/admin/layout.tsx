import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Eleven Essentials | Admin Dashboard",
  description: "Manage your premium e-commerce platform.",
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
