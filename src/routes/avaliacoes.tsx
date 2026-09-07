import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Star } from "lucide-react";

export const Route = createFileRoute("/avaliacoes")({
  head: () => ({
    meta: [
      { title: "Avaliações — Gomes Motors" },
      {
        name: "description",
        content: "Confira avaliações publicadas por clientes da Gomes Motors e compartilhe sua experiência.",
      },
      { property: "og:title", content: "Avaliações — Gomes Motors" },
      {
        property: "og:description",
        content: "Experiências e avaliações de clientes da Gomes Motors.",
      },
    ],
  }),
  component: AvaliacoesPage,
});

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  vehicle_id: string | null;
  created_at: string;
};

function AvaliacoesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const loadReviews = async () => {
    try {
      const response = await fetch("/api/reviews", { headers: { Accept: "application/json" } });
      const data = (await response.json()) as { reviews?: Review[] };
      if (!response.ok) throw new Error("Não foi possível carregar as avaliações.");
      setReviews(data.reviews ?? []);
    } catch {
      setMessage("Não foi possível carregar as avaliações agora.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews();
  }, []);

  const submit = async () => {
    if (sending) return;
    setMessage("");
    if (!name.trim() || !comment.trim()) {
      setMessage("Preencha seu nome e sua avaliação.");
      return;
    }
    if (!consent) {
      setMessage("Autorize a publicação da avaliação para continuar.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ customerName: name, rating, comment, consent }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível enviar a avaliação.");
      setName("");
      setRating(5);
      setComment("");
      setConsent(false);
      setMessage(data.message ?? "Avaliação enviada para moderação.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar a avaliação.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />Voltar ao início
      </Link>

      <header className="mt-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Gomes Motors</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Avaliações de clientes</h1>
        <p className="mt-3 text-muted-foreground">Compartilhe sua experiência. Toda avaliação passa por moderação antes de ser publicada.</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="text-xl font-bold text-foreground">Experiências publicadas</h2>
          {loading ? (
            <p className="mt-5 text-sm text-muted-foreground">Carregando avaliações…</p>
          ) : reviews.length === 0 ? (
            <div className="mt-5 rounded-sm border border-border bg-card p-8 text-center">
              <Star className="mx-auto h-8 w-8 text-gold" />
              <p className="mt-3 font-semibold text-foreground">Ainda não há avaliações publicadas.</p>
              <p className="mt-1 text-sm text-muted-foreground">Se você já foi atendido pela Gomes Motors, seja o primeiro a compartilhar sua experiência.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-sm border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-semibold text-foreground">{review.customer_name}</div>
                    <div className="flex" aria-label={`Nota ${review.rating} de 5`}>
                      {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-gold text-gold" : "text-muted-foreground"}`} />)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="review-form-heading" className="h-fit rounded-sm border border-border bg-card p-6">
          <h2 id="review-form-heading" className="text-xl font-bold text-foreground">Deixe sua avaliação</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sua avaliação será analisada pela equipe antes da publicação.</p>

          <div className="mt-6 space-y-4">
            <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">Nome</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} autoComplete="name" className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /></label>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-foreground">Sua nota</legend>
              <div className="flex gap-1" role="radiogroup" aria-label="Escolha sua nota">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  return <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} estrela${value > 1 ? "s" : ""}`} onClick={() => setRating(value)} className="rounded-sm p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"><Star className={`h-6 w-6 ${value <= rating ? "fill-gold text-gold" : "text-muted-foreground"}`} /></button>;
                })}
              </div>
            </fieldset>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold text-foreground">Avaliação</span><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={1200} rows={6} className="w-full resize-y rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /></label>
            <label className="flex items-start gap-3 text-sm text-muted-foreground"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4" /><span>Autorizo a Gomes Motors a publicar esta avaliação no site.</span></label>
            {message && <div role="status" className="rounded-sm border border-border bg-secondary p-3 text-sm text-foreground"><div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{message}</div></div>}
            <button type="button" disabled={sending} onClick={() => void submit()} className="w-full rounded-sm bg-gold px-4 py-3 text-sm font-bold text-gold-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{sending ? "Enviando…" : "Enviar avaliação"}</button>
          </div>
        </section>
      </div>
    </main>
  );
}
