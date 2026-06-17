"use client";

import {
  brazilianStates,
  hasSubcategories,
  listingSubcategories,
  listingTypes,
  type ListingType,
} from "@/data/listing-form";
import {
  formatBrazilianCurrencyInput,
  parseBrazilianCurrency,
} from "@/lib/currency";
import {
  formatBrazilianPhoneInput,
  isValidBrazilianPhone,
  parseBrazilianPhone,
} from "@/lib/phone";
import { useState } from "react";

const MAX_PHOTOS = 3;

type FormState = {
  title: string;
  adType: ListingType | "";
  subcategory: string;
  description: string;
  price: string;
  city: string;
  state: string;
  whatsapp: string;
};

type PhotoItem = {
  file: File;
  preview: string;
};

const initialForm: FormState = {
  title: "",
  adType: "",
  subcategory: "",
  description: "",
  price: "",
  city: "",
  state: "",
  whatsapp: "",
};

const inputClassName =
  "w-full rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-yellow-300";

const labelClassName = "mb-1.5 block text-sm font-semibold text-gray-800";

export default function AnunciarForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateAdType(value: ListingType) {
    setForm((prev) => ({ ...prev, adType: value, subcategory: "" }));
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function clearPhotos() {
    photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    setPhotos([]);
  }

  function handlePhotosChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (selected.length === 0) return;

    setSuccessMessage(null);
    setErrorMessage(null);

    const availableSlots = MAX_PHOTOS - photos.length;
    if (availableSlots <= 0) {
      setErrorMessage(`Você pode enviar no máximo ${MAX_PHOTOS} fotos.`);
      return;
    }

    const nextFiles = selected.slice(0, availableSlots);
    const invalidFile = nextFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024,
    );

    if (invalidFile) {
      setErrorMessage(
        "Cada foto deve ser uma imagem (JPG, PNG ou WebP) de até 5 MB.",
      );
      return;
    }

    const newPhotos = nextFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.preview);
      return next;
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateField("price", formatBrazilianCurrencyInput(event.target.value));
  }

  function handleWhatsAppChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateField("whatsapp", formatBrazilianPhoneInput(event.target.value));
  }

  function resetForm() {
    setForm(initialForm);
    clearPhotos();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const precoNumerico = parseBrazilianCurrency(form.price);

      if (Number.isNaN(precoNumerico) || precoNumerico < 0) {
        throw new Error("Informe um preço válido.");
      }

      if (!isValidBrazilianPhone(form.whatsapp)) {
        throw new Error("Informe um WhatsApp válido. Ex.: (19) 99999-9999");
      }

      const formData = new FormData();
      formData.append("titulo", form.title);
      formData.append("categoria", form.adType);
      if (form.subcategory) {
        formData.append("subcategoria", form.subcategory);
      }
      formData.append("descricao", form.description);
      formData.append("preco", String(precoNumerico));
      formData.append("cidade", form.city);
      formData.append("estado", form.state);
      formData.append("whatsapp", parseBrazilianPhone(form.whatsapp));

      photos.forEach((photo) => {
        formData.append("fotos", photo.file);
      });

      const response = await fetch("/api/anuncios", {
        method: "POST",
        body: formData,
      });

      const raw = await response.text();
      let data: { message?: string; error?: string } = {};

      if (raw) {
        try {
          data = JSON.parse(raw) as { message?: string; error?: string };
        } catch {
          throw new Error("Resposta inválida do servidor.");
        }
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao publicar anúncio.");
      }

      setSuccessMessage(
        data.message ?? `Anúncio "${form.title}" publicado com sucesso!`,
      );
      resetForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro inesperado ao publicar.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg"
    >
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-yellow-400 px-6 py-5">
        <h2 className="text-xl font-bold text-white">Dados do anúncio</h2>
        <p className="mt-1 text-sm text-emerald-50">
          Preencha as informações do seu produto ou serviço
        </p>
      </div>

      <div className="space-y-5 p-6 sm:p-8">
        <div>
          <label htmlFor="title" className={labelClassName}>
            Título
          </label>
          <input
            id="title"
            type="text"
            required
            disabled={loading}
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder='Ex.: Bicicleta MTB 29" alumínio'
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="adType" className={labelClassName}>
              Tipo de anúncio
            </label>
            <select
              id="adType"
              required
              disabled={loading}
              value={form.adType}
              onChange={(e) => updateAdType(e.target.value as ListingType)}
              className={inputClassName}
            >
              <option value="" disabled>
                Selecione o tipo
              </option>
              {listingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subcategory" className={labelClassName}>
              Subcategoria
            </label>
            {form.adType && hasSubcategories(form.adType) ? (
              <select
                id="subcategory"
                required
                disabled={loading}
                value={form.subcategory}
                onChange={(e) => updateField("subcategory", e.target.value)}
                className={inputClassName}
              >
                <option value="" disabled>
                  Selecione a subcategoria
                </option>
                {listingSubcategories[form.adType].map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm text-gray-600">
                {form.adType
                  ? "Subcategoria não necessária para este tipo."
                  : "Selecione um tipo de anúncio primeiro."}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Descrição
          </label>
          <textarea
            id="description"
            required
            disabled={loading}
            rows={5}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Descreva o item, estado de conservação, marca, modelo..."
            className={`${inputClassName} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="price" className={labelClassName}>
            Preço
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-emerald-700">
              R$
            </span>
            <input
              id="price"
              type="text"
              inputMode="decimal"
              required
              disabled={loading}
              value={form.price}
              onChange={handlePriceChange}
              placeholder="2.500,00"
              className={`${inputClassName} pl-11`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={labelClassName}>
              Cidade
            </label>
            <input
              id="city"
              type="text"
              required
              disabled={loading}
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Ex.: São Paulo"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="state" className={labelClassName}>
              Estado
            </label>
            <select
              id="state"
              required
              disabled={loading}
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className={inputClassName}
            >
              <option value="" disabled>
                Selecione o estado
              </option>
              {brazilianStates.map(({ uf, name }) => (
                <option key={uf} value={uf}>
                  {name} ({uf})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="photos" className={labelClassName}>
            Fotos do anúncio ({photos.length}/{MAX_PHOTOS})
          </label>
          <div className="rounded-xl border-2 border-dashed border-yellow-400 bg-gradient-to-br from-emerald-50 to-yellow-50 p-5">
            <input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              disabled={loading || photos.length >= MAX_PHOTOS}
              onChange={handlePhotosChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700 disabled:opacity-60"
            />
            <p className="mt-2 text-xs text-gray-500">
              Até {MAX_PHOTOS} fotos. Formatos: JPG, PNG ou WebP. Máximo 5 MB
              cada.
            </p>

            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {photos.map((photo, index) => (
                  <div
                    key={photo.preview}
                    className="overflow-hidden rounded-lg border border-emerald-200 bg-white p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.preview}
                      alt={`Pré-visualização da foto ${index + 1}`}
                      className="h-40 w-full rounded-md object-cover"
                    />
                    <p className="mt-2 truncate text-center text-xs text-gray-500">
                      Foto {index + 1}: {photo.file.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      disabled={loading}
                      className="mt-2 w-full rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <div
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            role="status"
          >
            {successMessage}
          </div>
        )}

        <div>
          <label htmlFor="whatsapp" className={labelClassName}>
            Seu WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            inputMode="numeric"
            required
            disabled={loading}
            value={form.whatsapp}
            onChange={handleWhatsAppChange}
            placeholder="(19) 99999-9999"
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-600 to-yellow-400 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Publicando..." : "Publicar anúncio"}
        </button>
      </div>
    </form>
  );
}
