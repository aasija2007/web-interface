import React, { useEffect, useRef } from 'react';

export default function DynamicBackground({ bgType = 'sunny' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setup
    const count = bgType === 'heavy-rain' || bgType === 'stormy' ? 120 : bgType === 'rainy' ? 70 : bgType === 'snowy' ? 60 : 35;
    const particles = Array.from({ length: count }, () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 10,
        speed: bgType.includes('rain') || bgType === 'stormy' ? Math.random() * 10 + 12 : bgType === 'snowy' ? Math.random() * 1.5 + 0.8 : Math.random() * 0.5 + 0.2,
        radius: bgType === 'snowy' ? Math.random() * 3 + 1.5 : Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        angle: bgType.includes('rain') ? 0.15 : Math.random() * 0.05 - 0.025,
      };
    });

    // Lightning effect for stormy
    let flashOpacity = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (bgType === 'stormy' && Math.random() < 0.008) {
        flashOpacity = 0.4;
      }
      if (flashOpacity > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
        ctx.fillRect(0, 0, width, height);
        flashOpacity -= 0.02;
      }

      particles.forEach((p) => {
        if (bgType.includes('rain') || bgType === 'stormy') {
          // Draw raindrops
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.length * p.angle, p.y + p.length);
          ctx.strokeStyle = `rgba(186, 230, 253, ${p.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          p.y += p.speed;
          p.x += p.speed * p.angle;
          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        } else if (bgType.includes('snow')) {
          // Draw snowflakes
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();

          p.y += p.speed;
          p.x += Math.sin(p.y * 0.02) * 0.5;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        } else if (bgType.includes('night')) {
          // Draw twinkling stars
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(Date.now() * 0.001 + p.x)) * 0.8 + 0.2})`;
          ctx.fill();
        } else {
          // Sunny / Cloudy subtle floating dust/light particles
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * 0.5})`;
          ctx.fill();

          p.y -= p.speed;
          if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [bgType]);

  return (
    <div className="weather-bg-container">
      <div className={`weather-bg-gradient bg-${bgType}`} />
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
