import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { Scanlines } from './Scanlines';

describe('Scanlines', () => {
  it('should render scanline component in DOM', () => {
    render(<Scanlines />);
    const scanlines = screen.getByTestId('scanlines');
    expect(scanlines).toBeInTheDocument();
  });

  it('should be aria-hidden for accessibility', () => {
    render(<Scanlines />);
    const scanlines = screen.getByTestId('scanlines');
    expect(scanlines).toHaveAttribute('aria-hidden', 'true');
  });

  /**
   * Feature: doom-scroll-reader, Property 23: Responsive scanline density
   * Validates: Requirements 9.2
   * 
   * For any viewport width change, the scanline effect should adjust its density
   * or spacing to maintain visual consistency.
   */
  it('property: scanline density adjusts based on viewport width', async () => {
    const { act } = await import('@testing-library/react');
    
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 320, max: 2560 }),
        async (viewportWidth) => {
          // Mock window.innerWidth
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          const { container } = render(<Scanlines />);
          const scanlines = container.querySelector('[data-testid="scanlines"]');
          if (!scanlines) throw new Error('Scanlines not found');

          // Trigger resize event wrapped in act
          await act(async () => {
            window.dispatchEvent(new Event('resize'));
            await new Promise(resolve => setTimeout(resolve, 10));
          });

          // Get the computed scanline spacing
          const style = (scanlines as HTMLElement).style;
          const spacing = style.getPropertyValue('--scanline-spacing');

          // Verify spacing is set
          expect(spacing).toBeTruthy();

          // Verify spacing adjusts for mobile (<=768px)
          if (viewportWidth <= 768) {
            expect(spacing).toBe('3px');
          } else {
            expect(spacing).toBe('2px');
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
