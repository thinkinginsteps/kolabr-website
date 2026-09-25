"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./guards";
import { deleteMessage } from "./messages";

/** Removing an enquiry once it has been dealt with. There is no undo, and no archive. */
export async function deleteMessageAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteMessage(id);
  revalidatePath("/admin/messages");
}
