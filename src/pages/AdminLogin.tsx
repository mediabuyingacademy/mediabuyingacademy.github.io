import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/admin", { replace: true });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Connecté");
    nav("/admin", { replace: true });
  };

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-[#071426] p-6 text-white">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-[#2EA3FF33] bg-white/[0.03] p-6 backdrop-blur-md">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-sm text-[#AAB7C8]">Connexion administrateur</p>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-[#5BC0FF]">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#2EA3FF33] bg-[#0b1d36] px-3 py-2 text-sm outline-none focus:border-[#5BC0FF]"
        />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-[#5BC0FF]">Mot de passe</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#2EA3FF33] bg-[#0b1d36] px-3 py-2 text-sm outline-none focus:border-[#5BC0FF]"
        />

        <button
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#2EA3FF] to-[#5BC0FF] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {loading ? "..." : "Se connecter"}
        </button>

        <Link to="/" className="mt-4 block text-center text-xs text-[#AAB7C8] hover:text-white">← Retour à l'accueil</Link>
      </form>
    </div>
  );
}
