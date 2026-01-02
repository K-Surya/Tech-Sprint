import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const StudyTimer = ({ onClose }) => {
    const [isSetup, setIsSetup] = useState(true);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(25);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 280, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const dragStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
        let interval;
        if (isRunning && remainingSeconds > 0) {
            interval = setInterval(() => {
                setRemainingSeconds(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, remainingSeconds]);

    const handleStart = () => {
        const total = (hours * 3600) + (minutes * 60);
        if (total > 0) {
            setTotalSeconds(total);
            setRemainingSeconds(total);
            setIsSetup(false);
            setIsRunning(true);
        }
    };

    const handlePlayPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setRemainingSeconds(totalSeconds);
    };

    const handleNewTimer = () => {
        setIsRunning(false);
        setIsSetup(true);
        setRemainingSeconds(0);
    };

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

    const setupModal = isSetup ? (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 99998
                }}
            />

            {/* Setup Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 99999,
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(var(--glass-blur, 12px))',
                    borderRadius: '24px',
                    padding: '2.5rem',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    width: '90vw',
                    maxWidth: '450px',
                    maxHeight: '85vh',
                    overflowY: 'auto'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={24} color="var(--google-blue)" />
                        <h2 className="google-font" style={{ margin: 0, fontSize: '1.5rem' }}>Study Timer</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-modern btn-glass"
                        style={{ padding: '0.5rem' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Set your focus time and start your study session.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Hours
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="23"
                            value={hours}
                            onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-color)',
                                fontSize: '1.25rem',
                                textAlign: 'center',
                                fontWeight: 600,
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Minutes
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-color)',
                                fontSize: '1.25rem',
                                textAlign: 'center',
                                fontWeight: 600,
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                    {[
                        { label: '15 min', h: 0, m: 15 },
                        { label: '25 min', h: 0, m: 25 },
                        { label: '45 min', h: 0, m: 45 },
                        { label: '1 hour', h: 1, m: 0 },
                        { label: '2 hours', h: 2, m: 0 },
                        { label: '3 hours', h: 3, m: 0 }
                    ].map((preset) => (
                        <button
                            key={preset.label}
                            onClick={() => {
                                setHours(preset.h);
                                setMinutes(preset.m);
                            }}
                            className="btn-modern btn-glass"
                            style={{
                                padding: '0.6rem',
                                fontSize: '0.85rem',
                                justifyContent: 'center'
                            }}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleStart}
                    disabled={hours === 0 && minutes === 0}
                    className="btn-modern btn-solid"
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        opacity: (hours === 0 && minutes === 0) ? 0.5 : 1,
                        cursor: (hours === 0 && minutes === 0) ? 'not-allowed' : 'pointer'
                    }}
                >
                    <Play size={20} />
                    Start Timer
                </button>
            </motion.div>
        </>
    ) : null;

    const floatingTimer = !isSetup ? (
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
                minWidth: '240px',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} color="var(--google-blue)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Study Timer</span>
                </div>
                <button
                    onClick={onClose}
                    className="timer-controls"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <X size={16} />
                </button>
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
                    onClick={handlePlayPause}
                    className="btn-modern btn-solid"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                    {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                    onClick={handleReset}
                    className="btn-modern btn-glass"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
            </div>

            <button
                onClick={handleNewTimer}
                className="timer-controls"
                style={{
                    marginTop: '0.75rem',
                    width: '100%',
                    padding: '0.5rem',
                    background: 'none',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 600
                }}
            >
                New Timer
            </button>
        </motion.div>
    ) : null;

    // Use React Portal to render at document body level
    return createPortal(
        <>
            {setupModal}
            {floatingTimer}
        </>,
        document.body
    );
};

export default StudyTimer;
