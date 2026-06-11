import { getSupabase } from "./adminStats";

export async function logAuditEvent(
  action: string,
  ip?: string,
  details?: Record<string, unknown>
) {
  try {
    const sb = getSupabase();
    if (!sb) return;
    await sb.from("admin_audit_logs").insert({
      action,
      ip: ip ?? null,
      details: details ?? {},
    });
  } catch {
    // silent fail — never break the main flow
  }
}
