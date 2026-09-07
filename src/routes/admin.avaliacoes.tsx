import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Star, X } from "lucide-react";

export const Route = createFileRoute("/admin/avaliacoes")({ component: AdminAvaliacoesPage });

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  vehicle_id: string | null;
  source: string;
  status: "pendente" | "aprovada" | "rejeitada";
  created_at: string;
};

function AdminAvaliacoesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const response = await fetch("/admin/avaliacoes/api", { headers: { Accept: "application/json" } });
      const data = (await response.json()) as { reviews?: Review[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível carregar as avaliações.");
      setReviews(data.reviews ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível carregar as avaliações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const moderate = async (reviewId: string, status: Review["status"]) => {
    setMessage("");
    try {
      const response = await fetch("/admin/avaliacoes/api", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível atualizar a avaliação.");
      setReviews((current) => current.map((review) => review.id === reviewId ? { ...review, status } : review));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível atualizar a avaliação.");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Painel administrativo</Link>
        <Link to="/avaliacoes" className="text-sm font-semibold text-gold hover:text-foreground">Ver página pública</Link>
      </div>
      <header className="mt-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Painel administrativo</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Avaliações</h1><p className="mt-2 text-sm text-muted-foreground">Modere avaliações recebidas antes de publicá-las no site.</p></header>
      {message && <p role="alert" className="mt-5 rounded-sm border border-border bg-secondary p-3 text-sm text-foreground">{message}</p>}
      {loading ? <p className="mt-8 text-sm text-muted-foreground">Carregando…</p> : reviews.length === 0 ? <div className="mt-8 rounded-sm border border-border bg-card p-8 text-center text-sm text-muted-foreground">Nenhuma avaliação recebida.</div> : <div className="mt-8 space-y-4">{reviews.map((review) => <article key={review.id} className="rounded-sm border border-border bg-card p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold text-foreground">{review.customer_name}</h2><div className="mt-1 flex" aria-label={`Nota ${review.rating} de 5`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-gold text-gold" : "text-muted-foreground"}`} />)}</div></div><span className="rounded-sm border border-border px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{review.status}</span></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.comment}</p><div className="mt-5 flex flex-wrap gap-2">{review.status !== "aprovada" && <button type="button" onClick={() => void moderate(review.id, "aprovada")} className="inline-flex items-center gap-2 rounded-sm bg-gold px-4 py-2 text-sm font-bold text-gold-foreground"><Check className="h-4 w-4" />Aprovar</button>}{review.status !== "rejeitada" && <button type="button" onClick={() => void moderate(review.id, "rejeitada")} className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"><X className="h-4 w-4" />Rejeitar</button>}{review.status !== "pendente" && <button type="button" onClick={() => void moderate(review.id, "pendente")} className="rounded-sm border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">Voltar para pendente</button>}</div></article>)}</div>}
    </main>
  );
}
