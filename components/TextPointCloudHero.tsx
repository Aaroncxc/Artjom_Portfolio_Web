'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface TextPointCloudHeroProps {
  onReady?: () => void;
}

export function TextPointCloudHero({ onReady }: TextPointCloudHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Call onReady after a short delay to ensure component is visible
    const timer = setTimeout(() => {
      onReady?.();
    }, 100);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <>
      <Script 
        src="/text-pointcloud.js" 
        strategy="afterInteractive"
        onLoad={() => {
          scriptLoaded.current = true;
        }}
      />
      
      <section 
        ref={containerRef}
        className="relative z-[1] w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* The text pointcloud web component */}
        <text-pointcloud
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
          }}
          preset={JSON.stringify({
            text: "multikunst",
            fontSize: 300,
            letterSpacing: -20,
            weight: 700,
            spacing: 2,
            pointSize: 1,
            color: "#1C1C1C",
            bg: "transparent",
            centerMode: "center",
            radius: 200,
            strength: 10.0,
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
          })}
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
