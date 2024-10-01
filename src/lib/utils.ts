import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(date: Date) {
  
  const formattedDate = date.toLocaleString("en-US", {
    dayPeriod: "long",
    day: '2-digit',
    month: "long",
    weekday: 'long',
    hour12: true,
    hour: "numeric",
    year: "numeric",
    minute: "numeric",
  });

  return formattedDate;
}