import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, X, RotateCcw, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

const FloatingTimer = ({
    totalSeconds,
    remainingSeconds,
    isRunning,
    onPlayPause,
    onReset,
    onMaximize,
    onClose
}) => {
    const [position, setPosition] = useState({
        x: window.innerWidth - 280,
        y: 100
    });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const dragStart = useRef({ x: 0, y: 0 });

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleMouseDown = (e) => {
        if (e.target.closest('.timer-controls')) return;
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                const newX = e.clientX - dragStart.current.x;
                const newY = e.clientY - dragStart.current.y;

                const maxX = window.innerWidth - 250;
                const maxY = window.innerHeight - 200;

                setPosition({
                    x: Math.max(0, Math.min(newX, maxX)),
                    y: Math.max(0, Math.min(newY, maxY))
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

    const widget = (
        <motion.div
            ref={dragRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onMouseDown={handleMouseDown}
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 99999,
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur, 12px))',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                minWidth: '260px',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} color="var(--google-blue)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Study Timer</span>
                </div>
                <div className="timer-controls" style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                        onClick={onMaximize}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Maximize"
                    >
                        <Maximize2 size={16} />
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '1rem',
                color: remainingSeconds < 60 ? 'var(--google-red)' : 'var(--text-primary)',
                fontFamily: 'monospace'
            }}>
                {formatTime(remainingSeconds)}
            </div>

            <div style={{
                width: '100%',
                height: '6px',
                background: 'var(--bg-secondary)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '1rem'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--google-blue)',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                }} />
            </div>

            <div className="timer-controls" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                    onClick={onPlayPause}
                    className="btn-modern btn-solid"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', justifyContent: 'center', flex: 1 }}
                >
                    {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    {isRunning ? 'Pause' : 'Play'}
                </button>
                <button
                    onClick={onReset}
                    className="btn-modern btn-glass"
                    style={{ padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                    <RotateCcw size={16} />
                </button>
            </div>
        </motion.div>
    );

    return createPortal(widget, document.body);
};

export default FloatingTimer;
