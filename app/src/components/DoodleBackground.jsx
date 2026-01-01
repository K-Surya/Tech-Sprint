import React, { useEffect, useState } from 'react';
import doodleImg from '../assets/doodle_grey_white.png';

const DoodleBackground = ({ opacity = 0.15 }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check initial theme
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            setIsDark(theme === 'dark');
        };

        checkTheme();

        // Watch for theme changes
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

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
                    filter: isDark ? 'invert(1) brightness(0.6)' : 'none',
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
