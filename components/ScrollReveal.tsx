"use client";
import { useEffect, useRef, useState, ReactNode } from "react";

type Variant = "up" | "left" | "right" | "scale" | "fade";

// Küçük hareket + hafif scale — daha zarif görünüm
const hidden: Record<Variant, { opacity: number; transform: string }> = {
  up:    { opacity: 0, transform: "translateY(22px) scale(0.985)" },
  left:  { opacity: 0, transform: "translateX(-26px) scale(0.985)" },
  right: { opacity: 0, transform: "translateX(26px) scale(0.985)" },
  scale: { opacity: 0, transform: "scale(0.96)" },
  fade:  { opacity: 0, transform: "scale(0.995)" },
};

const visible = { opacity: 1, transform: "none" };

// expo-out: hızlı başlar, yumuşak yavaşlar
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const DURATION = 900; // ms

type Props = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
  threshold?: number;
};

export default function ScrollReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  threshold = 0.08,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const state = isVisible ? visible : hidden[variant];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: state.opacity,
        transform: state.transform,
        transition: isVisible
          ? `opacity ${DURATION}ms ${EASING} ${delay}ms, transform ${DURATION}ms ${EASING} ${delay}ms`
          : "none",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
