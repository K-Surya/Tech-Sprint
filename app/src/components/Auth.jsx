import React, { useState } from 'react';
import {
    auth,
    googleProvider
} from '../firebase';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Chrome,
    AlertCircle,
    Cpu,
    Loader2,
    Sparkles,
    BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = ({ onBack, onDemoLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error("Google Sign-In Error Full:", err);
            setError(`Google Sign-In Failed: ${err.message} (${err.code})`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("[Auth] Submit attempt:", { email, isLogin });

        // Direct Demo Bypass - No Timeout
        if (isLogin && email.toLowerCase().trim() === 'demo@benchmate.ai' && password === 'demo') {
            console.log("[Auth] Demo login success!");
            onDemoLogin({ email: 'demo@benchmate.ai', displayName: 'Demo Student' });
            return;
        }

        console.log("[Auth] Attempting Firebase login...");
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email.trim(), password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
                await updateProfile(userCredential.user, { displayName: name });
            }
        } catch (err) {
            console.error("[Auth] Firebase Error:", err.code, err.message);
            setError(err.message.includes('auth/invalid-api-key') || err.message.includes('auth/network-request-failed')
                ? "Guest Mode: Firebase keys missing. Try 'demo@benchmate.ai' / 'demo' to enter."
                : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--grad-hero)',
            padding: '2rem'
        }}>
            <motion.div
                className="lab-card"
                style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div className="logo-section" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <BookOpen className="logo-icon" size={32} />
                        <span className="logo-text google-font" style={{ fontSize: '1.8rem', fontWeight: 700 }}>Benchmate AI</span>
                    </div>
                    <h2 className="google-font">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {isLogin ? 'Sign in to access your lecture notes' : 'Join thousands of students getting exam-ready'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fce8e6',
                        color: '#d93025',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.85rem'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {!isLogin && (
                        <div className="input-group">
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem' }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button className="btn-modern btn-solid" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? <Loader2 className="spinner" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
                        {!loading && <ArrowRight size={20} />}
                    </button>

                    <button
                        type="button"
                        onClick={() => onDemoLogin({ email: 'demo@benchmate.ai', displayName: 'Demo Student' })}
                        className="btn-modern btn-glass"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', border: '2px solid var(--google-blue)', color: 'var(--google-blue)', fontWeight: 700 }}
                    >
                        <Sparkles size={18} /> Enter as Demo Scholar (Fast Access)
                    </button>
                </form>

                <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>or continue with</span>
                    <div style={{ height: '1px', flex: 1, background: 'var(--border-color)' }}></div>
                </div>

                <button
                    className="btn-modern btn-glass"
                    style={{ width: '100%', justifyContent: 'center', background: 'white' }}
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    <Chrome size={20} style={{ color: '#4285F4' }} />
                    Sign in with Google
                </button>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none',
                            color: 'var(--google-blue)',
                            fontWeight: 600,
                            marginLeft: '0.5rem',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>

                <button
                    onClick={onBack}
                    style={{
                        marginTop: '1.5rem',
                        background: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'center'
                    }}
                >
                    ← Back to homepage
                </button>
            </motion.div>
        </div>
    );
};

export default Auth;
