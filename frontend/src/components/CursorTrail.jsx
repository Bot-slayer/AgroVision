import { useState, useEffect } from 'react';
import { Leaf, Sprout } from 'lucide-react';

const ICONS = [Leaf, Sprout];

export default function CursorTrail() {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    let lastPoint = { x: 0, y: 0 };
    
    // Add point on mouse move
    const handleMouseMove = (e) => {
      // Throttle points based on distance moved
      const dist = Math.hypot(e.clientX - lastPoint.x, e.clientY - lastPoint.y);
      if (dist < 45) return; // Add point every 45 pixels
      
      const IconComponent = ICONS[Math.floor(Math.random() * ICONS.length)];
      
      const newPoint = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        Icon: IconComponent
      };
      
      lastPoint = { x: e.clientX, y: e.clientY };

      setTrail((prev) => [...prev, newPoint]);

      // Remove the specific point after animation finishes (800ms)
      setTimeout(() => {
        setTrail((prev) => prev.filter((p) => p.id !== newPoint.id));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {trail.map((pt) => {
        const Icon = pt.Icon;
        return (
          <div
            key={pt.id}
            className="absolute text-primary animate-trail"
            style={{
              left: pt.x - 10, 
              top: pt.y - 10,
            }}
          >
            <Icon className="w-5 h-5 stroke-[1.5]" />
          </div>
        )
      })}
    </div>
  );
}
