/**
 * Configuração comercial da instalação.
 *
 * Este arquivo representa a identidade e os dados operacionais da empresa
 * que está usando o produto. A aplicação e suas regras de negócio não devem
 * depender diretamente desses valores. Em uma futura instalação, esta
 * configuração poderá ser substituída sem reescrever a aplicação.
 *
 * Dados de estoque, preços, mídia, histórico e auditoria permanecem no D1.
 */
export const dealershipConfig = {
  company: {
    name: "Gomes Motors",
    legalName: "Gomes Motors",
    tagline: "A escolha certa começa aqui.",
  },
  contact: {
    whatsappNumber: "5522999908461",
    whatsappDisplay: "(22) 99990-8461",
    phoneDisplay: "+55 22 99990-8461",
    phoneHref: "tel:+5522999908461",
    email: "",
  },
  location: {
    city: "Campos dos Goytacazes",
    state: "RJ",
    country: "Brasil",
    address: "",
  },
  social: {
    instagram: "",
    facebook: "",
  },
  web: {
    domain: "",
  },
  operations: {
    businessHours: [
      "Segunda a sexta — 9h às 18h",
      "Sábado — 9h às 13h",
    ],
  },
  branding: {
    logoAsset: "@/assets/gomes-motors-logo.svg",
    markAsset: "@/assets/gomes-motors-mark.svg",
  },
} as const;

export type DealershipConfig = typeof dealershipConfig;
