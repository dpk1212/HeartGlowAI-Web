/**
 * Utility functions for the HeartGlow Dashboard application
 */

/**
 * Get a route with the base path prepended if needed
 * This ensures all links work correctly in the application
 * and avoids issues with double dashboard paths or missing dashboard paths
 * 
 * @param route The route to get with base path
 * @returns The route, potentially unmodified if no base path logic is needed
 */
export function getRouteWithBasePath(route: string): string {
  // No basePath needed anymore, but keep check for external routes
  if (route.startsWith('http')) {
    return route;
  }
  
  // Return the route as is for internal paths
  return route;
}

/**
 * Safely navigate to a route, ensuring the base path is correct
 * @param route The route to navigate to
 * @param options Optional window.location options
 */
export function navigateTo(route: string, options?: { replace?: boolean }): void {
  const path = getRouteWithBasePath(route);
  
  if (options?.replace) {
    window.location.replace(path);
  } else {
    window.location.href = path;
  }
}

// Export other utility functions as needed 