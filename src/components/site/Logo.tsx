import { Link } from "@tanstack/react-router";

/**
 * Marca tipográfica provisória da Gomes Motors.
 * Substituir pela logo oficial quando o arquivo for fornecido.
 */
export function Logo() {
  return (
    <Link
      to="/"
      aria-label="Gomes Motors — Voltar à página inicial"
      className="group flex items-center gap-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold/60">
        <span className="font-display text-sm font-bold tracking-tight text-gold">
          G
        </span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-[0.18em] text-foreground">
          GOMES
        </span>
        <span className="text-[0.6rem] font-semibold tracking-[0.42em] text-gold">
          MOTORS
        </span>
      </div>
    </Link>
  );
}
