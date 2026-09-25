import React, { useEffect, useState } from 'react';

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  return (
    <div
      className="cursor-glow"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        opacity: visible ? 1 : 0
      }}
    />
  );
};

export default CursorGlow;
