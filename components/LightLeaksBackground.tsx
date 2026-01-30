"use client";

import React, { useEffect, useState } from "react";

export default function LightLeaksBackground() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={[
        "fixed inset-0 z-0 pointer-events-none overflow-hidden",
        reduced ? "" : "leaks-animate",
      ].join(" ")}
    >
      {/* Base pearl gradient */}
      <div className="absolute inset-0 pearl-base" />

      {/* Light leaks blobs */}
      <div className="absolute -top-40 -left-40 h-[70vh] w-[70vh] leaks-blob leaks-a" />
      <div className="absolute top-[10vh] -right-56 h-[80vh] w-[80vh] leaks-blob leaks-b" />
      <div className="absolute -bottom-56 left-[20vw] h-[85vh] w-[85vh] leaks-blob leaks-c" />

      {/* Soft vignette to keep it premium */}
      <div className="absolute inset-0 leaks-vignette" />
    </div>
  );
}
