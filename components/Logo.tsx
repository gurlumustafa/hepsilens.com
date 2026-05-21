import React from 'react';
import Image from 'next/image';

export default function Logo({ className = "", scale = 1, theme = "light" }: { className?: string, scale?: number, theme?: "light" | "dark" }) {
  // SVG'nin orijinal viewBox'ı (340 500 2160 440) kırpıldığı için en boy oranı ~4.91'dir.
  // 180px genişlik ve 37px yükseklik (oran ~4.86) mükemmel bir yerleşim sunar.
  // transform: scale() yerine doğrudan Image bileşeninin genişlik ve yüksekliğini scale ile çarparak
  // DOM yerleşiminde boşluk kalmasını engelliyoruz.
  const width = Math.round(210 * scale);
  const height = Math.round(37 * scale);

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.svg"
        alt="HepsiLens Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </div>
  );
}
