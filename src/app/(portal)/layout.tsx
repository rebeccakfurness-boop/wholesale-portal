import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { getBranchesForCompany, getCompanyById } from "@/lib/db/queries";
import { getCurrentBranch, getCurrentUser } from "@/lib/session";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const company = await getCompanyById(user.companyId);
  const branches = await getBranchesForCompany(user.companyId);
  const currentBranch = await getCurrentBranch();

  if (!company || !currentBranch) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header company={company} user={user} branches={branches} currentBranch={currentBranch} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
