import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to prepend the basePath for programmatic routing
export const getRouteWithBasePath = (route: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/dashboard'; // Fallback to '/dashboard'
  // Ensure route starts with / and basePath doesn't end with /
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return `${cleanBasePath}${cleanRoute}`;
};
