'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface TextPointCloudHeroProps {
  onReady?: () => void;
}

// Scale text to 92% of viewport width: "multikunst" width ~ fontSize * 5.5
function getResponsivePreset() {
  if (typeof window === 'undefined') {
    return { fontSize: 260, letterSpacing: -9, radius: 90, pointSize: 1, strength: 9 };
  }
  const w = window.innerWidth;
  const maxFontSize = Math.min(240, (w * 0.92) / 5.5);
  const fontSize = Math.max(48, Math.round(maxFontSize));
  const letterSpacing = Math.round(-fontSize * 0.065);
  const radius = Math.max(50, Math.round(fontSize * 0.65));
  const pointSize = w < 400 ? 0.75 : 1;
  const strength = w < 640 ? 8 : 9;
  return { fontSize, letterSpacing, radius, pointSize, strength };
}

export function TextPointCloudHero({ onReady }: TextPointCloudHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const [presetOverrides, setPresetOverrides] = useState(() => getResponsivePreset());

  useEffect(() => {
    const timer = setTimeout(() => onReady?.(), 100);
    return () => clearTimeout(timer);
  }, [onReady]);

  useEffect(() => {
    const update = () => setPresetOverrides(getResponsivePreset());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const preset = {
    text: "multikunst",
    ...presetOverrides,
    weight: 700,
    spacing: 2,
    color: "#1C1C1C",
    bg: "transparent",
    centerMode: "center",
    drag: 2,
    noise: 0.5,
    returnForce: 0.02,
    damping: 0.80,
    pressOnly: false,
    gravityStrength: 0.8,
    gravityOnClick: true,
    showSolidWhenIdle: true,
    transitionSpeed: 0.2,
    burstStrength: 70,
  };

  return (
    <>
      <Script 
        src="/text-pointcloud.js" 
        strategy="afterInteractive"
        onLoad={() => { scriptLoaded.current = true; }}
      />
      
      <section 
        ref={containerRef}
        className="relative z-[1] w-full h-screen flex items-center justify-center overflow-hidden"
      >
        <text-pointcloud
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
          }}
          preset={JSON.stringify(preset)}
        />
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="text-xs text-mk-text-muted tracking-widest uppercase">
            Scroll to explore
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-[rgba(28,28,28,0.2)] flex justify-center pt-2">
            <div 
              className="w-1.5 h-1.5 rounded-full bg-[rgba(28,28,28,0.4)] animate-bounce"
              style={{ animationDuration: '1.5s' }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'text-pointcloud': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          preset?: string;
          text?: string;
        },
        HTMLElement
      >;
    }
  }
}
