import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeployPanel } from "@/components/admin/DeployPanel";
import { ServerHealth } from "@/components/admin/ServerHealth";
import { requireAdmin } from "@/lib/admin/guards";
import { getServerHealth } from "@/lib/deploy/health";
import { listDeployRecords } from "@/lib/deploy/status";

export default async function AdminHome() {
  await requireAdmin();
  const [history, health] = await Promise.all([listDeployRecords(), getServerHealth()]);

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-8 px-5 py-14">
      <AdminHeader current="deploy" />

      <DeployPanel history={history} />
      <ServerHealth health={health} />
    </main>
  );
}
