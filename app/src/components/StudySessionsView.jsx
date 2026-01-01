import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, X, RotateCcw, Minimize2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const StudySessionsView = ({ onBack }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(25);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

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
            setIsStarted(true);
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
        setIsStarted(false);
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

    const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

    if (!isStarted) {
        // Setup View
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: '600px', margin: '0 auto' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <button onClick={onBack} className="btn-modern btn-glass" style={{ marginRight: '1rem', padding: '0.5rem' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="google-font" style={{ margin: 0, fontSize: '2rem' }}>Study Sessions</h2>
                </div>

                <div className="lab-card" style={{ padding: '3rem', background: 'var(--bg-color)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '16px',
                            background: 'var(--google-blue-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Clock size={32} color="var(--google-blue)" />
                        </div>
                        <div>
                            <h3 className="google-font" style={{ margin: 0, fontSize: '1.5rem' }}>Set Your Focus Time</h3>
                            <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Choose your study duration</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
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
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    border: '2px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    fontSize: '2rem',
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--google-blue)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
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
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    border: '2px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    fontSize: '2rem',
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--google-blue)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>Quick Presets</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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
                                        padding: '0.85rem',
                                        fontSize: '0.9rem',
                                        justifyContent: 'center',
                                        fontWeight: 600
                                    }}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        disabled={hours === 0 && minutes === 0}
                        className="btn-modern btn-solid"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            padding: '1.25rem',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            opacity: (hours === 0 && minutes === 0) ? 0.5 : 1,
                            cursor: (hours === 0 && minutes === 0) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <Play size={24} />
                        Start Study Session
                    </button>
                </div>
            </motion.div>
        );
    }

    // Timer Running View
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '700px', margin: '0 auto' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={onBack} className="btn-modern btn-glass" style={{ marginRight: '1rem', padding: '0.5rem' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="google-font" style={{ margin: 0, fontSize: '2rem' }}>Study Session Active</h2>
                </div>
                <span style={{
                    background: isRunning ? 'var(--google-green-light)' : 'var(--google-yellow-light)',
                    color: isRunning ? 'var(--google-green)' : '#f59e0b',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 700
                }}>
                    {isRunning ? '● RUNNING' : '❚❚ PAUSED'}
                </span>
            </div>

            <div className="lab-card" style={{ padding: '4rem 3rem', background: 'var(--bg-color)', borderRadius: '32px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <Clock size={48} color="var(--google-blue)" style={{ marginBottom: '2rem' }} />

                <div style={{
                    fontSize: '6rem',
                    fontWeight: 800,
                    marginBottom: '2rem',
                    color: remainingSeconds < 60 ? 'var(--google-red)' : 'var(--text-primary)',
                    fontFamily: 'monospace',
                    lineHeight: 1
                }}>
                    {formatTime(remainingSeconds)}
                </div>

                <div style={{
                    width: '100%',
                    height: '12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    marginBottom: '3rem'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--google-blue), var(--google-green))',
                        borderRadius: '6px',
                        transition: 'width 0.3s ease'
                    }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <button
                        onClick={handlePlayPause}
                        className="btn-modern btn-solid"
                        style={{ padding: '1rem 2rem', fontSize: '1rem', justifyContent: 'center', minWidth: '140px' }}
                    >
                        {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Resume</>}
                    </button>
                    <button
                        onClick={handleReset}
                        className="btn-modern btn-glass"
                        style={{ padding: '1rem 2rem', fontSize: '1rem', justifyContent: 'center', minWidth: '140px' }}
                    >
                        <RotateCcw size={20} />
                        Reset
                    </button>
                </div>

                <button
                    onClick={handleNewTimer}
                    style={{
                        width: '100%',
                        padding: '0.85rem',
                        background: 'none',
                        border: '2px dashed var(--border-color)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.borderColor = 'var(--google-blue)';
                        e.target.style.color = 'var(--google-blue)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.borderColor = 'var(--border-color)';
                        e.target.style.color = 'var(--text-secondary)';
                    }}
                >
                    New Timer
                </button>
            </div>
        </motion.div>
    );
};

export default StudySessionsView;
