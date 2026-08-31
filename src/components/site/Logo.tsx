import { Link } from "@tanstack/react-router";
import logoAsset from "../../assets/gomes-motors-logo.png.asset.json";

/** Logo oficial da Gomes Motors. */
export function Logo({ className = "h-11" }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Gomes Motors — Voltar à página inicial"
      className="flex shrink-0 items-center"
    >
      <img
        src={logoAsset.url}
        alt="Gomes Motors"
        className={`${className} w-auto`}
        width={640}
        height={620}
      />
    </Link>
  );
}
