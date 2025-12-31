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
    Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './App.css';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// --- Components ---

const Navbar = ({ scrolled, user, onAuthClick, isDashboard }) => (
    <nav className={`navbar ${scrolled || isDashboard ? 'scrolled' : ''}`}>
        <div className="container nav-container">
            <div className="logo-section" onClick={() => window.scrollTo(0, 0)}>
                <BookOpen className="logo-icon" size={28} />
                <span className="logo-text google-font">Benchmate AI</span>
            </div>
            <div className="nav-links">
                {!isDashboard && (
                    <div className="desktop-only" style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How it Works</a>
                    </div>
                )}
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--google-blue-light)', padding: '0.4rem 0.8rem', borderRadius: '20px', color: 'var(--google-blue)', fontWeight: 600, fontSize: '0.8rem' }}>
                            <UserIcon size={14} />
                            <span className="desktop-only">{user.displayName || user.email?.split('@')[0] || 'Scholar'}</span>
                        </div>
                        <button
                            onClick={() => signOut(auth)}
                            className="btn-modern btn-glass"
                            style={{ padding: '0.4rem', borderRadius: '50%', width: '36px', height: '36px', justifyContent: 'center' }}
                        >
                            <LogOut size={16} />
                        </button>
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

const Hero = ({ onActionClick }) => (
    <section className="hero">
        <div className="hero-bg-shapes">
            <div className="shape shape-1 anim-float"></div>
            <div className="shape shape-2 anim-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="container">
            <div className="hero-content">
                <motion.div
                    className="hero-badge"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Sparkles size={16} /> Powered by Google AI
                </motion.div>

                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    From Lecture Noise to <span className="text-gradient">Learning Gold</span>
                </motion.h1>

                <motion.p
                    className="hero-description"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Turn messy lecture audio into crystal-clear, exam-ready content — instantly.
                    Benchmate AI listens, filters the chaos, and delivers clean notes you can actually study from.
                </motion.p>

                <motion.div
                    className="hero-btns"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <button onClick={onActionClick} className="btn-modern btn-solid">
                        <Mic size={20} /> Start Recording
                    </button>
                    <button onClick={onActionClick} className="btn-modern btn-glass">
                        <Upload size={20} /> Upload Audio
                    </button>
                </motion.div>

                <motion.div
                    className="hero-tags"
                    style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--google-green)' }}></div> Built for campus life
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--google-blue)' }}></div> Exam-ready notes
                    </span>
                </motion.div>
            </div>
        </div>
    </section>
);

const PainPoints = () => (
    <section className="pain-points section-padding">
        <div className="container">
            <h2 className="section-title">You Attend lectures. You Record them.</h2>
            <p className="section-subtitle">And then? The "Last-Minute Panic" kicks in. Benchmate AI was built for the student life reality.</p>

            <div className="pain-grid">
                {[
                    { icon: <Clock />, title: "No time before exams", text: "Listening to 40 hours of audio is impossible during finals week." },
                    { icon: <AlertCircle />, title: "Audio is messy & long", text: "Background noise, long silences, and off-topic jokes hide the actual content." },
                    { icon: <Trash2 />, title: "You never listen again", text: "Most recorded lectures sit in a folder and are eventually deleted." },
                    { icon: <Search />, title: "Knowledge gets lost", text: "Important definitions and formulas are buried in hours of chatter." }
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
                        <h3 style={{ marginBottom: '0.75rem' }}>{item.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{item.text}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const Features = () => (
    <section id="features" className="features section-padding">
        <div className="container">
            <h2 className="section-title">Built for Real Student Power</h2>
            <p className="section-subtitle">Features that actually matter when you're sleep-deprived and studying at 3 AM.</p>

            <div className="feature-grid">
                <div className="feature-card" style={{ gridColumn: 'span 2' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--google-blue-light)', color: 'var(--google-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <Volume2 />
                    </div>
                    <h3>Noise-Aware AI Processing</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Our filters cut out background chatter, long pauses, and off-topic discussions. You get 100% meaningful academic content.
                    </p>
                </div>

                <div className="feature-card">
                    <Zap style={{ color: 'var(--google-yellow)', marginBottom: '1.5rem' }} />
                    <h3>Important Points Highlighting</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>AI automatically highlights definitions and exam-important phrases.</p>
                </div>

                <div className="feature-card">
                    <BookOpen style={{ color: 'var(--google-green)', marginBottom: '1.5rem' }} />
                    <h3>Structured Notes</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Turns raw speech into clear paragraphs and properly formatted academic text.</p>
                </div>

                <div className="feature-card" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <Wifi style={{ color: 'var(--google-blue)' }} />
                        <h3 style={{ margin: 0 }}>Student-Friendly Design</h3>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Lightweight UI and fast load times. Works perfectly on unpredictable campus Wi-Fi and mobile data.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

const HowItWorks = () => (
    <section id="how-it-works" className="how-it-works section-padding">
        <div className="container">
            <h2 className="section-title" style={{ color: 'white' }}>How It Works</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>Zero learning curve. Just results.</p>

            <div className="step-flow">
                {[
                    { icon: <Mic />, title: "Record / Upload", text: "Start live recording or pick a file." },
                    { icon: <Cpu />, title: "AI Filters & Transcribes", text: "Google AI cleans & converts audio." },
                    { icon: <CheckCircle2 />, title: "Study-Ready Text", text: "Get structured, clean notes instantly." }
                ].map((step, i) => (
                    <div className="step" key={i}>
                        <div className="step-icon">{step.icon}</div>
                        <h4>{step.title}</h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{step.text}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Roadmap = () => (
    <section className="section-padding" style={{ background: '#ffffff' }}>
        <div className="container">
            <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px', background: 'var(--grad-hero)', border: 'none' }}>
                <h2 className="section-title" style={{ textAlign: 'left' }}>What's Next? 🌱</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Benchmate AI is just getting started. Here's what's coming soon to help you ace your exams.</p>
                <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {[
                        "Flashcards from lectures",
                        "AI Quizzes before exams",
                        "Multi-language support",
                        "Exam summaries"
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: 'var(--google-blue)' }}>
                            <ArrowRight size={18} /> {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

// --- Main App ---

function App() {
    const [scrolled, setScrolled] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [demoUser, setDemoUser] = useState(null);

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
        return <Auth onBack={() => setShowAuth(false)} onDemoLogin={handleDemoLogin} />;
    }

    if (currentUser) {
        return (
            <div className="app-container">
                <Navbar scrolled={scrolled} user={currentUser} onAuthClick={() => setShowAuth(true)} isDashboard={true} />
                <Dashboard user={currentUser} onLogout={handleLogout} />
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navbar scrolled={scrolled} user={currentUser} onAuthClick={() => setShowAuth(true)} isDashboard={false} />
            <Hero onActionClick={handleActionClick} />
            <PainPoints />
            <Features />
            <HowItWorks />
            <Roadmap />

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
                            <h4 style={{ marginBottom: '1.5rem' }}>Powered By</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                <img src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_color_92x30dp.svg" alt="Google" height="24" />
                                <span>Cloud Platform</span>
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
