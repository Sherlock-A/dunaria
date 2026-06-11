"use client";
import { useState } from "react";

export function DeleteContactButton({ email }: { email: string }) {
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer le contact ${email} ? Cette action est irréversible.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contacts/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      if (res.ok) setDeleted(true);
    } finally {
      setLoading(false);
    }
  }

  if (deleted) {
    return <span className="font-mono text-[10px] text-white/20 italic">supprimé</span>;
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      aria-label={`Supprimer ${email}`}
      className="rounded-lg p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M1.5 3h9M4.5 3V2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M10 3l-.667 7A.5.5 0 0 1 8.836 10.5H3.164a.5.5 0 0 1-.497-.5L2 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
