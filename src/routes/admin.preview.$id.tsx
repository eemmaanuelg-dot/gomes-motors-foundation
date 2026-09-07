import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, ImagePlus, Pencil, Star } from "lucide-react";

export const Route = createFileRoute("/admin/preview/$id")({ component: AdminVehiclePreviewPage });

type Vehicle = Record<string, unknown>;
type Media = { id: string; vehicle_id: string; object_key: string; mime_type: string; display_order: number; alt_text?: string | null };
type AdminData = { vehicles: Vehicle[]; media: Media[] };

const text = (value: unknown) => value == null ? "" : String(value);
const money = (value: unknown) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value ?? 0) / 100);
const parseJson = <T,>(value: unknown, fallback: T): T => { try { return typeof value === "string" ? JSON.parse(value) as T : (value as T) ?? fallback; } catch { return fallback; } };
const statusLabel: Record<string, string> = { disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido" };

function mediaUrl(objectKey: string) {
  return `/media?key=${encodeURIComponent(objectKey)}`;
}

function AdminVehiclePreviewPage() {
  const { id } = Route.useParams();
  const [data, setData] = useState<AdminData | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/admin/api", { headers: { Accept: "application/json" }, credentials: "include" })
      .then(async (response) => {
        const result = await response.json() as AdminData & { error?: string };
        if (!response.ok) throw new Error(result.error ?? "Não foi possível carregar o preview.");
        if (active) setData(result);
      })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar o preview."); });
    return () => { active = false; };
  }, []);

  const vehicle = data?.vehicles.find((item) => text(item["id"]) === id);
  const media = useMemo(() => (data?.media ?? []).filter((item) => item.vehicle_id === id).sort((a, b) => a.display_order - b.display_order), [data?.media, id]);
  const images = media.map((item) => mediaUrl(item.object_key));
  const fallbackImage = text(vehicle?.["image_url"]);
  const imageList = images.length ? images : (fallbackImage ? [fallbackImage] : []);
  const currentImage = imageList[Math.min(selectedImage, Math.max(imageList.length - 1, 0))];
  const equipment = parseJson<unknown[]>(vehicle?.["equipment_json"], []);
  const technical = parseJson<Record<string, unknown>>(vehicle?.["technical_sheet_json"], {});
  const financing = parseJson<Record<string, unknown>>(vehicle?.["financing_json"], {});
  const published = Number(vehicle?.["published"] ?? 0) === 1;
  const publiclyAvailable = published && text(vehicle?.["status"]) !== "vendido";

  if (!data && !error) return <main className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted-foreground">Carregando preview administrativo…</main>;
  if (error || !vehicle) return <main className="mx-auto max-w-6xl px-4 py-12"><Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Voltar ao painel</Link><div className="mt-8 rounded-sm border border-border bg-card p-8"><h1 className="text-xl font-bold">Preview indisponível</h1><p className="mt-2 text-sm text-muted-foreground">{error || "Veículo não encontrado no painel administrativo."}</p></div></main>;

  const title = `${text(vehicle["brand"])} ${text(vehicle["model"])}${text(vehicle["version"]) ? ` ${text(vehicle["version"])}` : ""}`;
  const technicalEntries = Object.entries(technical).filter(([, value]) => value != null && text(value).trim());

  return <main className="min-h-[calc(100vh-120px)] bg-background">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Preview administrativo</p><h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">Visualização privada antes da publicação no site.</p></div>
        <div className="flex flex-wrap gap-2"><Link to="/admin" className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><ArrowLeft className="h-4 w-4" />Estoque</Link><Link to="/admin/editar-veiculo/$id" params={{ id }} className="inline-flex items-center gap-2 rounded-sm bg-gold px-3 py-2 text-sm font-bold text-black hover:opacity-90"><Pencil className="h-4 w-4" />Editar veículo</Link><Link to="/admin/galeria/$id" params={{ id }} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><ImagePlus className="h-4 w-4" />Gerenciar galeria</Link>{publiclyAvailable && <Link to="/estoque/$id" params={{ id }} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><ExternalLink className="h-4 w-4" />Abrir público</Link>}</div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-sm border border-gold/30 bg-gold/5 px-4 py-3 text-sm"><span className="font-bold text-gold">PRÉ-VISUALIZAÇÃO</span><span className="text-muted-foreground">Este conteúdo é administrativo e não altera a publicação pública.</span><span className="ml-auto rounded-sm border border-border bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">{published ? "Publicado" : "Não publicado"}</span></div>

      <section className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div className="overflow-hidden rounded-sm border border-border bg-card">{currentImage ? <img src={currentImage} alt={media[selectedImage]?.alt_text || title} className="aspect-[16/10] w-full object-cover" /> : <div className="flex aspect-[16/10] items-center justify-center bg-secondary text-sm text-muted-foreground">Nenhuma imagem cadastrada</div>}</div>
          {imageList.length > 1 && <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">{imageList.map((image, index) => <button key={image} type="button" onClick={() => setSelectedImage(index)} className={`overflow-hidden rounded-sm border ${index === selectedImage ? "border-gold" : "border-border"}`} aria-label={`Selecionar imagem ${index + 1}`}><img src={image} alt="" className="aspect-[4/3] w-full object-cover" /></button>)}</div>}
        </div>

        <div className="space-y-4">
          <div className="rounded-sm border border-border bg-card p-6"><div className="flex items-center justify-between gap-3"><span className="inline-flex rounded-sm border border-border bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">{statusLabel[text(vehicle["status"])] ?? text(vehicle["status"])}</span>{Number(vehicle["featured"] ?? 0) === 1 && <span className="inline-flex items-center gap-1 text-xs font-bold text-gold"><Star className="h-4 w-4 fill-current" />Destaque</span>}</div><h2 className="mt-5 text-2xl font-bold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{text(vehicle["year"])} / {text(vehicle["model_year"])} · {text(vehicle["mileage"])} km</p><p className="mt-5 text-3xl font-bold text-gold">{money(vehicle["current_price_cents"] ?? vehicle["price_cents"])}</p><p className="mt-2 text-xs text-muted-foreground">Preço atual cadastrado no estoque.</p></div>
          <div className="rounded-sm border border-border bg-card p-6"><h2 className="font-bold">Dados principais</h2><div className="mt-4 grid grid-cols-2 gap-3 text-sm">{[["Categoria", vehicle["category"]],["Tipo", vehicle["vehicle_type"]],["Câmbio", vehicle["transmission"]],["Combustível", vehicle["fuel"]],["Cor", vehicle["color"]],["Cilindrada", vehicle["cylinder_capacity"]]].filter(([, value]) => text(value)).map(([label, value]) => <div key={text(label)} className="rounded-sm bg-secondary p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{text(label)}</p><p className="mt-1 font-semibold">{text(value)}</p></div>)}</div></div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-sm border border-border bg-card p-6"><h2 className="font-bold">Descrição</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{text(vehicle["description"]) || "Nenhuma descrição cadastrada."}</p></div>
        <div className="rounded-sm border border-border bg-card p-6"><h2 className="font-bold">Ficha técnica</h2><div className="mt-4 space-y-2">{technicalEntries.length ? technicalEntries.map(([key, value]) => <div key={key} className="flex justify-between gap-4 border-b border-border py-2 text-sm"><span className="text-muted-foreground">{key}</span><span className="text-right font-semibold">{Array.isArray(value) ? value.join(", ") : text(value)}</span></div>) : <p className="text-sm text-muted-foreground">Nenhuma informação técnica cadastrada.</p>}</div></div>
        <div className="rounded-sm border border-border bg-card p-6"><h2 className="font-bold">Equipamentos</h2><div className="mt-4 flex flex-wrap gap-2">{equipment.length ? equipment.map((item, index) => <span key={`${text(item)}-${index}`} className="rounded-sm border border-border bg-secondary px-3 py-1.5 text-xs font-semibold">{typeof item === "string" ? item : text(item)}</span>) : <p className="text-sm text-muted-foreground">Nenhum equipamento cadastrado.</p>}</div></div>
        <div className="rounded-sm border border-border bg-card p-6"><h2 className="font-bold">Financiamento</h2><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-sm bg-secondary p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Entrada mínima</p><p className="mt-1 font-semibold">{money(financing["entradaMinima"])}</p></div><div className="rounded-sm bg-secondary p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Taxa indicativa</p><p className="mt-1 font-semibold">{text(financing["taxaIndicativa"])}% a.m.</p></div><div className="col-span-2 rounded-sm bg-secondary p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Prazos</p><p className="mt-1 font-semibold">{Array.isArray(financing["parcelas"]) ? financing["parcelas"].join(" · ") + "x" : "—"}</p></div></div></div>
      </section>
    </div>
  </main>;
}
