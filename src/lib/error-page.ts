export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Não foi possível carregar a página — Gomes Motors</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: dark; }
      body { font: 15px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #080808; color: #f5f5f5; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 30rem; width: 100%; text-align: center; padding: 2rem; border: 1px solid rgba(255,255,255,.09); background: #181818; border-radius: .375rem; box-sizing: border-box; }
      .brand { color: #c9a45c; font-size: .75rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 1rem; }
      h1 { font-size: 1.35rem; margin: 0 0 .6rem; }
      p { color: #a6a6a6; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: .5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: .65rem 1rem; border-radius: .375rem; font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #b5121b; color: #f5f5f5; }
      .secondary { background: transparent; color: #c9a45c; border-color: rgba(201,164,92,.6); }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand">Gomes Motors</div>
      <h1>Não foi possível carregar esta página</h1>
      <p>Ocorreu um problema inesperado. Tente novamente ou volte para a página inicial.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Voltar ao início</a>
      </div>
    </div>
  </body>
</html>`;
}
