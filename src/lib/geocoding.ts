const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "WebBikesBrasil/1.0 (https://www.webbikesbrasil.com)";

export type Coordenadas = {
  latitude: number;
  longitude: number;
};

/**
 * Converte um endereço/cidade em coordenadas (latitude/longitude) usando o
 * serviço gratuito Nominatim (OpenStreetMap). Retorna null se não encontrar
 * ou se der algum erro — nunca lança exceção, para não travar a publicação
 * de um anúncio nem a busca por causa de um serviço externo fora do ar.
 */
export async function geocodificarEndereco(
  texto: string,
): Promise<Coordenadas | null> {
  const query = texto.trim();
  if (!query) return null;

  try {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "br");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "pt-BR",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as Array<{ lat: string; lon: string }>;
    const first = data[0];
    if (!first) return null;

    const latitude = Number(first.lat);
    const longitude = Number(first.lon);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

    return { latitude, longitude };
  } catch (error) {
    console.error("[geocodificarEndereco]", error);
    return null;
  }
}

/** Distância aproximada em km entre duas coordenadas (fórmula de Haversine). */
export function distanciaEmKm(a: Coordenadas, b: Coordenadas): number {
  const raioTerraKm = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return raioTerraKm * c;
}

function toRad(graus: number): number {
  return (graus * Math.PI) / 180;
}
