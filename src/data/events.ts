export type EventCategory =
  | "Campeonato"
  | "Feira"
  | "Lançamento"
  | "Workshop";

export type BikeEvent = {
  id: string;
  title: string;
  date: string;
  city: string;
  category: EventCategory;
};

export const eventCategories: EventCategory[] = [
  "Campeonato",
  "Feira",
  "Lançamento",
  "Workshop",
];

export const events: BikeEvent[] = [
  {
    id: "1",
    title: "Copa Brasil de MTB",
    date: "15/07/2026",
    city: "São Paulo",
    category: "Campeonato",
  },
  {
    id: "2",
    title: "Feira Bike Brasil",
    date: "20/08/2026",
    city: "Rio de Janeiro",
    category: "Feira",
  },
  {
    id: "3",
    title: "Lançamento Caloi 2027",
    date: "10/09/2026",
    city: "Curitiba",
    category: "Lançamento",
  },
];
