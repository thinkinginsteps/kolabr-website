import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeployPanel } from "@/components/admin/DeployPanel";
import { requireAdmin } from "@/lib/admin/guards";
import { listDeployRecords } from "@/lib/deploy/status";

export default async function AdminHome() {
  await requireAdmin();
  const history = await listDeployRecords();

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-8 px-5 py-14">
      <AdminHeader current="deploy" />

      <DeployPanel history={history} />
    </main>
  );
}
