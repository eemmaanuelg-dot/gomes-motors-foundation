import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import { criarWhatsAppUrl } from "@/lib/vehicle-utils";
import { Logo } from "./Logo";

const whatsappUrl = criarWhatsAppUrl("Olá, Gomes Motors! Gostaria de falar com a equipe comercial.");

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo className="h-16" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            A escolha certa começa aqui. Veículos selecionados com transparência
            e atendimento próximo em Campos dos Goytacazes, RJ.
          </p>
        </div>

        <nav aria-label="Links do site">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Navegação</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/estoque" className="transition-colors hover:text-foreground">Estoque</Link></li>
            <li><Link to="/servicos" className="transition-colors hover:text-foreground">Serviços</Link></li>
            <li><Link to="/sobre" className="transition-colors hover:text-foreground">Sobre nós</Link></li>
            <li><Link to="/contato" className="transition-colors hover:text-foreground">Contato</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Contato</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Campos dos Goytacazes, RJ
            </li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 transition-colors hover:text-foreground">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                WhatsApp comercial
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Horários</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Segunda a sexta — 9h às 18h
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Sábado — 9h às 13h
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Gomes Motors. Todos os direitos reservados.</span>
          <span>Campos dos Goytacazes — RJ</span>
        </div>
      </div>
    </footer>
  );
}
