"use client";

import Image from "next/image";
import { useState } from "react";

type AnuncioGalleryProps = {
  photos: string[];
  title: string;
};

export default function AnuncioGallery({ photos, title }: AnuncioGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-yellow-100 text-7xl">
        🚲
      </div>
    );
  }

  const hasMultiple = photos.length > 1;

  function goTo(index: number) {
    setActiveIndex((index + photos.length) % photos.length);
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-yellow-100 shadow-sm">
        <Image
          src={photos[activeIndex]}
          alt={`${title} — foto ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-400 bg-blue-950/90 text-lg font-bold text-yellow-100 shadow-md transition hover:bg-blue-900"
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-400 bg-blue-950/90 text-lg font-bold text-yellow-100 shadow-md transition hover:bg-blue-900"
              aria-label="Próxima foto"
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-emerald-800/90 px-3 py-1 text-xs font-semibold text-white">
              {activeIndex + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                index === activeIndex
                  ? "border-yellow-400 ring-2 ring-emerald-600"
                  : "border-emerald-200 opacity-80 hover:opacity-100"
              }`}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <Image
                src={photo}
                alt={`${title} — miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
