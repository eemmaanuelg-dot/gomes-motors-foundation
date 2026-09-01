import imgCivic from "@/assets/veiculos/honda-civic-exl.jpg";
import imgCorolla from "@/assets/veiculos/toyota-corolla-gli.jpg";
import imgPolo from "@/assets/veiculos/vw-polo.jpg";
import imgOnix from "@/assets/veiculos/chevrolet-onix.jpg";
import imgCb500 from "@/assets/veiculos/honda-cb500f.jpg";
import imgMt03 from "@/assets/veiculos/yamaha-mt03.jpg";

export type CategoriaVeiculo = "carros" | "motos";

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
    imagem: imgCivic,
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
    imagem: imgCorolla,
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
    imagem: imgPolo,
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
    imagem: imgOnix,
  },
  {
    id: "cb500f",
    categoria: "motos",
    marca: "Honda",
    modelo: "CB 500F",
    ano: 2022,
    km: 21000,
    preco: 34900,
    cilindrada: "500 cc",
    tipo: "Naked",
    imagem: imgCb500,
  },
  {
    id: "mt03",
    categoria: "motos",
    marca: "Yamaha",
    modelo: "MT-03",
    ano: 2023,
    km: 17000,
    preco: 31900,
    cilindrada: "321 cc",
    tipo: "Naked",
    imagem: imgMt03,
  },
];
