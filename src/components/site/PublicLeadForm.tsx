import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { trackAnalytics } from "@/lib/analytics";

type Intent = "comprar" | "trocar" | "financiar" | "vender" | "consignar" | "contato";

type Props = {
  intent?: Intent;
  vehicleId?: string;
  source?: string;
  title?: string;
  description?: string;
};

const intents: Array<{ value: Intent; label: string }> = [
  { value: "comprar", label: "Comprar veículo" },
  { value: "financiar", label: "Financiamento" },
  { value: "trocar", label: "Troca" },
  { value: "vender", label: "Vender meu veículo" },
  { value: "consignar", label: "Consignação" },
  { value: "contato", label: "Outro assunto" },
];

export function PublicLeadForm({ intent, vehicleId, source = "site", title = "Fale com a Gomes Motors", description = "Deixe seus dados e nossa equipe dará continuidade ao atendimento." }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<Intent>(intent ?? "contato");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "include",
        body: JSON.stringify({ customerName: name, phone, email, intent: selectedIntent, vehicleId, source, message }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível enviar seu contato.");
      if (vehicleId) trackAnalytics({ eventName: "lead_intent", vehicleId, metadata: { intent: selectedIntent, source } });
      else trackAnalytics({ eventName: "lead_intent", metadata: { intent: selectedIntent, source } });
      setFeedback({ ok: true, text: "Recebemos seu contato. Nossa equipe dará continuidade em breve." });
      setName(""); setPhone(""); setEmail(""); setMessage("");
    } catch (error) {
      setFeedback({ ok: false, text: error instanceof Error ? error.message : "Não foi possível enviar seu contato." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="rounded-sm border border-border bg-card p-6 sm:p-8" aria-labelledby="public-lead-form-title">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Atendimento comercial</p>
      <h2 id="public-lead-form-title" className="mt-2 text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Nome</span><input required value={name} onChange={(event) => setName(event.target.value)} maxLength={120} autoComplete="name" className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" placeholder="Seu nome" /></label>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">WhatsApp / telefone</span><input required={!email} value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={40} inputMode="tel" autoComplete="tel" className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" placeholder="(22) 99999-9999" /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">E-mail <span className="font-normal text-muted-foreground">(opcional)</span></span><input value={email} onChange={(event) => setEmail(event.target.value)} maxLength={160} type="email" autoComplete="email" className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" placeholder="voce@email.com" /></label>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Como podemos ajudar?</span><select value={selectedIntent} onChange={(event) => setSelectedIntent(event.target.value as Intent)} disabled={Boolean(intent)} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold disabled:opacity-70">{intents.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        </div>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold">Mensagem <span className="font-normal text-muted-foreground">(opcional)</span></span><textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} rows={4} className="w-full resize-y rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" placeholder="Conte brevemente o que você precisa." /></label>
        {feedback && <div role={feedback.ok ? "status" : "alert"} className={`rounded-sm border px-4 py-3 text-sm ${feedback.ok ? "border-gold/30 bg-gold/5 text-foreground" : "border-brand-red/30 bg-brand-red/5 text-brand-red"}`}>{feedback.ok && <Check className="mr-2 inline h-4 w-4" />}{feedback.text}</div>}
        <button type="submit" disabled={sending} className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-red px-5 py-3 text-sm font-semibold text-brand-red-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{sending ? "Enviando…" : "Enviar solicitação"}</button>
      </form>
    </section>
  );
}
