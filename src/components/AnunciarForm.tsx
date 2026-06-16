"use client";

import {
  brazilianStates,
  listingCategories,
  type ListingCategory,
} from "@/data/listing-form";
import { useState } from "react";

type FormState = {
  title: string;
  category: ListingCategory | "";
  description: string;
  price: string;
  city: string;
  state: string;
};

const initialForm: FormState = {
  title: "",
  category: "",
  description: "",
  price: "",
  city: "",
  state: "",
};

const inputClassName =
  "w-full rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-yellow-300";

const labelClassName = "mb-1.5 block text-sm font-semibold text-gray-800";

export default function AnunciarForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitted(false);
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPhoto(file);
    setSubmitted(false);

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Ex.: Bicicleta MTB 29&quot; alumínio"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClassName}>
            Categoria
          </label>
          <select
            id="category"
            required
            value={form.category}
            onChange={(e) =>
              updateField("category", e.target.value as ListingCategory)
            }
            className={inputClassName}
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {listingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Descrição
          </label>
          <textarea
            id="description"
            required
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
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="0,00"
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
          <label htmlFor="photo" className={labelClassName}>
            Foto do anúncio
          </label>
          <div className="rounded-xl border-2 border-dashed border-yellow-400 bg-gradient-to-br from-emerald-50 to-yellow-50 p-5">
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
            />
            <p className="mt-2 text-xs text-gray-500">
              Formatos aceitos: JPG, PNG ou WebP. Tamanho máximo recomendado: 5
              MB.
            </p>
            {photoPreview && (
              <div className="mt-4 overflow-hidden rounded-lg border border-emerald-200 bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Pré-visualização da foto do anúncio"
                  className="mx-auto max-h-56 w-full object-contain"
                />
                {photo && (
                  <p className="mt-2 truncate text-center text-xs text-gray-500">
                    {photo.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {submitted && (
          <div
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            role="status"
          >
            Anúncio &quot;{form.title}&quot; pronto para publicação! Em breve
            você poderá concluir o cadastro com pagamento.
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-600 to-yellow-400 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          Publicar anúncio
        </button>
      </div>
    </form>
  );
}
