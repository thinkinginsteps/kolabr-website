"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guards";
import { applyPatches, isCopyFile, readCopy, writeCopy, type Patch } from "./copy";

export type CopySaveState = { saved?: number; error?: string; rejected?: string[] };

/**
 * Saves edits to one copy document. The form posts every field it rendered; only the ones that
 * actually changed become patches, so two people editing different sections do not overwrite
 * each other's work wholesale.
 */
export async function saveCopy(_prev: CopySaveState, formData: FormData): Promise<CopySaveState> {
  await requireAdmin();

  const name = String(formData.get("file") ?? "");
  if (!isCopyFile(name)) return { error: "Unknown content file." };

  const doc = await readCopy(name);
  const patches: Patch[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("f:") || typeof value !== "string") continue;
    patches.push({ path: key.slice(2), value: value.replace(/\r\n/g, "\n") });
  }
  if (patches.length === 0) return { error: "Nothing was submitted." };

  const { applied, rejected } = applyPatches(doc, patches);
  if (rejected.length) {
    // A rejected path means the form and the document disagree about the shape, which should be
    // impossible. Save nothing rather than write a half-applied document.
    console.error("[copy] rejected paths:", rejected.slice(0, 5));
    return { error: "Some fields no longer match the page. Reload and try again.", rejected: rejected.slice(0, 5) };
  }
  if (applied === 0) return { saved: 0 };

  await writeCopy(name, doc);
  revalidatePath("/admin/copy");
  return { saved: applied };
}
