import imageCompression from "browser-image-compression";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

/** Tamanho máximo aceito do arquivo original (antes da compressão). */
export const MAX_ORIGINAL_PHOTO_SIZE = 20 * 1024 * 1024;

/** Tamanho máximo após compressão (alvo ~1.5 MB, limite duro 2 MB). */
export const MAX_COMPRESSED_PHOTO_SIZE = 2 * 1024 * 1024;
const TARGET_COMPRESSED_MB = 1.5;

export function isAllowedImageType(file: File): boolean {
  if (ALLOWED_TYPES.has(file.type)) return true;

  // Alguns browsers enviam type vazio; valida pela extensão.
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "webp";
}

function toCompressedFile(blob: Blob, originalName: string, mimeType: string): File {
  const baseName = originalName.replace(/\.[^.]+$/, "") || "foto";
  const extension =
    mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";

  return new File([blob], `${baseName}.${extension}`, {
    type: mimeType,
    lastModified: Date.now(),
  });
}

/**
 * Comprime a imagem no browser preservando boa qualidade.
 * Funciona para retrato e paisagem (limita o maior lado).
 */
export async function compressListingPhoto(file: File): Promise<File> {
  if (!isAllowedImageType(file)) {
    throw new Error("Cada foto deve ser uma imagem JPG, PNG ou WebP.");
  }

  if (file.size > MAX_ORIGINAL_PHOTO_SIZE) {
    throw new Error(
      `A foto "${file.name}" é muito grande. Envie imagens de até 20 MB; elas serão comprimidas automaticamente.`,
    );
  }

  // Já está dentro do alvo: não comprime de novo.
  if (file.size <= TARGET_COMPRESSED_MB * 1024 * 1024) {
    return file;
  }

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: TARGET_COMPRESSED_MB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      // Mantém orientação EXIF (retrato/paisagem) corretamente.
      preserveExif: false,
      initialQuality: 0.8,
      fileType: file.type === "image/png" ? "image/png" : "image/jpeg",
    });

    const mimeType = compressed.type || "image/jpeg";
    const result =
      compressed instanceof File
        ? compressed
        : toCompressedFile(compressed, file.name, mimeType);

    if (result.size > MAX_COMPRESSED_PHOTO_SIZE) {
      throw new Error(
        `Não foi possível reduzir a foto "${file.name}" o suficiente (ficou acima de 2 MB). Tente outra imagem ou uma resolução menor.`,
      );
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Não foi possível reduzir")) {
      throw error;
    }

    throw new Error(
      `Não foi possível comprimir a foto "${file.name}". Tente outro arquivo JPG, PNG ou WebP.`,
    );
  }
}
