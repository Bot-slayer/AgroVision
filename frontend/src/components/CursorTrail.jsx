import { useEffect } from 'react';

// CursorTrail: spawns small "boat" motifs that float and expand like water
// The visual effect is intentionally short-lived (0.75s) and expands/fades
// to emulate glassy boat-like ripples following the pointer.

export default function CursorTrail() {
  useEffect(() => {
    let lastPoint = { x: 0, y: 0 };
    let idleTimer = null;
    let idleInterval = null;
    let container = null;
    let lastSpawnTime = 0; // throttle tracker

    const handlePointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!container) container = document.querySelector('.pointer-events-none.fixed.inset-0');

      // Throttle: only spawn a ripple every 400ms while moving
      const now = Date.now();
      if (now - lastSpawnTime >= 400) {
        spawnRipple(container, x, y);
        lastSpawnTime = now;
      }

      lastPoint = { x, y };

      // Reset idle timers when moving
      if (idleTimer) clearTimeout(idleTimer);
      if (idleInterval) {
        clearInterval(idleInterval);
        idleInterval = null;
      }

      // When pointer stops for 400ms, start idle ripples every 400ms
      idleTimer = setTimeout(() => {
        idleInterval = setInterval(() => {
          if (container) spawnRipple(container, lastPoint.x, lastPoint.y);
        }, 400);
      }, 400);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (idleTimer) clearTimeout(idleTimer);
      if (idleInterval) clearInterval(idleInterval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" />
  );
}

// Helper: spawn a single subtle ring per trigger
function spawnRipple(container, x, y) {
  if (!container) return;
  const size = 48;
  const ring = document.createElement('span');
  ring.className = 'ripple-ring';
  ring.style.width = `${size}px`;
  ring.style.height = `${size}px`;
  ring.style.left = `${x - size / 2}px`;
  ring.style.top = `${y - size / 2}px`;
  container.appendChild(ring);
  ring.addEventListener('animationend', () => ring.remove(), { once: true });
}
