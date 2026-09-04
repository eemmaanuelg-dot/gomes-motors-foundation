import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";

export const Route = createFileRoute("/admin/novo-veiculo")({ component: NewVehiclePage });

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}{required ? " *" : ""}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /></label>;
}

function NewVehiclePage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("carros");
  const [brand, setBrand] = useState(""); const [model, setModel] = useState(""); const [version, setVersion] = useState("");
  const [year, setYear] = useState(""); const [modelYear, setModelYear] = useState(""); const [mileage, setMileage] = useState("0");
  const [price, setPrice] = useState(""); const [status, setStatus] = useState("disponivel"); const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState(""); const [color, setColor] = useState(""); const [vehicleType, setVehicleType] = useState(""); const [cylinderCapacity, setCylinderCapacity] = useState("");
  const [description, setDescription] = useState(""); const [published, setPublished] = useState(true); const [featured, setFeatured] = useState(false); const [displayOrder, setDisplayOrder] = useState("0");
  const [entry, setEntry] = useState(""); const [rate, setRate] = useState("1.89"); const [terms, setTerms] = useState("24, 36, 48");
  const [saving, setSaving] = useState(false); const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const priceCents = Math.round(Number(price.replace(",", ".")) * 100);
      const entradaMinima = Math.round(Number((entry || "0").replace(",", ".")) * 100);
      if (!Number.isFinite(priceCents) || priceCents < 0) throw new Error("Informe um preço válido.");
      if (!Number.isFinite(entradaMinima) || entradaMinima < 0) throw new Error("Informe uma entrada mínima válida.");
      const response = await fetch("/admin/vehicle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        category, brand, model, version, year: Number(year), model_year: modelYear ? Number(modelYear) : undefined, mileage: Number(mileage), priceCents, status,
        transmission, fuel, color, vehicle_type: vehicleType, cylinder_capacity: cylinderCapacity, description, published, featured, displayOrder: Number(displayOrder),
        financing: { entradaMinima, parcelas: terms.split(",").map((item) => Number(item.trim())).filter((item) => Number.isInteger(item) && item > 0), taxaIndicativa: Number(rate.replace(",", ".")) },
      }) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "Não foi possível cadastrar o veículo.");
      await navigate({ to: "/admin" });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível cadastrar o veículo."); }
    finally { setSaving(false); }
  };

  return <div className="min-h-[calc(100vh-120px)] bg-background"><div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Painel administrativo</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Novo veículo</h1><p className="mt-2 text-sm text-muted-foreground">Cadastre um veículo diretamente no estoque do D1.</p></div><Link to="/admin" className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><ArrowLeft className="h-4 w-4" />Voltar</Link></div>
    <form onSubmit={submit} className="space-y-6">
      {message && <div className="rounded-sm border border-brand-red/30 bg-brand-red/5 px-4 py-3 text-sm text-brand-red">{message}</div>}
      <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><h2 className="font-bold">Identificação</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Categoria *</span><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm"><option value="carros">Carros</option><option value="motos">Motos</option></select></label>
        <Field label="Marca" value={brand} onChange={setBrand} required /><Field label="Modelo" value={model} onChange={setModel} required /><Field label="Versão" value={version} onChange={setVersion} /><Field label="Ano" value={year} onChange={setYear} type="number" required /><Field label="Ano do modelo" value={modelYear} onChange={setModelYear} type="number" /><Field label="Quilometragem" value={mileage} onChange={setMileage} type="number" required /><Field label="Tipo do veículo" value={vehicleType} onChange={setVehicleType} /><Field label="Cilindrada" value={cylinderCapacity} onChange={setCylinderCapacity} /></div></section>
      <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><h2 className="font-bold">Comercial</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Preço (R$)" value={price} onChange={setPrice} type="number" required /><label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Status *</span><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm"><option value="disponivel">Disponível</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option></select></label><Field label="Ordem de exibição" value={displayOrder} onChange={setDisplayOrder} type="number" /><Field label="Transmissão" value={transmission} onChange={setTransmission} /><Field label="Combustível" value={fuel} onChange={setFuel} /><Field label="Cor" value={color} onChange={setColor} /></div><div className="mt-5 flex flex-wrap gap-5 text-sm"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={published && status !== "vendido"} disabled={status === "vendido"} onChange={(e) => setPublished(e.target.checked)} />Publicar no site</label><label className="inline-flex items-center gap-2"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />Destacar veículo</label></div></section>
      <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><h2 className="font-bold">Financiamento</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Entrada mínima (R$)" value={entry} onChange={setEntry} type="number" /><Field label="Taxa indicativa (% a.m.)" value={rate} onChange={setRate} type="number" /><Field label="Prazos" value={terms} onChange={setTerms} /></div><p className="mt-4 text-xs leading-relaxed text-muted-foreground">Os parâmetros de financiamento são educativos e não representam aprovação ou proposta de crédito.</p></section>
      <section className="rounded-sm border border-border bg-card p-5 sm:p-6"><label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Descrição</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-gold" /></label></section>
      <div className="flex justify-end gap-3"><Link to="/admin" className="rounded-sm border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary">Cancelar</Link><button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-sm bg-foreground px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Salvando…" : "Cadastrar veículo"}</button></div>
    </form>
  </div></div>;
}
