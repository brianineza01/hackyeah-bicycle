import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define the type for the coordinates
interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

// Async function to get geolocation
export async function getGeolocation(): Promise<GeolocationCoords> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('Failed to get geolocation:', error);
          reject(new Error('Failed to get geolocation'));
        }
      );
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
}

