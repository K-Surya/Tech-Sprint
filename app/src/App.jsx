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
    Clipboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './App.css';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// --- Decorative Components ---
const StarBackground = () => {
    const stars = React.useMemo(() => {
        console.log("Generating stars...");
        return Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: Math.random() * 15 + 10,
            delay: Math.random() * 5
        }));
    }, []);

    return (
        <div className="star-container">
            {stars.map(star => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        width: star.size,
                        height: star.size,
                        left: star.left,
                        top: star.top,
                        animationDuration: `${star.duration}s`,
                        animationDelay: `${star.delay}s`
                    }}
                />
            ))}
        </div>
    );
};

// --- Components ---


const Hero = ({ onActionClick }) => (
    <section className="hero">
        <div className="container">
            <div className="hero-bg-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
            </div>

            <motion.div
                className="hero-content"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="hero-badge">
                    <Sparkles size={16} />
                    <span>AI-Powered Learning Companion</span>
                </div>

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

const Navbar = ({ scrolled, user, onAuthClick, isDashboard, theme, toggleTheme }) => (
    <nav className={`navbar ${scrolled || isDashboard ? 'scrolled' : ''}`}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 1.5rem' }}>
            <div className="logo-section" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => window.scrollTo(0, 0)}>
                <BookOpen className="logo-icon" size={28} />
                <span className="logo-text google-font" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--google-blue)' }}>Benchmate AI</span>
            </div>
            <div className="nav-links">
                {!isDashboard && (
                    <>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How it Works</a>
                    </>
                )}

                <button
                    onClick={toggleTheme}
                    className="btn-modern btn-glass"
                    style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center' }}
                >
                    {theme === 'dark' ? <Sun size={20} color="var(--google-yellow)" /> : <Moon size={20} color="var(--google-blue)" />}
                </button>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--google-blue-light)', padding: '0.4rem 1rem', borderRadius: '20px', color: 'var(--google-blue)', fontWeight: 600, fontSize: '0.85rem' }}>
                            <UserIcon size={16} />
                            {user.displayName || user.email?.split('@')[0] || 'Scholar'}
                        </div>
                        <button
                            onClick={() => signOut(auth)}
                            className="btn-modern btn-glass"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onAuthClick}
                        className="btn-modern btn-solid"
                        style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                    >
                        Login / Join Now
                    </button>
                )}
            </div>
        </div>
    </nav>
);


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
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const currentUser = user || demoUser;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            if (authUser) {
                setShowAuth(false);
                setDemoUser(null);
            }
        });
        return () => unsubscribe();
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

    if (showAuth) {
        return (
            <div className="app-container">
                <div className="bg-gradient-layer" />
                <StarBackground />
                <Auth onBack={() => setShowAuth(false)} onDemoLogin={handleDemoLogin} />
            </div>
        );
    }

    if (currentUser) {
        return (
            <div className="app-container">
                <div className="bg-gradient-layer" />
                <StarBackground />
                <Navbar scrolled={scrolled} user={currentUser} onAuthClick={() => setShowAuth(true)} isDashboard={true} theme={theme} toggleTheme={toggleTheme} />
                <Dashboard user={currentUser} onLogout={handleLogout} />
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="bg-gradient-layer" />
            <StarBackground />
            <Navbar scrolled={scrolled} user={currentUser} onAuthClick={() => setShowAuth(true)} isDashboard={false} theme={theme} toggleTheme={toggleTheme} />
            <Hero onActionClick={handleActionClick} />
            <PainPoints />
            <Features />
            <HowItWorks />

            <footer className="footer-main">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem' }}>
                        <div style={{ maxWidth: '400px' }}>
                            <span className="footer-logo">Benchmate AI</span>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                The world's most student-friendly lecture companion.
                            </p>
                            <div className="impact-quote">
                                “Benchmate AI doesn’t just convert audio to text. It converts lectures into confidence.”
                            </div>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Resources</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <a href="#" className="nav-link">College Brand Kit</a>
                                <a href="#" className="nav-link">Privacy Policy</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Contact Us</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <a href="mailto:support@benchmateai.temp" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Sparkles size={16} /> support@benchmateai.temp
                                </a>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    Available Mon-Fri <br /> 9:00 AM - 6:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        © 2025 Benchmate AI • Built for GDG Hackathon
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
