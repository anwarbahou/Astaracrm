import React from 'react';

export const GlassButton = () => {
  return (
    <>
      {/* Filters */}
      <svg style={{ display: 'none' }}>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="0.02" result="blur" />
          <feDisplacementMap in="SourceGraphic" in2="blur" scale="77" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="btn-glass" primitiveUnits="objectBoundingBox">
          <feImage
            href="data:image/png;base64,...(your base64 PNG here)..."
            x="0"
            y="0"
            width="1"
            height="1"
            result="map"
          />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
          <feDisplacementMap in="blur" in2="map" scale="1" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Glass container */}
      <div className="relative w-[300px] h-[200px] rounded-[30px] flex items-center justify-center">
        {/* Glass container effect */}
        <div className="absolute inset-0 z-0 rounded-[30px] shadow-[inset_2px_2px_0px_-2px_rgba(255,255,255,0.7),inset_0_0_3px_1px_rgba(255,255,255,0.7)]" />
        <div
          className="absolute inset-0 -z-10 rounded-[30px] backdrop-blur-none filter overflow-hidden"
          style={{ filter: 'url(#container-glass)' }}
        />

        {/* Glass button */}
        <button
          type="button"
          className="relative z-10 w-[70px] h-[70px] p-[15px] rounded-full flex items-center justify-center bg-transparent border-none outline-none cursor-pointer"
        >
          <div className="absolute inset-0 rounded-full shadow-[inset_2px_2px_0px_-2px_rgba(255,255,255,0.7),inset_0_0_3px_1px_rgba(255,255,255,0.7)] bg-white/10" />
          <div
            className="absolute inset-0 -z-10 rounded-full backdrop-blur-none filter overflow-hidden"
            style={{ filter: 'url(#btn-glass)' }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>
    </>
  );
};
