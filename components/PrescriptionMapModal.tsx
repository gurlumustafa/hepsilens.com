"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
};

export default function PrescriptionMapModal({ onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(15, 18, 35, 0.70)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[950px] overflow-hidden relative flex flex-col my-8 border border-[#edeef3]"
        style={{
          animation: "mapModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          maxHeight: "min(95vh, 850px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#f8f9fb] text-[#737685] hover:bg-[#edeef3] hover:text-[#191c1e] rounded-xl transition-colors flex items-center justify-center shrink-0 z-10"
          style={{ width: "36px", height: "36px" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "22px", fontWeight: 700 }}>close</span>
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
          <div className="text-center w-full">
            <span className="bg-[#dae2ff] text-[#003d9b] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block">
              Okuma Rehberi
            </span>
            <h2
              className="text-[#003d9b]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", fontWeight: 800, letterSpacing: "0.02em" }}
            >
              KONTAKT LENS REÇETESİ
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            
            {/* Sol: Tablo */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="rounded-2xl overflow-hidden border border-[#edeef3] shadow-sm bg-white">
                <table className="w-full text-sm text-[#434654]">
                  <thead>
                    <tr className="bg-[#f8f9fb] border-b border-[#edeef3]">
                      <th className="p-3 text-left font-bold w-1/2 text-[#191c1e]">Değer</th>
                      <th className="p-3 font-bold text-center border-l border-[#edeef3] text-[#191c1e]">Sağ Göz</th>
                      <th className="p-3 font-bold text-center border-l border-[#edeef3] text-[#191c1e]">Sol Göz</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edeef3]">
                    <tr>
                      <td className="p-3 border-r border-[#edeef3]">
                        <div className="font-bold text-[#191c1e]">Tüm Çap</div>
                        <div className="mt-1">
                          <span className="inline-block bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide">DIA</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold border-r border-[#edeef3] bg-orange-50/20 text-[#191c1e]">14.20</td>
                      <td className="p-3 text-center font-bold bg-orange-50/20 text-[#191c1e]">14.20</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-[#edeef3]">
                        <div className="font-bold text-[#191c1e]">Temel Eğri</div>
                        <div className="mt-1">
                          <span className="inline-block bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide">BC</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold border-r border-[#edeef3] bg-rose-50/20 text-[#191c1e]">8.60</td>
                      <td className="p-3 text-center font-bold bg-rose-50/20 text-[#191c1e]">8.60</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-[#edeef3]">
                        <div className="font-bold text-[#191c1e]">Sferik</div>
                        <div className="mt-1">
                          <span className="inline-block bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide">SPH, PWR</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold border-r border-[#edeef3] bg-blue-50/20 text-[#191c1e]">-2.50</td>
                      <td className="p-3 text-center font-bold bg-blue-50/20 text-[#191c1e]">-2.50</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-[#edeef3]">
                        <div className="font-bold text-[#191c1e]">Astigmat</div>
                        <div className="mt-1">
                          <span className="inline-block bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide">CYL, Toric</span>
                        </div>
                      </td>
                      <td className="p-3 text-center border-r border-[#edeef3]"></td>
                      <td className="p-3 text-center"></td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-[#edeef3]">
                        <div className="font-bold text-[#191c1e]">Aks</div>
                        <div className="mt-1">
                          <span className="inline-block bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide">AX</span>
                        </div>
                      </td>
                      <td className="p-3 text-center border-r border-[#edeef3]"></td>
                      <td className="p-3 text-center"></td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-[#edeef3]">
                        <div className="font-bold text-[#191c1e]">Multifokal</div>
                        <div className="mt-1">
                          <span className="inline-block bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide">ADD</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold border-r border-[#edeef3] bg-teal-50/20 text-[#191c1e]">Medium</td>
                      <td className="p-3 text-center font-bold bg-teal-50/20 text-[#191c1e]">Medium</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sağ: Açıklamalar ve Dropdownlar */}
            <div className="w-full lg:w-[55%] flex flex-col justify-between space-y-8 lg:space-y-0">
              
              {/* Metin Açıklamaları */}
              <div className="space-y-3 text-[13.5px] leading-relaxed text-[#434654]">
                <div className="bg-[#f8f9fb] p-3 rounded-xl border border-[#edeef3] shadow-sm flex items-start gap-3">
                  <span className="shrink-0 bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded text-[11px] mt-0.5 w-11 text-center">DIA</span>
                  <p>Kontakt lensin mm cinsinden çapını belirtir.</p>
                </div>
                <div className="bg-[#f8f9fb] p-3 rounded-xl border border-[#edeef3] shadow-sm flex items-start gap-3">
                  <span className="shrink-0 bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded text-[11px] mt-0.5 w-11 text-center">BC</span>
                  <p>Gözün temel eğri (bombelik) değeridir. Doktorunuz tarafından ölçülür.</p>
                </div>
                <div className="bg-[#f8f9fb] p-3 rounded-xl border border-[#edeef3] shadow-sm flex items-start gap-3">
                  <span className="shrink-0 bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[11px] mt-0.5 w-11 text-center">SPH</span>
                  <p>Miyop (-) veya Hipermetrop (+) numarasıdır. Kutularda PWR da yazabilir.</p>
                </div>
                <div className="bg-[#f8f9fb] p-3 rounded-xl border border-[#edeef3] shadow-sm flex items-start gap-3">
                  <span className="shrink-0 bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded text-[11px] mt-0.5 w-11 text-center">ADD</span>
                  <p>Yakını görememe (Presbiyopi) için multifokal lenslerdeki ek büyütme kuvvetidir.</p>
                </div>
              </div>

              {/* Temsili Form / Dropdown'lar */}
              <div className="bg-[#f4f6fc] p-5 rounded-2xl border border-[#dae2ff]">
                <h3 className="text-[#003d9b] font-bold text-[13px] mb-4 text-center">Sitedeki Numara Seçim Formu</h3>
                <div className="flex flex-wrap gap-4 items-end justify-center">
                  {/* Dia */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">DIA</span>
                    <div className="border border-[#c3c6d6] rounded-lg px-3 py-2 flex items-center gap-2 bg-white text-sm w-20 justify-between shadow-sm text-[#191c1e] font-bold">
                      14.20
                      <span className="material-symbols-outlined text-[16px] text-[#737685]">expand_more</span>
                    </div>
                  </div>
                  {/* BC */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">BC</span>
                    <div className="border border-[#c3c6d6] rounded-lg px-3 py-2 flex items-center gap-2 bg-white text-sm w-20 justify-between shadow-sm text-[#191c1e] font-bold">
                      8.60
                      <span className="material-symbols-outlined text-[16px] text-[#737685]">expand_more</span>
                    </div>
                  </div>
                  {/* Sph */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">SPH (PWR)</span>
                    <div className="border border-[#003d9b] ring-1 ring-[#003d9b]/20 rounded-lg px-3 py-2 flex items-center gap-2 bg-white text-sm w-24 justify-between shadow-sm text-[#003d9b] font-bold">
                      -2.50
                      <span className="material-symbols-outlined text-[16px] text-[#003d9b]">expand_more</span>
                    </div>
                  </div>
                  {/* Add */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">ADD</span>
                    <div className="border border-[#c3c6d6] rounded-lg px-3 py-2 flex items-center gap-2 bg-white text-sm w-24 justify-between shadow-sm text-[#191c1e] font-bold">
                      Medium
                      <span className="material-symbols-outlined text-[16px] text-[#737685]">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mapModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
