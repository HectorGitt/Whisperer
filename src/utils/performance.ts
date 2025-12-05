/**
 * Performance measurement utilities
 * Requirements: 10.1, 10.2
 */

/**
 * Measure the render time of a component
 * @param componentName - Name of the component being measured
 * @returns A function to call when rendering is complete
 */
export function measureRenderTime(componentName: string): () => void {
  const start = performance.now();
  return () => {
    const end = performance.now();
    const duration = end - start;
    
    // Log warning if render takes more than one frame (16.67ms for 60fps)
    if (duration > 16.67) {
      console.warn(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms (target: <16.67ms for 60fps)`);
    } else {
      console.log(`[Performance] ${componentName} render took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  };
}

/**
 * Measure initial load performance
 * @returns The time taken for initial load in milliseconds
 */
export function measureInitialLoad(): number {
  const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (navigationTiming) {
    const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
    console.log(`[Performance] Initial load completed in ${loadTime.toFixed(2)}ms`);
    return loadTime;
  }
  
  return 0;
}

/**
 * Check if animations are running at 60fps
 * @param callback - Function to call with the FPS measurement
 */
export function measureAnimationFPS(callback: (fps: number) => void): () => void {
  let frameCount = 0;
  let lastTime = performance.now();
  let animationId: number;
  
  const measureFrame = () => {
    frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime;
    
    // Measure FPS every second
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount * 1000) / elapsed);
      callback(fps);
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    animationId = requestAnimationFrame(measureFrame);
  };
  
  animationId = requestAnimationFrame(measureFrame);
  
  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
  };
}

/**
 * Log performance metrics to console
 */
export function logPerformanceMetrics(): void {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }
  
  const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (navigationTiming) {
    console.group('[Performance Metrics]');
    console.log(`DNS Lookup: ${(navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart).toFixed(2)}ms`);
    console.log(`TCP Connection: ${(navigationTiming.connectEnd - navigationTiming.connectStart).toFixed(2)}ms`);
    console.log(`Request Time: ${(navigationTiming.responseStart - navigationTiming.requestStart).toFixed(2)}ms`);
    console.log(`Response Time: ${(navigationTiming.responseEnd - navigationTiming.responseStart).toFixed(2)}ms`);
    console.log(`DOM Processing: ${(navigationTiming.domComplete - navigationTiming.domLoading).toFixed(2)}ms`);
    console.log(`Total Load Time: ${(navigationTiming.loadEventEnd - navigationTiming.fetchStart).toFixed(2)}ms`);
    console.groupEnd();
  }
}
