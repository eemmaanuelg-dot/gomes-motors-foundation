import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Eye, ImagePlus, Star, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/galeria/$id")({ component: AdminGalleryPage });

type Vehicle = { id: string; brand: string; model: string; version?: string | null; year: number };
type Media = { id: string; vehicle_id: string; object_key: string; mime_type: string; display_order: number; alt_text?: string | null };
type AdminData = { vehicles: Vehicle[]; media: Media[] };

type PatchResult = { ok?: boolean; error?: string };

const mediaUrl = (objectKey: string) => `/media?key=${encodeURIComponent(objectKey)}`;

function AdminGalleryPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");

  const load = async () => {
    try {
      const response = await fetch("/admin/api", { headers: { Accept: "application/json" }, credentials: "include" });
      const result = await response.json() as AdminData & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Não foi possível carregar a galeria.");
      setData(result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível carregar a galeria.");
    }
  };

  useEffect(() => { void load(); }, []);

  const vehicle = data?.vehicles.find((item) => item.id === id);
  const media = useMemo(() => [...(data?.media ?? [])].filter((item) => item.vehicle_id === id).sort((a, b) => a.display_order - b.display_order), [data?.media, id]);

  const patch = async (mediaId: string, action: "setPrimary" | "setOrder" | "setAlt", value?: number | string) => {
    setSavingId(mediaId); setMessage("");
    try {
      const body: Record<string, unknown> = { action, mediaId };
      if (action === "setOrder") body.displayOrder = Number(value);
      if (action === "setAlt") body.altText = String(value ?? "");
      const response = await fetch("/admin/media", { method: "PATCH", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include", body: JSON.stringify(body) });
      const result = await response.json() as PatchResult;
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível atualizar a mídia.");
      setMessage(action === "setPrimary" ? "Imagem principal atualizada." : action === "setOrder" ? "Ordem atualizada." : "Texto alternativo atualizado.");
      await load();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Não foi possível atualizar a mídia.");
    } finally { setSavingId(""); }
  };

  const remove = async (mediaId: string) => {
    if (!window.confirm("Remover esta imagem da galeria?")) return;
    setSavingId(mediaId); setMessage("");
    try {
      const response = await fetch("/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json", Accept: "application/json" }, credentials: "include", body: JSON.stringify({ mediaId }) });
      const result = await response.json() as PatchResult;
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível remover a mídia.");
      setMessage("Imagem removida.");
      await load();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Não foi possível remover a mídia.");
    } finally { setSavingId(""); }
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true); setMessage("");
    try {
      const form = new FormData();
      form.set("vehicleId", id); form.set("file", file); form.set("altText", uploadAlt); form.set("order", String(media.length));
      const response = await fetch("/admin/media", { method: "POST", body: form, credentials: "include" });
      const result = await response.json() as PatchResult;
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível enviar a imagem.");
      setFile(null); setUploadAlt(""); setMessage("Imagem enviada para o R2.");
      const input = document.getElementById("gallery-upload") as HTMLInputElement | null; if (input) input.value = "";
      await load();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Não foi possível enviar a imagem.");
    } finally { setUploading(false); }
  };

  if (!data && !error) return <main className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted-foreground">Carregando galeria…</main>;
  if (error || !vehicle) return <main className="mx-auto max-w-6xl px-4 py-12"><Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Voltar ao painel</Link><div className="mt-8 rounded-sm border border-border bg-card p-8"><h1 className="text-xl font-bold">Galeria indisponível</h1><p className="mt-2 text-sm text-muted-foreground">{error || "Veículo não encontrado."}</p></div></main>;

  const title = `${vehicle.brand} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ""}`;

  return <main className="min-h-[calc(100vh-120px)] bg-background"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Painel administrativo</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Galeria do veículo</h1><p className="mt-2 text-sm text-muted-foreground">{title} · {vehicle.year}</p></div><div className="flex flex-wrap gap-2"><Link to="/admin" className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><ArrowLeft className="h-4 w-4" />Painel</Link><Link to="/admin/preview/$id" params={{ id }} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><Eye className="h-4 w-4" />Preview</Link></div></div>
    {message && <div className="mb-5 rounded-sm border border-gold/30 bg-gold/5 px-4 py-3 text-sm">{message}</div>}

    <section className="mb-6 rounded-sm border border-border bg-card p-5 sm:p-6"><div className="flex items-center gap-2"><ImagePlus className="h-5 w-5 text-gold" /><h2 className="font-bold">Adicionar imagem</h2></div><div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_auto]"><input id="gallery-upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full rounded-sm border border-border bg-secondary px-3 py-2 text-sm file:mr-3 file:rounded-sm file:border-0 file:bg-foreground file:px-3 file:py-2 file:text-xs file:font-semibold file:text-background" /><input value={uploadAlt} onChange={(event) => setUploadAlt(event.target.value)} placeholder="Texto alternativo" className="rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /><button type="button" disabled={!file || uploading} onClick={() => void upload()} className="inline-flex items-center justify-center gap-2 rounded-sm bg-foreground px-4 py-2.5 text-sm font-semibold text-background disabled:opacity-50"><Upload className="h-4 w-4" />{uploading ? "Enviando…" : "Enviar para R2"}</button></div></section>

    <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-bold">Imagens cadastradas</h2><p className="mt-1 text-xs text-muted-foreground">A primeira imagem da ordem é usada como principal no catálogo.</p></div><span className="rounded-sm bg-secondary px-2.5 py-1 text-xs font-bold">{media.length} imagem(ns)</span></div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{media.length ? media.map((item, index) => <article key={item.id} className="overflow-hidden rounded-sm border border-border"><div className="relative aspect-video bg-secondary"><img src={mediaUrl(item.object_key)} alt={item.alt_text || `${title} — imagem ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />{index === 0 && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-sm bg-gold px-2.5 py-1 text-[11px] font-bold text-black"><Star className="h-3.5 w-3.5 fill-current" />Principal</span>}</div><div className="space-y-3 p-4"><div className="min-w-0"><p className="truncate text-sm font-semibold">Imagem {index + 1}</p><p className="truncate text-xs text-muted-foreground">{item.object_key}</p></div><div className="grid grid-cols-[90px_1fr] items-center gap-2"><label className="text-xs font-semibold text-muted-foreground">Ordem</label><input type="number" min="0" max="999" defaultValue={item.display_order} onBlur={(event) => { const value = Number(event.target.value); if (Number.isInteger(value) && value >= 0 && value <= 999 && value !== item.display_order) void patch(item.id, "setOrder", value); }} className="w-full rounded-sm border border-border bg-secondary px-2.5 py-2 text-sm" /></div><div className="grid grid-cols-[90px_1fr] items-center gap-2"><label className="text-xs font-semibold text-muted-foreground">Alt text</label><input defaultValue={item.alt_text ?? ""} maxLength={300} onBlur={(event) => { if (event.target.value !== (item.alt_text ?? "")) void patch(item.id, "setAlt", event.target.value); }} className="w-full rounded-sm border border-border bg-secondary px-2.5 py-2 text-sm" /></div><div className="flex flex-wrap gap-2"><button type="button" disabled={savingId === item.id || index === 0} onClick={() => void patch(item.id, "setPrimary")} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs font-semibold disabled:opacity-50">{index === 0 ? <Check className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />} {index === 0 ? "Principal" : "Definir principal"}</button><button type="button" disabled={savingId === item.id} onClick={() => void remove(item.id)} className="inline-flex items-center gap-2 rounded-sm border border-brand-red/30 px-3 py-2 text-xs font-semibold text-brand-red disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Remover</button></div></div></article>) : <div className="rounded-sm border border-dashed border-border p-10 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">Nenhuma imagem cadastrada no R2.</div>}</div>
    </section>
  </div></main>;
}
