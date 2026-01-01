import React, { useState, useRef, useEffect } from 'react';
import {
    Mic,
    Square,
    Upload,
    FileAudio,
    CheckCircle2,
    Loader2,
    Copy,
    Download,
    Volume2,
    Cpu,
    RefreshCw,
    Trophy,
    Zap,
    Shield,
    Clock,
    Trash2,
    AlertCircle,
    Play,
    ArrowRight,
    Wifi,
    Sparkles,
    Search,
    BookOpen,
    LogOut,
    User as UserIcon,
    Layout,
    Sun,
    Moon,
    FileText,
    BrainCircuit,
    TrendingUp,
    Clipboard,
    Menu,
    X,
    Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './App.css';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ErrorBoundary from './components/ErrorBoundary';
import { avatars } from './components/AvatarSelection';
import LiquidEther from './components/LiquidEther';
import Plasma from './components/Plasma';
import StudySessionsView from './components/StudySessionsView';
import FloatingTimer from './components/FloatingTimer';

// --- Decorative Components ---

// --- Components ---


const Hero = ({ onActionClick }) => (
    <section className="hero">
        <div className="container">
            <motion.div
                className="hero-content"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >


                <h1 className="hero-title">
                    From Lecture Noise to <br />
                    <span className="text-gradient">Learning Gold</span>
                </h1>

                <p className="hero-description">
                    Turn messy lecture audio into crystal-clear, exam-ready content — instantly.
                    Benchmate AI listens, filters the chaos, and delivers clean notes you can actually study from.
                </p>

                <div className="hero-btns">
                    <button
                        onClick={() => onActionClick('record')}
                        className="btn-modern btn-solid"
                        style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
                    >
                        <Mic size={20} style={{ marginRight: '0.5rem' }} />
                        Start Free Recording
                    </button>
                    <button
                        onClick={() => onActionClick('upload')}
                        className="btn-modern btn-glass"
                        style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
                    >
                        <Upload size={20} style={{ marginRight: '0.5rem' }} />
                        Upload Audio File
                    </button>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
                    {[
                        { label: '98%', sub: 'Accuracy' },
                        { label: '5s', sub: 'Processing' },
                        { label: 'Saved', sub: 'Summaries' }
                    ].map((stat, i) => (
                        <div key={i}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--google-blue)' }}>{stat.label}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
);

const Navbar = ({ scrolled, user, userProfile, onAuthClick, isDashboard, theme, toggleTheme, onMenuClick, onProfileClick }) => (
    <nav className={`navbar ${scrolled || isDashboard ? 'scrolled' : ''}`}>
        <div className={isDashboard ? "" : "container"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: isDashboard ? '0 2rem' : '0 1.5rem', maxWidth: isDashboard ? '100%' : '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isDashboard && (
                    <button
                        onClick={onMenuClick}
                        className="btn-modern btn-glass"
                        style={{ padding: '0.6rem', borderRadius: '12px' }}
                    >
                        <Menu size={20} />
                    </button>
                )}
                <div className="logo-section" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => window.scrollTo(0, 0)}>
                    <BookOpen className="logo-icon" size={28} />
                    <span className="logo-text google-font" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--google-blue)' }}>Benchmate AI</span>
                </div>
            </div>

            <div className="nav-links">
                {!isDashboard && (
                    <div className="desktop-only" style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How it Works</a>
                    </div>
                )}

                {isDashboard && (
                    <button
                        onClick={toggleTheme}
                        className="btn-modern btn-glass"
                        style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center' }}
                    >
                        {theme === 'dark' ? <Sun size={20} color="var(--google-yellow)" /> : <Moon size={20} color="var(--google-blue)" />}
                    </button>
                )}

                {user ? (
                    <div className="user-profile-badge" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                            onClick={onProfileClick}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-secondary)', padding: '0.4rem 1rem 0.4rem 0.5rem', borderRadius: '30px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {userProfile?.avatar ? (
                                <img
                                    src={avatars.find(a => a.id === userProfile.avatar)?.src || avatars[0].src}
                                    alt="Avatar"
                                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--google-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <UserIcon size={16} />
                                </div>
                            )}
                            <span>{userProfile?.nickname || user.displayName || user.email?.split('@')[0] || 'Scholar'}</span>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={onAuthClick}
                        className="btn-modern btn-solid"
                        style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    </nav>
);

const Sidebar = ({ isOpen, onClose, user, onLogout, subjects, onNavigate, currentSubject, onStudyTimer }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="sidebar-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 2000
                        }}
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        className="sidebar-panel"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '300px',
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(var(--glass-blur, 12px))',
                            borderRight: '1px solid var(--border-color)',
                            zIndex: 2001,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <BookOpen color="var(--google-blue)" size={24} />
                                <span className="google-font" style={{ fontWeight: 700, fontSize: '1.25rem' }}>Menu</span>
                            </div>
                            <button onClick={onClose} className="btn-modern btn-glass" style={{ padding: '0.5rem' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="sidebar-scroll" style={{ flex: 1, overflowY: 'auto', marginRight: '-1rem', paddingRight: '1rem' }}>
                            <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Main</p>

                                {[
                                    { icon: <Layout size={20} />, label: 'Dashboard' },
                                    { icon: <TrendingUp size={20} />, label: 'Learning Curve' },
                                    { icon: <Clock size={20} />, label: 'Study Sessions' },
                                ].map((item, i) => (
                                    <button
                                        key={item.label}
                                        onClick={() => {
                                            if (item.label === 'Dashboard') onNavigate(null, 'subject');
                                            else if (item.label === 'Study Sessions') {
                                                onStudyTimer();
                                                onClose();
                                            }
                                            else onClose();
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            padding: '0.85rem 1rem',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: (item.label === 'Dashboard' && !currentSubject) ? 'var(--google-blue-light)' : 'transparent',
                                            color: (item.label === 'Dashboard' && !currentSubject) ? 'var(--google-blue)' : 'var(--text-primary)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s'
                                        }}
                                        className="sidebar-item"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                ))}

                                <div style={{ marginTop: '2rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>My Subjects</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        {subjects && subjects.length > 0 ? subjects.map((sub, i) => (
                                            <button
                                                key={sub.id || i}
                                                onClick={() => {
                                                    onNavigate(sub, 'subject');
                                                    onClose();
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    background: currentSubject?.id === sub.id ? 'var(--google-blue-light)' : 'transparent',
                                                    color: currentSubject?.id === sub.id ? 'var(--google-blue)' : 'var(--text-primary)',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s'
                                                }}
                                                className="sidebar-item"
                                            >
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sub.color }}></div>
                                                <span
                                                    style={{
                                                        fontSize: '0.9rem',
                                                        fontWeight: currentSubject?.id === sub.id ? 700 : 500
                                                    }}
                                                >
                                                    {sub.name}
                                                </span>
                                            </button>
                                        )) : (
                                            <p style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No subjects added yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-footer" style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button
                                onClick={() => { onNavigate(null, 'profile'); onClose(); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--text-primary)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                className="sidebar-item"
                            >
                                <UserIcon size={20} />
                                <span>Profile</span>
                            </button>
                            <button
                                onClick={() => { onNavigate(null, 'settings'); onClose(); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--text-primary)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                className="sidebar-item"
                            >
                                <Settings size={20} />
                                <span>Settings</span>
                            </button>
                            <button
                                onClick={onLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--google-red)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    marginTop: '0.5rem'
                                }}
                                className="sidebar-item"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


const PainPoints = () => (
    <section className="pain-points section-padding">
        <div className="container">
            <h2 className="section-title">The "Last-Minute" Panic is Real.</h2>
            <p className="section-subtitle">You record the lectures. But you never actually listen to them. We fix that.</p>

            <div className="pain-grid">
                {[
                    { icon: <Clock />, title: "Finals Week Chaos", text: "40 hours of audio. 1 night left. It's impossible." },
                    { icon: <AlertCircle />, title: "Filtered Content", text: "Endless chatter & noise, zero actual notes." },
                    { icon: <Trash2 />, title: "Digital Graveyard", text: "Audio files that sit in folders until deleted." },
                    { icon: <Search />, title: "Hidden Knowledge", text: "The exam answer is buried in hour 4." }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className="pain-item"
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="pain-icon-wrapper">{item.icon}</div>
                        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{item.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.text}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const Features = () => {
    const featureList = [
        {
            icon: <Volume2 />,
            title: "AI Audio Transcription",
            desc: "Crystal-clear conversion of lectures to text. Our AI filters background noise and off-topic chatter.",
            color: "var(--google-blue)"
        },
        {
            icon: <FileText />,
            title: "Structured Study Notes",
            desc: "Automatically turns raw transcripts into organized paragraphs, bullet points, and academic summaries.",
            color: "var(--google-green)"
        },
        {
            icon: <BrainCircuit />,
            title: "Smart Flashcards",
            desc: "Generate active recall study decks instantly from your lecture content. Perfect for quick revision.",
            color: "var(--google-yellow)"
        },
        {
            icon: <Sparkles />,
            title: "AI-Powered Quizzes",
            desc: "Test your understanding with auto-generated quizzes and detailed explanations for every answer.",
            color: "var(--google-red)"
        },
        {
            icon: <Clipboard />,
            title: "Content Importer",
            desc: "Not just for audio! Paste textbook chapters or raw notes to get the same AI-powered summaries.",
            color: "var(--google-blue)"
        },
        {
            icon: <TrendingUp />,
            title: "Progress Tracking",
            desc: "Monitor your quiz scores and study consistency across different subjects in one dashboard.",
            color: "var(--google-green)"
        }
    ];

    return (
        <section id="features" className="features section-padding">
            <div className="container">
                <h2 className="section-title">Everything You Need to Ace Your Exams</h2>
                <p className="section-subtitle">A complete AI-powered study ecosystem built directly for student success.</p>

                <div className="feature-grid">
                    {featureList.map((f, i) => (
                        <motion.div
                            key={i}
                            className="feature-card"
                            whileHover={{ y: -10, scale: 1.02 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="feature-icon-wrapper" style={{ color: f.color }}>
                                {f.icon}
                            </div>
                            <h3>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const steps = [
        { icon: <Mic />, title: "Record / Upload", text: "Start live recording or pick a file." },
        { icon: <Cpu />, title: "AI Filters & Transcribes", text: "Google AI cleans & converts audio." },
        { icon: <CheckCircle2 />, title: "Study-Ready Text", text: "Get structured, clean notes instantly." }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.4
            }
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const lineVariants = {
        hidden: { scaleX: 0, originX: 0 },
        visible: {
            scaleX: 1,
            transition: {
                duration: 1.5,
                ease: "easeInOut",
                delay: 0.2
            }
        }
    };

    return (
        <section id="how-it-works" className="how-it-works section-padding">
            <div className="how-it-works-bg-glow" />
            <div className="container">
                <motion.h2
                    className="section-title"
                    style={{ color: 'white' }}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    How It Works
                </motion.h2>
                <motion.p
                    className="section-subtitle"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    Zero learning curve. Just results.
                </motion.p>

                <motion.div
                    className="step-flow"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className="flow-line-bg">
                        <motion.div
                            className="flow-line-progress"
                            variants={lineVariants}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {steps.map((step, i) => (
                        <motion.div className="step" key={i} variants={stepVariants}>
                            <div className="step-icon-container">
                                <motion.div
                                    className="step-icon"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    {step.icon}
                                </motion.div>
                                <div className="step-number">{i + 1}</div>
                            </div>
                            <div className="step-content">
                                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{step.title}</h4>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6 }}>{step.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};


// --- Main App ---

function App() {
    const [scrolled, setScrolled] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [demoUser, setDemoUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [floatingTimer, setFloatingTimer] = useState(null);

    // Global Timer State
    const [timerActive, setTimerActive] = useState(false);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    const [profileReq, setProfileReq] = useState(0);

    // Timer countdown logic
    useEffect(() => {
        let interval;
        if (timerRunning && remainingSeconds > 0 && timerActive) {
            interval = setInterval(() => {
                setRemainingSeconds(prev => {
                    if (prev <= 1) {
                        setTimerRunning(false);
                        // Timer completed
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerRunning, remainingSeconds, timerActive]);

    // Timer control functions
    const startTimer = (hours, minutes) => {
        const total = (hours * 3600) + (minutes * 60);
        if (total > 0) {
            setTotalSeconds(total);
            setRemainingSeconds(total);
            setTimerActive(true);
            setTimerRunning(true);
        }
    };

    const toggleTimerPlayPause = () => {
        setTimerRunning(!timerRunning);
    };

    const resetTimer = () => {
        setTimerRunning(false);
        setRemainingSeconds(totalSeconds);
    };

    const stopTimer = () => {
        setTimerActive(false);
        setTimerRunning(false);
        setTotalSeconds(0);
        setRemainingSeconds(0);
        setFloatingTimer(null);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const currentUser = user || demoUser;

    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        let profileUnsubscribe = null;

        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (profileUnsubscribe) {
                profileUnsubscribe();
                profileUnsubscribe = null;
            }

            if (authUser) {
                try {
                    const { subscribeToUserProfile } = await import('./services/db');
                    profileUnsubscribe = subscribeToUserProfile(authUser.uid, (profile) => {
                        setUserProfile(profile);
                    });
                } catch (e) {
                    console.error("Error subscribing to profile in App:", e);
                }
                setUser(authUser);
                setShowAuth(false);
                setDemoUser(null);
            } else {
                setUser(null);
                setUserProfile(null);
            }
        });
        return () => {
            unsubscribe();
            if (profileUnsubscribe) profileUnsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleActionClick = () => {
        if (!currentUser) {
            setShowAuth(true);
        }
    };

    const handleDemoLogin = (data) => {
        setDemoUser(data);
        setShowAuth(false);
    };

    const handleLogout = () => {
        signOut(auth);
        setDemoUser(null);
        setShowAuth(false);
    };

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [viewMode, setViewMode] = useState('subject');
    const [glassIntensity, setGlassIntensity] = useState(
        parseInt(localStorage.getItem('glassIntensity') || '12')
    );

    useEffect(() => {
        document.documentElement.style.setProperty('--glass-blur', `${glassIntensity}px`);
        localStorage.setItem('glassIntensity', glassIntensity);
    }, [glassIntensity]);

    useEffect(() => {
        if (currentUser) {
            import('./services/db').then(({ initializeUser, subscribeToSubjects }) => {
                initializeUser(currentUser);
                const unsubscribe = subscribeToSubjects(currentUser.uid, (data) => {
                    setSubjects(data);
                });
                return () => unsubscribe();
            });
        }
    }, [currentUser]);

    if (showAuth) {
        return (
            <div className="app-container">
                <div className="bg-gradient-layer" />

                <Auth onBack={() => setShowAuth(false)} onDemoLogin={handleDemoLogin} />
            </div>
        );
    }

    if (currentUser) {
        return (
            <div className="app-container">
                <div className="bg-gradient-layer" />
                <div className="ombre-glow glow-1" />
                <div className="ombre-glow glow-2" />

                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    user={currentUser}
                    onLogout={handleLogout}
                    subjects={subjects}
                    onNavigate={(sub, mode) => {
                        setSelectedSubject(sub);
                        setViewMode(mode);
                    }}
                    currentSubject={selectedSubject}
                    onStudyTimer={() => {
                        setViewMode('study-sessions');
                        setSelectedSubject(null);
                    }}
                />

                <Navbar
                    scrolled={scrolled}
                    user={currentUser}
                    userProfile={userProfile}
                    onAuthClick={() => setShowAuth(true)}
                    isDashboard={true}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onProfileClick={() => setViewMode('profile')}
                />
                <Dashboard
                    user={currentUser}
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    onLogout={handleLogout}
                    subjects={subjects}
                    setSubjects={setSubjects}
                    selectedSubject={selectedSubject}
                    setSelectedSubject={setSelectedSubject}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    glassIntensity={glassIntensity}
                    setGlassIntensity={setGlassIntensity}
                    floatingTimer={floatingTimer}
                    setFloatingTimer={setFloatingTimer}
                    timerActive={timerActive}
                    totalSeconds={totalSeconds}
                    remainingSeconds={remainingSeconds}
                    timerRunning={timerRunning}
                    startTimer={startTimer}
                    toggleTimerPlayPause={toggleTimerPlayPause}
                    resetTimer={resetTimer}
                    stopTimer={stopTimer}
                />

                {/* Global Floating Timer */}
                {floatingTimer && (
                    <FloatingTimer
                        totalSeconds={totalSeconds}
                        remainingSeconds={remainingSeconds}
                        isRunning={timerRunning}
                        onPlayPause={toggleTimerPlayPause}
                        onReset={resetTimer}
                        onMaximize={() => {
                            setFloatingTimer(null);
                            setViewMode('study-sessions');
                        }}
                        onClose={() => setFloatingTimer(null)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="app-container landing-page" style={{ position: 'relative', background: '#000000', color: '#ffffff' }}>

            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Plasma
                    color="#1a10ff"
                    speed={1.0}
                    direction="forward"
                    scale={1.1}
                    opacity={0.9}
                    mouseInteractive={true}
                />
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
                <Navbar scrolled={scrolled} user={currentUser} userProfile={userProfile} onAuthClick={() => setShowAuth(true)} isDashboard={false} theme={theme} toggleTheme={toggleTheme} />
                <Hero onActionClick={handleActionClick} />
                <PainPoints />
                <Features />
                <HowItWorks />
            </div>

            <footer className="footer-main">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem' }}>
                        <div style={{ maxWidth: '400px' }}>
                            <span className="footer-logo">Benchmate AI</span>
                            <p style={{ lineHeight: 1.6 }}>
                                The world's most student-friendly lecture companion.
                            </p>
                            <div className="impact-quote">
                                “Benchmate AI doesn’t just convert audio to text. It converts lectures into confidence.”
                            </div>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Resources</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                <a href="#" className="nav-link">Privacy Policy</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Contact Us</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <a href="mailto:support@benchmateai.temp" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={16} /> support@benchmateai.temp
                                </a>
                                <p style={{ fontSize: '0.85rem' }}>
                                    Available Mon-Fri <br /> 9:00 AM - 6:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.85rem' }}>
                        © 2025 Benchmate AI • Built for GDG Hackathon
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
