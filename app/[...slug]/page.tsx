import { GrowthOS } from "../growth-os";
import { getWorkspaceData } from "@/db/workspace";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const data = await getWorkspaceData();
  return <GrowthOS initialData={data} />;
}
