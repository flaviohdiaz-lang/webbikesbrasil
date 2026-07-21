"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "webbikes-promo-banner-dismissed";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setVisible(false);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  if (!mounted || !visible) {
    return null;
  }

  return (
    <div
      className="sticky top-0 z-50 w-full bg-emerald-900 text-white"
      role="region"
      aria-label="Promoção"
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-center px-10 py-2.5 sm:px-12">
        <p className="text-center text-xs leading-snug sm:text-sm sm:leading-normal">
          🚲{" "}
          <strong className="font-semibold">100% grátis até o fim do ano!</strong>{" "}
          Publique quantos anúncios quiser sem pagar nada. Essa é a hora de vender
          sua bike mais rápido.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 sm:right-3"
          aria-label="Fechar aviso"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
