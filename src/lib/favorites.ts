import { useEffect, useState } from "react";

const STORAGE_KEY = "gomes-motors-favoritos";
const FAVORITOS_EVENT = "gomes-motors:favoritos";

function lerFavoritos() {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const valor = window.localStorage.getItem(STORAGE_KEY);
    const ids = valor ? JSON.parse(valor) : [];
    return new Set<string>(
      Array.isArray(ids)
        ? ids.filter((id): id is string => typeof id === "string")
        : [],
    );
  } catch {
    return new Set<string>();
  }
}

function notificarFavoritos() {
  window.dispatchEvent(new Event(FAVORITOS_EVENT));
}

function salvarFavoritos(favoritos: Set<string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoritos]));
  notificarFavoritos();
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    setFavoritos(lerFavoritos());
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoritos]));
  }, [favoritos, hidratado]);

  useEffect(() => {
    const sincronizar = () => setFavoritos(lerFavoritos());
    window.addEventListener("storage", sincronizar);
    window.addEventListener(FAVORITOS_EVENT, sincronizar);
    return () => {
      window.removeEventListener("storage", sincronizar);
      window.removeEventListener(FAVORITOS_EVENT, sincronizar);
    };
  }, []);

  const alternarFavorito = (id: string) => {
    setFavoritos((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
    window.setTimeout(notificarFavoritos, 0);
  };

  const removerFavoritosInvalidos = (idsValidos: Iterable<string>) => {
    const validos = new Set(idsValidos);
    setFavoritos((atual) => {
      const novos = new Set([...atual].filter((id) => validos.has(id)));
      if (novos.size !== atual.size) salvarFavoritos(novos);
      return novos;
    });
  };

  const limparFavoritos = () => {
    const vazios = new Set<string>();
    setFavoritos(vazios);
    salvarFavoritos(vazios);
  };

  return { favoritos, alternarFavorito, removerFavoritosInvalidos, limparFavoritos };
}
