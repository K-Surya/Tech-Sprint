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
    Plus,
    Calendar,
    BookOpen,
    Clock,
    ChevronRight,
    TrendingUp,
    Search,
    Layout,
    Trash2,
    Play,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Dashboard = ({ user, onLogout }) => {
    const [status, setStatus] = useState('idle');
    const [file, setFile] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const [isCopied, setIsCopied] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [subjects, setSubjects] = useState([
        { name: 'Computer Architecture', notes: 12, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { name: 'Discrete Mathematics', notes: 8, color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
        { name: 'Data Structures', notes: 15, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'Operating Systems', notes: 10, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    ]);
    const [newSubject, setNewSubject] = useState('');

    const timerRef = useRef(null);
    const fileInputRef = useRef(null);
    const timetableRef = useRef(null);

    useEffect(() => {
        if (status === 'recording') {
            timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } else {
            clearInterval(timerRef.current);
            if (status !== 'completed' && status !== 'processing') setRecordingTime(0);
        }
        return () => clearInterval(timerRef.current);
    }, [status]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const simulateTranscription = () => {
        setTimeout(() => {
            setStatus('completed');
            setTranscription(`SUMMARY: ADVANCED DATA STRUCTURES - SEGMENT TREES

A Segment Tree is a tree data structure used for storing information about intervals, or segments. It allows querying which of the stored segments contain a given point.

KEY CONCEPTS:
1. Range Queries: Efficiently find sums, mins, or maxes in a range.
2. Update Efficiency: O(log N) for both updates and queries.
3. Memory: Space complexity is approximately 4N.

[EXAM ALERT]
Expect a question on "Lazy Propagation" in Segment Trees for range updates.`);
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335']
            });
        }, 3000);
    };

    const addSubject = () => {
        if (newSubject.trim()) {
            const colors = [
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            ];
            setSubjects([...subjects, {
                name: newSubject,
                notes: 0,
                color: colors[subjects.length % colors.length]
            }]);
            setNewSubject('');
            setShowSubjectModal(false);
        }
    };

    return (
        <div className="dashboard-container" style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8faff' }}>
            <div className="container" style={{ padding: '2rem 1rem' }}>

                {/* Dashboard Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="google-font"
                            style={{ fontSize: '2.5rem', fontWeight: 700 }}
                        >
                            Welcome back, <span className="text-gradient" style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.displayName || 'Scholar'}</span>!
                        </motion.h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your lectures are ready for transformation.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-modern btn-glass" onClick={() => timetableRef.current.click()}>
                            <Calendar size={20} /> Upload Timetable
                            <input type="file" ref={timetableRef} hidden />
                        </button>
                        <button className="btn-modern btn-solid" onClick={() => setShowSubjectModal(true)}>
                            <Plus size={20} /> Add Subject
                        </button>
                    </div>
                </div>

                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                    {/* Main Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* The Audio Lab (Post-Login Version) */}
                        <motion.div
                            className="lab-card"
                            style={{ padding: '2.5rem', borderRadius: '32px', border: 'none', background: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 className="google-font" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Volume2 className="text-gradient" /> Audio Transcription Lab
                                </h2>
                                {status !== 'idle' && (
                                    <button className="btn-modern btn-glass" onClick={() => { setStatus('idle'); setTranscription(''); setFile(null); }} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                                        <RefreshCw size={14} /> New Session
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {status === 'processing' ? (
                                    <motion.div
                                        key="processing"
                                        style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    >
                                        <div className="spinner" style={{ width: 60, height: 60 }}></div>
                                        <div style={{ textAlign: 'center' }}>
                                            <h3 className="google-font">AI is generating your notes...</h3>
                                            <p style={{ color: 'var(--text-secondary)' }}>Cleaning hostel noise and extracting key concepts.</p>
                                        </div>
                                    </motion.div>
                                ) : status === 'completed' ? (
                                    <motion.div
                                        key="completed"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="transcription-box" style={{ background: '#f8faff', borderRadius: '20px', padding: '1.5rem', minHeight: '200px', border: '1px solid #e1e7f0', whiteSpace: 'pre-line' }}>
                                            {transcription}
                                        </div>
                                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                            <button className="btn-modern btn-glass" onClick={() => { navigator.clipboard.writeText(transcription); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }}>
                                                {isCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />} {isCopied ? 'Copied' : 'Copy'}
                                            </button>
                                            <button className="btn-modern btn-solid">
                                                <Download size={18} /> Save to Subject
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div
                                            className="upload-zone"
                                            style={{ padding: '3rem 1.5rem', border: '2px dashed #e1e7f0', background: '#fcfdfe' }}
                                            onClick={() => status !== 'recording' && fileInputRef.current.click()}
                                        >
                                            <Upload size={32} color="var(--google-blue)" style={{ marginBottom: '1rem' }} />
                                            <h4 className="google-font">Upload Audio</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MP3, WAV, M4A</p>
                                            <input type="file" ref={fileInputRef} hidden accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
                                        </div>
                                        <div
                                            className={`upload-zone ${status === 'recording' ? 'live' : ''}`}
                                            style={{ padding: '3rem 1.5rem', background: status === 'recording' ? '#fff5f5' : '#fcfdfe', border: '2px solid transparent' }}
                                            onClick={() => status === 'idle' ? setStatus('recording') : (status === 'recording' && (setStatus('processing'), simulateTranscription()))}
                                        >
                                            {status === 'recording' ? <Square size={32} color="var(--google-red)" fill="var(--google-red)" /> : <Mic size={32} color="var(--google-red)" />}
                                            <h4 className="google-font">{status === 'recording' ? 'Stop Recording' : 'Live Record'}</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{status === 'recording' ? formatTime(recordingTime) : 'Hostel Noise-Aware'}</p>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                            {file && status === 'idle' && (
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--google-blue-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <FileAudio size={20} color="var(--google-blue)" />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{file.name}</span>
                                    </div>
                                    <button className="btn-modern btn-solid" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => { setStatus('processing'); simulateTranscription(); }}>
                                        <Play size={16} /> Process Now
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Subjects Grid */}
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 className="google-font" style={{ margin: 0 }}>My Subjects</h2>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{subjects.length} Subjects Organized</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {subjects.map((sub, i) => (
                                    <motion.div
                                        key={i}
                                        className="subject-card"
                                        style={{
                                            background: sub.color,
                                            padding: '2rem',
                                            borderRadius: '24px',
                                            color: 'white',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                        }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
                                            <BookOpen size={120} />
                                        </div>
                                        <div style={{ position: 'relative', zIndex: 2 }}>
                                            <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                                                {sub.notes} NOTES
                                            </div>
                                            <h3 className="google-font" style={{ fontSize: '1.4rem', margin: 0 }}>{sub.name}</h3>
                                            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                                View Archives <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                <motion.div
                                    className="subject-card-add"
                                    style={{ border: '2px dashed #cbd5e0', padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#718096' }}
                                    onClick={() => setShowSubjectModal(true)}
                                    whileHover={{ background: '#edf2f7' }}
                                >
                                    <Plus size={32} style={{ marginBottom: '0.5rem' }} />
                                    <span style={{ fontWeight: 600 }}>Add New Subject</span>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Stats Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Quick Stats */}
                        <div className="lab-card" style={{ padding: '1.5rem', background: 'white', borderRadius: '24px', border: 'none' }}>
                            <h3 className="google-font" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Study Progress</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ background: 'var(--google-blue-light)', color: 'var(--google-blue)', padding: '0.75rem', borderRadius: '12px' }}>
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Listening Time</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>24.5 Hours</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ background: 'var(--google-green-light)', color: 'var(--google-green)', padding: '0.75rem', borderRadius: '12px' }}>
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Efficiency Boost</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>+42% Result</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Exam Timetable Widget */}
                        <div className="lab-card" style={{ padding: '1.5rem', background: 'white', borderRadius: '24px', border: 'none' }}>
                            <h3 className="google-font" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Exam Timetable</h3>
                            <div style={{ padding: '2rem 1rem', border: '1px dashed #e2e8f0', borderRadius: '16px', textAlign: 'center' }}>
                                <Calendar size={32} color="#cbd5e0" style={{ marginBottom: '1rem' }} />
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>No timetable uploaded yet.</p>
                                <button className="btn-modern btn-glass" style={{ width: '100%', fontSize: '0.8rem' }} onClick={() => timetableRef.current.click()}>
                                    Upload PDF / Image
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div style={{ padding: '1rem' }}>
                            <h3 className="google-font" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Activity</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { type: 'note', text: 'Introduction to AI Notes generated' },
                                    { type: 'exam', text: 'Maths Midterm scheduled' },
                                    { type: 'note', text: 'History of OS cleaned' }
                                ].map((act, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--google-blue)', marginTop: 6 }}></div>
                                        <span>{act.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Subject Modal */}
            <AnimatePresence>
                {showSubjectModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }}>
                        <motion.div
                            className="lab-card"
                            style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <h3 className="google-font" style={{ marginBottom: '1.5rem' }}>Add New Subject</h3>
                            <input
                                type="text"
                                placeholder="Subject Name (e.g. Physics)"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                autoFocus
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-modern btn-glass" style={{ flex: 1 }} onClick={() => setShowSubjectModal(false)}>Cancel</button>
                                <button className="btn-modern btn-solid" style={{ flex: 1 }} onClick={addSubject}>Create Section</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
