import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Função utilitária para combinar classes CSS com Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
