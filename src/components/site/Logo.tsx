import { Link } from "@tanstack/react-router";
import logo from "../../assets/gomes-motors-logo.svg";

/** Logo oficial da Gomes Motors. */
export function Logo({ className = "h-11" }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Gomes Motors — Voltar à página inicial"
      className="flex shrink-0 items-center"
    >
      <img
        src={logo}
        alt="Gomes Motors"
        className={`${className} w-auto`}
        width={760}
        height={180}
      />
    </Link>
  );
}
