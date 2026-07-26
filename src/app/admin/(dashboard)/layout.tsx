import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/AdminHeader";
import { isAdminAuthenticated } from "@/lib/admin/session";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <AdminHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
