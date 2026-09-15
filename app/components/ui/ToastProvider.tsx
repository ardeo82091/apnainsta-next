"use client"

import { createContext, ReactNode, useContext, useState } from "react"

type Toast = { text: string; kind: "success" | "error" }
const ToastContext = createContext<(text: string, kind?: Toast["kind"]) => void>(() => undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null)
  const showToast = (text: string, kind: Toast["kind"] = "success") => {
    setToast({ text, kind })
    window.setTimeout(() => setToast(null), 3500)
  }
  return <ToastContext.Provider value={showToast}>{children}{toast && <div role="status" className={`fixed right-4 top-4 z-[100] rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.kind === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.text}</div>}</ToastContext.Provider>
}

export const useToast = () => useContext(ToastContext)
