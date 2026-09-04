export type CategoriaVeiculo = "carros" | "motos";
export type StatusVeiculo = "disponivel" | "reservado" | "vendido";

export type FichaTecnica = {
  motor: string;
  potencia?: string;
  torque?: string;
  desempenho?: string;
  consumo?: string;
  portas?: string;
  tracao?: string;
};

export type CondicoesFinanciamento = {
  entradaMinima: number;
  parcelas: number[];
  taxaIndicativa: number;
};

export type Veiculo = {
  id: string;
  categoria: CategoriaVeiculo;
  marca: string;
  modelo: string;
  versao?: string;
  ano: number;
  km: number;
  preco: number;
  cambio?: string;
  combustivel?: string;
  cilindrada?: string;
  tipo?: string;
  imagem: string;
  imagens: string[];
  descricao: string;
  equipamentos: string[];
  fichaTecnica: FichaTecnica;
  status: StatusVeiculo;
  destaque: boolean;
  financiamento: CondicoesFinanciamento;
  seoDescription: string;
};

export const VEICULOS: Veiculo[] = [
  {
    id: "civic-exl",
    categoria: "carros",
    marca: "Honda",
    modelo: "Civic",
    versao: "EXL",
    ano: 2020,
    km: 65000,
    preco: 109900,
    cambio: "Automático CVT",
    combustivel: "Flex",
    tipo: "Sedã",
    imagem: "https://carango.nyc3.digitaloceanspaces.com/images/veiculos/2022/06/honda-civic-2020-2-0-16v-flexone-exl-4p-cvt-flex-104437-r7uc5o.jpg",
    imagens: [
      "https://carango.nyc3.digitaloceanspaces.com/images/veiculos/2022/06/honda-civic-2020-2-0-16v-flexone-exl-4p-cvt-flex-104437-r7uc5o.jpg",
      "https://carango.nyc3.digitaloceanspaces.com/images/veiculos/2022/06/honda-civic-2020-2-0-16v-flexone-exl-4p-cvt-flex-104437-kjazo5.jpg",
      "https://carango.nyc3.digitaloceanspaces.com/images/veiculos/2022/06/honda-civic-2020-2-0-16v-flexone-exl-4p-cvt-flex-104437-17lmo3.jpg",
    ],
    descricao:
      "Honda Civic EXL com perfil executivo, ótimo nível de conforto e conjunto mecânico equilibrado. Uma opção para quem procura um sedã confiável, bem equipado e pronto para uso.",
    equipamentos: [
      "Ar-condicionado digital",
      "Central multimídia",
      "Câmera de ré",
      "Controle de cruzeiro",
      "Bancos em couro",
      "Direção elétrica",
      "Rodas de liga leve",
      "Controles de estabilidade e tração",
    ],
    fichaTecnica: {
      motor: "2.0 Flex, 4 cilindros",
      potencia: "155 cv",
      torque: "19,5 kgfm",
      desempenho: "0–100 km/h em aproximadamente 10,9 s",
      consumo: "Até 12,5 km/l em estrada",
      portas: "4 portas",
      tracao: "Dianteira",
    },
    status: "disponivel",
    destaque: true,
    financiamento: { entradaMinima: 32970, parcelas: [24, 36, 48, 60], taxaIndicativa: 1.69 },
    seoDescription:
      "Honda Civic EXL 2020 usado em Campos dos Goytacazes, RJ, com câmbio automático CVT e 65 mil km.",
  },
  {
    id: "corolla-gli",
    categoria: "carros",
    marca: "Toyota",
    modelo: "Corolla",
    versao: "GLi",
    ano: 2021,
    km: 58000,
    preco: 119900,
    cambio: "Automático CVT",
    combustivel: "Flex",
    tipo: "Sedã",
    imagem: "https://www.usadofacil.com.br/fotoscarrosano/2026/09/1382042.jpg",
    imagens: [
      "https://www.usadofacil.com.br/fotoscarrosano/2026/09/1382042.jpg",
      "https://www.usadofacil.com.br/fotoscarrosano/2026/09/1382042-2.jpg",
      "https://www.usadofacil.com.br/fotoscarrosano/2026/09/1382042-3.jpg",
    ],
    descricao:
      "Toyota Corolla GLi com combinação de conforto, confiabilidade e bom espaço interno. Ideal para uso diário, viagens e para quem valoriza um sedã de manutenção previsível.",
    equipamentos: [
      "Ar-condicionado",
      "Central multimídia",
      "Câmera de ré",
      "Controle de cruzeiro",
      "Volante multifuncional",
      "Direção elétrica",
      "Rodas de liga leve",
      "Controles de estabilidade e tração",
    ],
    fichaTecnica: {
      motor: "2.0 Flex, 4 cilindros",
      potencia: "177 cv",
      torque: "21,4 kgfm",
      desempenho: "0–100 km/h em aproximadamente 9,2 s",
      consumo: "Até 13,2 km/l em estrada",
      portas: "4 portas",
      tracao: "Dianteira",
    },
    status: "disponivel",
    destaque: true,
    financiamento: { entradaMinima: 35970, parcelas: [24, 36, 48, 60], taxaIndicativa: 1.69 },
    seoDescription:
      "Toyota Corolla GLi 2021 usado em Campos dos Goytacazes, RJ, com câmbio automático CVT e 58 mil km.",
  },
  {
    id: "polo",
    categoria: "carros",
    marca: "Volkswagen",
    modelo: "Polo",
    versao: "Highline TSI",
    ano: 2023,
    km: 42000,
    preco: 79900,
    cambio: "Automático",
    combustivel: "Flex",
    tipo: "Hatch",
    imagem: "https://imgserver.autocarro.com.br/fotos/grande/volkswagen-polo-1.0-tsi-170-highline-12v-2023-chumbo_31e2613d915.jpg",
    imagens: [
      "https://imgserver.autocarro.com.br/fotos/grande/volkswagen-polo-1.0-tsi-170-highline-12v-2023-chumbo_31e2613d915.jpg",
      "https://imgserver.autocarro.com.br/fotos/grande/volkswagen-polo-1.0-tsi-170-highline-12v-2023-chumbo_1e2613d9159.jpg",
      "https://imgserver.autocarro.com.br/fotos/grande/volkswagen-polo-1.0-tsi-170-highline-12v-2023-chumbo_2613d91599d.jpg",
    ],
    descricao:
      "Volkswagen Polo Highline TSI com proposta esportiva, bom desempenho e tecnologia para o uso urbano. Uma alternativa moderna para quem quer um hatch completo e eficiente.",
    equipamentos: [
      "Motor TSI",
      "Central multimídia",
      "Ar-condicionado digital",
      "Câmera de ré",
      "Piloto automático",
      "Volante multifuncional",
      "Rodas de liga leve",
      "Controles de estabilidade e tração",
    ],
    fichaTecnica: {
      motor: "1.0 TSI Turbo, 3 cilindros",
      potencia: "128 cv",
      torque: "20,4 kgfm",
      desempenho: "0–100 km/h em aproximadamente 9,6 s",
      consumo: "Até 14,5 km/l em estrada",
      portas: "4 portas",
      tracao: "Dianteira",
    },
    status: "disponivel",
    destaque: true,
    financiamento: { entradaMinima: 23970, parcelas: [24, 36, 48, 60], taxaIndicativa: 1.79 },
    seoDescription:
      "Volkswagen Polo Highline TSI 2023 usado em Campos dos Goytacazes, RJ, com câmbio automático e 42 mil km.",
  },
  {
    id: "onix",
    categoria: "carros",
    marca: "Chevrolet",
    modelo: "Onix",
    versao: "LTZ",
    ano: 2022,
    km: 38000,
    preco: 72900,
    cambio: "Manual",
    combustivel: "Flex",
    tipo: "Hatch",
    imagem: "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2024%2F06%2Fchevrolet-onix-2022-1-0-turbo-flex-ltz-automatico-flex-124597-u1ln38.jpg&w=810&zc=1",
    imagens: [
      "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2024%2F06%2Fchevrolet-onix-2022-1-0-turbo-flex-ltz-automatico-flex-124597-u1ln38.jpg&w=810&zc=1",
      "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2024%2F06%2Fchevrolet-onix-2022-1-0-turbo-flex-ltz-automatico-flex-124597-zfr60k.jpg&w=810&zc=1",
      "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2024%2F06%2Fchevrolet-onix-2022-1-0-turbo-flex-ltz-automatico-flex-124597-ab28ou.jpg&w=810&zc=1",
    ],
    descricao:
      "Chevrolet Onix LTZ com baixa quilometragem para o ano, bom pacote de equipamentos e proposta prática para cidade e estrada.",
    equipamentos: [
      "Central multimídia",
      "Ar-condicionado",
      "Câmera de ré",
      "Chave presencial",
      "Volante multifuncional",
      "Direção elétrica",
      "Rodas de liga leve",
      "Controles de estabilidade e tração",
    ],
    fichaTecnica: {
      motor: "1.0 Turbo Flex, 3 cilindros",
      potencia: "116 cv",
      torque: "16,8 kgfm",
      desempenho: "0–100 km/h em aproximadamente 10,1 s",
      consumo: "Até 16,0 km/l em estrada",
      portas: "4 portas",
      tracao: "Dianteira",
    },
    status: "disponivel",
    destaque: false,
    financiamento: { entradaMinima: 21870, parcelas: [24, 36, 48, 60], taxaIndicativa: 1.79 },
    seoDescription:
      "Chevrolet Onix LTZ 2022 usado em Campos dos Goytacazes, RJ, com câmbio manual e 38 mil km.",
  },
  {
    id: "cb500f",
    categoria: "motos",
    marca: "Honda",
    modelo: "CB 500F",
    ano: 2022,
    km: 21000,
    preco: 34900,
    cambio: "Manual, 6 marchas",
    combustivel: "Gasolina",
    cilindrada: "500 cc",
    tipo: "Naked",
    imagem: "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2022%2F10%2Fhonda-cb-500f-2022-cb-500f-108030-luegwn.jpg&w=810&zc=1",
    imagens: [
      "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2022%2F10%2Fhonda-cb-500f-2022-cb-500f-108030-luegwn.jpg&w=810&zc=1",
      "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2022%2F10%2Fhonda-cb-500f-2022-cb-500f-108030-hjqxuf.jpg&w=810&zc=1",
      "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2022%2F10%2Fhonda-cb-500f-2022-cb-500f-108030-k00la7.jpg&w=810&zc=1",
    ],
    descricao:
      "Honda CB 500F para quem busca uma naked equilibrada, com desempenho suficiente para estrada e facilidade para o uso urbano.",
    equipamentos: [
      "Painel digital",
      "Freios ABS",
      "Iluminação em LED",
      "Embreagem assistida e deslizante",
      "Suspensão dianteira telescópica",
      "Rodas de liga leve",
    ],
    fichaTecnica: {
      motor: "471 cc, bicilíndrico, 4 tempos",
      potencia: "50,2 cv",
      torque: "4,54 kgfm",
      desempenho: "Velocidade máxima aproximada de 180 km/h",
      consumo: "Até 27 km/l em uso misto",
      tracao: "Corrente",
    },
    status: "disponivel",
    destaque: true,
    financiamento: { entradaMinima: 10470, parcelas: [24, 36, 48], taxaIndicativa: 1.89 },
    seoDescription:
      "Honda CB 500F 2022 usada em Campos dos Goytacazes, RJ, com 21 mil km e 500 cc.",
  },
  {
    id: "mt03",
    categoria: "motos",
    marca: "Yamaha",
    modelo: "MT-03",
    ano: 2023,
    km: 17000,
    preco: 31900,
    cambio: "Manual, 6 marchas",
    combustivel: "Gasolina",
    cilindrada: "321 cc",
    tipo: "Naked",
    imagem: "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2023%2F01%2Fyamaha-mt-03-abs-2023-mt-03-abs-gasolina-111152-4g6qfz.jpg&w=810&zc=1",
    imagens: [
      "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2023%2F01%2Fyamaha-mt-03-abs-2023-mt-03-abs-gasolina-111152-4g6qfz.jpg&w=810&zc=1",
      "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2023%2F01%2Fyamaha-mt-03-abs-2023-mt-03-abs-gasolina-111152-dwxbsq.jpg&w=810&zc=1",
      "https://carango.com.br/f.php?cc=0&h=520&src=upload%2Fver31%2Fveiculos%2F2023%2F01%2Fyamaha-mt-03-abs-2023-mt-03-abs-gasolina-111152-m9u1na.jpg&w=810&zc=1",
    ],
    descricao:
      "Yamaha MT-03 com visual marcante, baixa quilometragem e conjunto ágil. Uma naked versátil para deslocamentos urbanos e passeios de fim de semana.",
    equipamentos: [
      "Painel digital",
      "Freios ABS",
      "Iluminação em LED",
      "Suspensão dianteira invertida",
      "Rodas de liga leve",
      "Embreagem assistida",
    ],
    fichaTecnica: {
      motor: "321 cc, bicilíndrico, 4 tempos",
      potencia: "42 cv",
      torque: "3,0 kgfm",
      desempenho: "Velocidade máxima aproximada de 170 km/h",
      consumo: "Até 28 km/l em uso misto",
      tracao: "Corrente",
    },
    status: "disponivel",
    destaque: false,
    financiamento: { entradaMinima: 9570, parcelas: [24, 36, 48], taxaIndicativa: 1.89 },
    seoDescription:
      "Yamaha MT-03 2023 usada em Campos dos Goytacazes, RJ, com 17 mil km e 321 cc.",
  },
];

export function obterTituloVeiculo(veiculo: Veiculo) {
  return `${veiculo.marca} ${veiculo.modelo}${veiculo.versao ? ` ${veiculo.versao}` : ""}`;
}
