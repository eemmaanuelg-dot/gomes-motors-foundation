import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV_ITEMS = [
  { to: "/estoque", label: "Estoque" },
  { to: "/servicos", label: "Serviços" },
  { to: "/sobre", label: "Sobre nós" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo className="h-11 md:h-14" />

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm font-medium text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Ações à direita */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Favoritos"
            title="Favoritos"
            className="flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Heart className="h-[18px] w-[18px]" />
          </button>
          <a
            href="https://wa.me/"
            aria-label="WhatsApp"
            className="hidden items-center gap-2 rounded-sm bg-brand-red px-4 py-2 text-sm font-semibold text-brand-red-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <Phone className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-sm text-foreground transition-colors hover:bg-accent md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Navegação mobile */}
      {mobileOpen && (
        <nav
          className="border-t border-border bg-background px-4 pb-6 pt-2 md:hidden"
          aria-label="Navegação móvel"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-border py-3.5 text-base font-medium text-foreground"
                  activeProps={{ className: "block border-b border-border py-3.5 text-base font-medium text-gold" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="https://wa.me/"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-red px-4 py-3 text-sm font-semibold text-brand-red-foreground"
          >
            <Phone className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
