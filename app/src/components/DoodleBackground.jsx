import React from 'react';
import doodleImg from '../assets/doodle_grey_white.png';

const DoodleBackground = ({ opacity = 0.15 }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '120%',
                    height: '120%',
                    backgroundImage: `url(${doodleImg})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '400px',
                    opacity: opacity,
                    animation: 'doodle-drift 60s linear infinite'
                }}
            />
            <style>{`
                @keyframes doodle-drift {
                    from { transform: translate(0, 0) rotate(0deg); }
                    to { transform: translate(-50px, -50px) rotate(1deg); }
                }
            `}</style>
        </div>
    );
};

export default DoodleBackground;
