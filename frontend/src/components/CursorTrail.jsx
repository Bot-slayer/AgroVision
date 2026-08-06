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

    const handlePointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Always spawn ripples as cursor moves for smooth following effect
      if (!container) container = document.querySelector('.pointer-events-none.fixed.inset-0');
      spawnRipple(container, x, y);

      lastPoint = { x, y };

      // Reset idle timers when moving
      if (idleTimer) clearTimeout(idleTimer);
      if (idleInterval) {
        clearInterval(idleInterval);
        idleInterval = null;
      }

      // When pointer stops for 220ms, start idle ripples every 400ms
      idleTimer = setTimeout(() => {
        idleInterval = setInterval(() => {
          if (container) spawnRipple(container, lastPoint.x, lastPoint.y);
        }, 400);
      }, 220);
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

// Helper to spawn ripple elements with smaller, less attention-catching size and opacity
function spawnRipple(container, x, y) {
  if (!container) return;
  const baseSize = 42; // Reduced from 80 for subtler effect
  for (let i = 0; i < 3; i += 1) {
    const ring = document.createElement('span');
    ring.className = `ripple-ring delay-${i}`;
    const size = baseSize * (1 + i * 0.22);
    ring.style.width = `${size}px`;
    ring.style.height = `${size}px`;
    ring.style.left = `${x - size / 2}px`;
    ring.style.top = `${y - size / 2}px`;
    ring.style.opacity = '0.35'; // Reduced opacity for less attention-catching
    container.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });
  }
  const drop = document.createElement('span');
  drop.className = 'ripple-drop';
  const d = 10;
  drop.style.width = `${d}px`;
  drop.style.height = `${d}px`;
  drop.style.left = `${x - d / 2}px`;
  drop.style.top = `${y - d / 2}px`;
  drop.style.opacity = '0.4'; // Reduced opacity
  container.appendChild(drop);
  drop.addEventListener('animationend', () => drop.remove(), { once: true });
}
