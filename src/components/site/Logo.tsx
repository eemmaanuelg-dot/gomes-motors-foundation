import { Link } from "@tanstack/react-router";
import logo from "../../assets/gomes-motors-logo.svg";
import { dealershipConfig } from "@/config/dealership";

/** Logo visual da instalação atual. O asset pode ser substituído no handoff. */
export function Logo({ className = "h-11" }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label={`${dealershipConfig.company.name} — Voltar à página inicial`}
      className="flex shrink-0 items-center"
    >
      <img
        src={logo}
        alt={dealershipConfig.company.name}
        className={`${className} w-auto`}
        width={760}
        height={180}
      />
    </Link>
  );
}
