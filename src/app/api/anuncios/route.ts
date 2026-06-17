import { NextResponse } from "next/server";
import {
  hasSubcategories,
  isValidSubcategory,
  listingTypes,
  type ListingType,
} from "@/data/listing-form";
import {
  ANUNCIOS_STORAGE_BUCKET,
  createSupabaseAdmin,
  isSupabaseConfigured,
  type AnuncioRow,
} from "@/lib/supabase/server";
import { isValidBrazilianPhone, parseBrazilianPhone } from "@/lib/phone";

export const runtime = "nodejs";

const validTypes = new Set<string>(listingTypes);

const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

async function uploadPhoto(file: File): Promise<string> {
  const supabase = createSupabaseAdmin();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filePath = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(ANUNCIOS_STORAGE_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erro ao enviar foto: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from(ANUNCIOS_STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

function validatePhoto(file: File, index: number): string | null {
  if (!file.type.startsWith("image/")) {
    return `A foto ${index + 1} deve ser uma imagem (JPG, PNG ou WebP).`;
  }

  if (file.size > MAX_PHOTO_SIZE) {
    return `A foto ${index + 1} deve ter no máximo 5 MB.`;
  }

  return null;
}

async function uploadPhotos(files: File[]): Promise<[string | null, string | null, string | null]> {
  const urls = await Promise.all(files.map((file) => uploadPhoto(file)));

  return [urls[0] ?? null, urls[1] ?? null, urls[2] ?? null];
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase não configurado. Verifique o .env.local." },
        { status: 503 },
      );
    }

    const formData = await request.formData();

    const titulo = String(formData.get("titulo") ?? "").trim();
    const categoria = String(formData.get("categoria") ?? "").trim();
    const subcategoriaRaw = String(formData.get("subcategoria") ?? "").trim();
    const descricao = String(formData.get("descricao") ?? "").trim();
    const precoRaw = String(formData.get("preco") ?? "").trim();
    const cidade = String(formData.get("cidade") ?? "").trim();
    const estado = String(formData.get("estado") ?? "").trim().toUpperCase();
    const whatsappRaw = String(formData.get("whatsapp") ?? "").trim();
    const fotos = formData
      .getAll("fotos")
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (!titulo || !categoria || !descricao || !precoRaw || !cidade || !estado || !whatsappRaw) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 },
      );
    }

    const whatsapp = parseBrazilianPhone(whatsappRaw);
    if (!isValidBrazilianPhone(whatsapp)) {
      return NextResponse.json(
        { error: "Informe um WhatsApp válido com DDD. Ex.: (19) 99999-9999" },
        { status: 400 },
      );
    }

    if (!validTypes.has(categoria)) {
      return NextResponse.json(
        { error: "Tipo de anúncio inválido." },
        { status: 400 },
      );
    }

    const tipo = categoria as ListingType;
    const subcategoria = subcategoriaRaw || null;

    if (hasSubcategories(tipo)) {
      if (!subcategoria) {
        return NextResponse.json(
          { error: "Selecione uma subcategoria." },
          { status: 400 },
        );
      }

      if (!isValidSubcategory(tipo, subcategoria)) {
        return NextResponse.json(
          { error: "Subcategoria inválida." },
          { status: 400 },
        );
      }
    }

    const preco = Number(precoRaw);
    if (Number.isNaN(preco) || preco < 0) {
      return NextResponse.json({ error: "Preço inválido." }, { status: 400 });
    }

    if (fotos.length > MAX_PHOTOS) {
      return NextResponse.json(
        { error: `Envie no máximo ${MAX_PHOTOS} fotos.` },
        { status: 400 },
      );
    }

    for (let index = 0; index < fotos.length; index++) {
      const photoError = validatePhoto(fotos[index], index);
      if (photoError) {
        return NextResponse.json({ error: photoError }, { status: 400 });
      }
    }

    const [fotoUrl, fotoUrl2, fotoUrl3] =
      fotos.length > 0 ? await uploadPhotos(fotos) : [null, null, null];

    const row: AnuncioRow = {
      titulo,
      categoria: tipo,
      subcategoria,
      descricao,
      preco,
      cidade,
      estado,
      foto_url: fotoUrl,
      foto_url2: fotoUrl2,
      foto_url3: fotoUrl3,
      whatsapp,
    };

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("anuncios")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      console.error("[api/anuncios]", error);
      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "development"
              ? `Erro ao salvar anúncio: ${error.message}`
              : "Erro ao salvar anúncio.",
        },
        { status: 500 },
      );
    }

    if (!data?.id) {
      return NextResponse.json(
        { error: "Anúncio salvo, mas o servidor não retornou o ID." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { id: data.id, message: "Anúncio publicado com sucesso!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/anuncios]", error);
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao publicar anúncio.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
