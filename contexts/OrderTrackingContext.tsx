"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type OrderTrackingContextType = {
  open: boolean;
  prefillNo: string;
  openTracking: (trackingNo?: string) => void;
  closeTracking: () => void;
};

const OrderTrackingContext = createContext<OrderTrackingContextType | null>(null);

export function OrderTrackingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen]         = useState(false);
  const [prefillNo, setPrefill] = useState("");

  function openTracking(trackingNo = "") {
    setPrefill(trackingNo);
    setOpen(true);
  }

  function closeTracking() {
    setOpen(false);
  }

  return (
    <OrderTrackingContext.Provider value={{ open, prefillNo, openTracking, closeTracking }}>
      {children}
    </OrderTrackingContext.Provider>
  );
}

export function useOrderTracking() {
  const ctx = useContext(OrderTrackingContext);
  if (!ctx) throw new Error("useOrderTracking must be used within OrderTrackingProvider");
  return ctx;
}
