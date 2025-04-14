import React from 'react';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
            <img
                src="/banner_1.gif"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" /> {/* Overlay escuro para melhor contraste */}
        </div>
    );
};

export default AnimatedBackground; 