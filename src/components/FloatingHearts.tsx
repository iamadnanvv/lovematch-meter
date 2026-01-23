import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface FloatingHeart {
  id: number;
  left: number;
  delay: number;
  size: number;
  duration: number;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const initialHearts: FloatingHeart[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      size: 12 + Math.random() * 16,
      duration: 4 + Math.random() * 4
    }));
    setHearts(initialHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="absolute text-primary/20 fill-primary/10"
          style={{
            left: `${heart.left}%`,
            bottom: '-20px',
            width: heart.size,
            height: heart.size,
            animation: `floatHeart ${heart.duration}s ease-out infinite`,
            animationDelay: `${heart.delay}s`
          }}
        />
      ))}
    </div>
  );
}
