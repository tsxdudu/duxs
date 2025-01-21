import React from 'react';

const Snowflakes = () => {
  const snowflakes = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 5 + 5}s`,
    opacity: Math.random(),
    fontSize: `${Math.random() * 20 + 10}px`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            opacity: flake.opacity,
            fontSize: flake.fontSize,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowflakes;