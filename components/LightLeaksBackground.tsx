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
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        reduced ? "" : "leaks-animate",
      ].join(" ")}
    >
      {/* Base pearl gradient */}
      <div className="absolute inset-0 pearl-base" />

      {/* Light leaks blobs */}
      <div className="absolute -top-40 -left-40 h-[70vh] w-[70vh] leaks-blob leaks-a" />
      <div className="absolute top-[10vh] -right-56 h-[80vh] w-[80vh] leaks-blob leaks-b" />
      <div className="absolute -bottom-56 left-[20vw] h-[85vh] w-[85vh] leaks-blob leaks-c" />

      {/* Bottom-up lava glow — soft morphing wash */}
      <div className="lava-layer absolute inset-x-0 bottom-0 h-[72vh]">
        <div className="lava-orb lava-orb-a absolute -bottom-[8%] left-[4%] h-[58vh] w-[58vh]" />
        <div className="lava-orb lava-orb-b absolute -bottom-[10%] left-[32%] h-[62vh] w-[50vh]" />
        <div className="lava-orb lava-orb-c absolute -bottom-[6%] right-[2%] h-[54vh] w-[56vh]" />
        <div className="lava-rise absolute inset-0" />
      </div>

      {/* Soft vignette to keep it premium */}
      <div className="absolute inset-0 leaks-vignette" />
    </div>
  );
}
