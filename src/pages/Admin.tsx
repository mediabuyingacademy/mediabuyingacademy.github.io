import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Tab = "cta" | "tracking";

export default function Admin() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("cta");

  const [rowId, setRowId] = useState<string | null>(null);
  const [ctaUrl, setCtaUrl] = useState("");
  const [metaPixel, setMetaPixel] = useState("");
  const [gaId, setGaId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        nav("/admin/login", { replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", sess.session.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);

      const { data: settings } = await supabase
        .from("site_settings").select("*").limit(1).maybeSingle();
      if (settings) {
        setRowId(settings.id);
        setCtaUrl(settings.cta_url || "");
        setMetaPixel(settings.meta_pixel_id || "");
        setGaId(settings.ga_id || "");
      }
      setReady(true);
    })();
  }, [nav]);

  const save = async (patch: { cta_url?: string; meta_pixel_id?: string | null; ga_id?: string | null }) => {
    if (!rowId) return toast.error("Ligne de paramètres introuvable");
    setSaving(true);
    const { error } = await supabase.from("site_settings").update(patch).eq("id", rowId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Enregistré");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/admin/login", { replace: true });
  };

  if (!ready) return <div className="flex min-h-[100svh] items-center justify-center bg-[#071426] text-white">…</div>;

  if (!isAdmin) {
    return (
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-[#071426] p-6 text-white">
        <p>Accès refusé : votre compte n'a pas le rôle admin.</p>
        <button onClick={logout} className="rounded-lg bg-white/10 px-4 py-2 text-sm">Se déconnecter</button>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-[#071426] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-8">
        <h1 className="text-lg font-bold">Admin · Prelander</h1>
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">← Accueil</Link>
          <button onClick={logout} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20">Se déconnecter</button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-4 sm:p-8">
        <div className="mb-6 inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => setTab("cta")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${tab === "cta" ? "bg-[#2EA3FF] text-white" : "text-[#AAB7C8]"}`}
          >
            Bouton CTA
          </button>
          <button
            onClick={() => setTab("tracking")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${tab === "tracking" ? "bg-[#2EA3FF] text-white" : "text-[#AAB7C8]"}`}
          >
            Pixel & Analytics
          </button>
        </div>

        {tab === "cta" && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5BC0FF]">Lien du bouton CTA</label>
            <input
              type="url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="https://…"
              className="mt-2 w-full rounded-lg border border-[#2EA3FF33] bg-[#0b1d36] px-3 py-2 text-sm outline-none focus:border-[#5BC0FF]"
            />
            <button
              disabled={saving} onClick={() => save({ cta_url: ctaUrl })}
              className="mt-4 rounded-lg bg-gradient-to-r from-[#2EA3FF] to-[#5BC0FF] px-5 py-2 text-sm font-bold disabled:opacity-50"
            >
              Enregistrer les modifications
            </button>
          </section>
        )}

        {tab === "tracking" && (
          <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5BC0FF]">Meta Pixel ID</label>
              <input
                value={metaPixel} onChange={(e) => setMetaPixel(e.target.value)}
                placeholder="Ex : 1234567890"
                className="mt-2 w-full rounded-lg border border-[#2EA3FF33] bg-[#0b1d36] px-3 py-2 text-sm outline-none focus:border-[#5BC0FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5BC0FF]">Google Analytics ID</label>
              <input
                value={gaId} onChange={(e) => setGaId(e.target.value)}
                placeholder="Ex : G-XXXXXXX ou UA-XXXX"
                className="mt-2 w-full rounded-lg border border-[#2EA3FF33] bg-[#0b1d36] px-3 py-2 text-sm outline-none focus:border-[#5BC0FF]"
              />
            </div>
            <button
              disabled={saving}
              onClick={() => save({ meta_pixel_id: metaPixel || null, ga_id: gaId || null })}
              className="rounded-lg bg-gradient-to-r from-[#2EA3FF] to-[#5BC0FF] px-5 py-2 text-sm font-bold disabled:opacity-50"
            >
              Enregistrer les modifications
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
