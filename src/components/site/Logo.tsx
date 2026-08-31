import { Link } from "@tanstack/react-router";
import logoAsset from "../../assets/gomes-motors-logo.png.asset.json";

/** Logo oficial da Gomes Motors. */
export function Logo() {
  return (
    <Link
      to="/"
      aria-label="Gomes Motors — Voltar à página inicial"
      className="flex shrink-0 items-center"
    >
      <img
        src={logoAsset.url}
        alt="Gomes Motors"
        className="h-11 w-auto"
        width={640}
        height={620}
      />
    </Link>
  );
}
