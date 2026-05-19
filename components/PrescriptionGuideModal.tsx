"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
};

export default function PrescriptionGuideModal({ onClose }: Props) {
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col my-8"
        style={{
          animation: "guideModalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          maxHeight: "min(95vh, 760px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#edeef3]">
          <h2
            className="text-[#003d9b] text-center flex-1 pr-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            Kontakt Lens Reçetesi Nasıl Okunur?
          </h2>
          <button
            onClick={onClose}
            className="text-[#737685] hover:text-[#191c1e] hover:bg-[#edeef3] rounded-full transition-colors flex items-center justify-center shrink-0"
            style={{ width: "32px", height: "32px" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Örnek Reçete Değerleri Kartı */}
          <div className="border border-[#edeef3] rounded-xl p-5 bg-[#fafbfc]">
            <h3
              className="text-[#191c1e] mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", fontWeight: 700 }}
            >
              Örnek Reçete Değerleri
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ fontSize: "13px" }}>
                <thead>
                  <tr className="border-b border-[#edeef3] text-[#737685]">
                    <th className="py-2.5 font-semibold">Göz</th>
                    <th className="py-2.5 font-semibold text-center">BC</th>
                    <th className="py-2.5 font-semibold text-center">DIA</th>
                    <th className="py-2.5 font-semibold text-center">SPH</th>
                    <th className="py-2.5 font-semibold text-center">CYL</th>
                    <th className="py-2.5 font-semibold text-center">AKS</th>
                    <th className="py-2.5 font-semibold text-center">ADD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edeef3] text-[#191c1e] font-medium">
                  <tr>
                    <td className="py-3 text-[#434654] font-bold">SAĞ (OD)</td>
                    <td className="py-3 text-center">8.60</td>
                    <td className="py-3 text-center">14.50</td>
                    <td className="py-3 text-center">-3.00</td>
                    <td className="py-3 text-center">-0.75</td>
                    <td className="py-3 text-center">90</td>
                    <td className="py-3 text-center text-[#e3000f] font-bold">High</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-[#434654] font-bold">SOL (OS)</td>
                    <td className="py-3 text-center">8.60</td>
                    <td className="py-3 text-center">14.50</td>
                    <td className="py-3 text-center">-4.50</td>
                    <td className="py-3 text-center">-1.25</td>
                    <td className="py-3 text-center">170</td>
                    <td className="py-3 text-center text-[#e3000f] font-bold">High</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-right text-[#737685] mt-3" style={{ fontSize: "11px", fontStyle: "italic" }}>
              * Örnek değerlerdir.
            </p>
          </div>

          {/* Açıklama Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SPH */}
            <div className="border border-[#edeef3] rounded-xl p-4 flex flex-col gap-2.5 bg-white hover:border-[#ff9900]/30 hover:bg-[#fffcf7] transition-all">
              <span
                className="self-start text-white px-2.5 py-0.5 rounded-[0.25rem] font-extrabold uppercase"
                style={{ background: "#ff9900", fontSize: "10px", letterSpacing: "0.04em" }}
              >
                SPH (PWR)
              </span>
              <div>
                <h4 className="text-[#191c1e] font-bold" style={{ fontSize: "13.5px" }}>Göz Derecesi</h4>
                <p className="text-[#737685] mt-1" style={{ fontSize: "12px", lineHeight: "18px" }}>
                  Miyop (-) veya Hipermetrop (+) görme bozukluğunun derecesini belirtir.
                </p>
              </div>
            </div>

            {/* CYL & AKS */}
            <div className="border border-[#edeef3] rounded-xl p-4 flex flex-col gap-2.5 bg-white hover:border-[#6a1a7a]/30 hover:bg-[#fcf7fc] transition-all">
              <span
                className="self-start text-white px-2.5 py-0.5 rounded-[0.25rem] font-extrabold uppercase"
                style={{ background: "#6a1a7a", fontSize: "10px", letterSpacing: "0.04em" }}
              >
                CYL & AKS
              </span>
              <div>
                <h4 className="text-[#191c1e] font-bold" style={{ fontSize: "13.5px" }}>Astigmat</h4>
                <p className="text-[#737685] mt-1" style={{ fontSize: "12px", lineHeight: "18px" }}>
                  Astigmatizma gücünü (CYL) ve bu düzeltmenin yapılacağı açıyı (AKS) ifade eder.
                </p>
              </div>
            </div>

            {/* BC */}
            <div className="border border-[#edeef3] rounded-xl p-4 flex flex-col gap-2.5 bg-white hover:border-[#003d9b]/30 hover:bg-[#f7fafe] transition-all">
              <span
                className="self-start text-white px-2.5 py-0.5 rounded-[0.25rem] font-extrabold uppercase"
                style={{ background: "#003d9b", fontSize: "10px", letterSpacing: "0.04em" }}
              >
                BC
              </span>
              <div>
                <h4 className="text-[#191c1e] font-bold" style={{ fontSize: "13.5px" }}>Temel Eğri (Base Curve)</h4>
                <p className="text-[#737685] mt-1" style={{ fontSize: "12px", lineHeight: "18px" }}>
                  Lensin arka yüzeyinin eğrilik yarıçapıdır; gözün kornea tabakasına oturma bombesini gösterir.
                </p>
              </div>
            </div>

            {/* DIA */}
            <div className="border border-[#edeef3] rounded-xl p-4 flex flex-col gap-2.5 bg-white hover:border-[#008033]/30 hover:bg-[#f7fdf9] transition-all">
              <span
                className="self-start text-white px-2.5 py-0.5 rounded-[0.25rem] font-extrabold uppercase"
                style={{ background: "#008033", fontSize: "10px", letterSpacing: "0.04em" }}
              >
                DIA
              </span>
              <div>
                <h4 className="text-[#191c1e] font-bold" style={{ fontSize: "13.5px" }}>Çap (Diameter)</h4>
                <p className="text-[#737685] mt-1" style={{ fontSize: "12px", lineHeight: "18px" }}>
                  Lensin dış kenardan dış kenara olan toplam genişliğidir, milimetre cinsinden ölçülür.
                </p>
              </div>
            </div>

            {/* ADD */}
            <div className="border border-[#edeef3] rounded-xl p-4 flex flex-col gap-2.5 bg-white hover:border-[#e3000f]/30 hover:bg-[#fef8f8] sm:col-span-2 transition-all">
              <span
                className="self-start text-white px-2.5 py-0.5 rounded-[0.25rem] font-extrabold uppercase"
                style={{ background: "#e3000f", fontSize: "10px", letterSpacing: "0.04em" }}
              >
                ADD
              </span>
              <div>
                <h4 className="text-[#191c1e] font-bold" style={{ fontSize: "13.5px" }}>Yakın Görüş (Addition)</h4>
                <p className="text-[#737685] mt-1" style={{ fontSize: "12px", lineHeight: "18px" }}>
                  Presbiyopi (yaşa bağlı yakın görememe) için tasarlanmış multifokal lenslerdeki yakın okuma ilavesidir. Genellikle Low, Medium, High şeklinde derecelendirilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes guideModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
