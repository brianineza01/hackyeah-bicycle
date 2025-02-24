import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Decode an x,y or x,y,z encoded polyline
 * @param {*} encodedPolyline
 * @param {Boolean} includeElevation - true for x,y,z polyline
 * @returns {Array} of coordinates
 */
export const decodePolyline = (
  encodedPolyline: string,
  includeElevation: boolean
): [number, number, number][] => {
  // array that holds the points
  const points: [number, number, number][] = [];
  let index = 0;
  const len = encodedPolyline.length;
  let lat = 0;
  let lng = 0;
  let ele = 0;
  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encodedPolyline.charAt(index++).charCodeAt(0) - 63; // finds ascii
      // and subtract it by 63
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    lat += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      b = encodedPolyline.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;

    if (includeElevation) {
      shift = 0;
      result = 0;
      do {
        b = encodedPolyline.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      ele += (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    }
    try {
      const location = [lat / 1e5, lng / 1e5];
      if (includeElevation) location.push(ele / 100);
      points.push(location as [number, number, number]);
    } catch (e) {
      console.log(e);
    }
  }
  return points;
};
