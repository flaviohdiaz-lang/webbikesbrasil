export type BikeListing = {
  id: string;
  emoji: string;
  title: string;
  price: number;
  city: string;
  category: string;
};

export const listings: BikeListing[] = [
  {
    id: "1",
    emoji: "🚲",
    title: "Híbrida Cruiser Urbana",
    price: 450,
    city: "São Paulo",
    category: "Urbana",
  },
  {
    id: "2",
    emoji: "🏔️",
    title: "Mountain Trekker 29\"",
    price: 890,
    city: "Rio de Janeiro",
    category: "Montanha",
  },
  {
    id: "3",
    emoji: "🚴",
    title: "Road Racer Pro Carbono",
    price: 1200,
    city: "Belo Horizonte",
    category: "Estrada",
  },
  {
    id: "4",
    emoji: "⚡",
    title: "Bicicleta elétrica Commuter 500W",
    price: 1750,
    city: "Curitiba",
    category: "Elétrica",
  },
  {
    id: "5",
    emoji: "👶",
    title: "BMX infantil iniciante",
    price: 180,
    city: "Porto Alegre",
    category: "Infantil",
  },
  {
    id: "6",
    emoji: "🛤️",
    title: "Gravel Explorer Aventura",
    price: 950,
    city: "Florianópolis",
    category: "Gravel",
  },
];
