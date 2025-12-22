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
    FileText,
    BrainCircuit,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- Flashcard Component ---
const FlashcardDeck = ({ userId, subjectId, lectureId, onBack }) => {
    const [cards, setCards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;
        const setupSubscription = async () => {
            try {
                const { subscribeToFlashcards } = await import('../services/db');
                unsubscribe = subscribeToFlashcards(userId, subjectId, lectureId, (data) => {
                    setCards(data);
                    setLoading(false);
                });
            } catch (error) {
                console.error("Failed to subscribe to flashcards:", error);
                setLoading(false);
            }
        };
        setupSubscription();
        return () => unsubscribe && unsubscribe();
    }, [userId, subjectId, lectureId]);

    const nextCard = () => {
        if (cards.length === 0) return;
        setIsFlipped(false);
        setTimeout(() => setCurrentCard((prev) => (prev + 1) % cards.length), 200);
    };

    const prevCard = () => {
        if (cards.length === 0) return;
        setIsFlipped(false);
        setTimeout(() => setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length), 200);
    };

    if (loading) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <Loader2 className="spinner" size={48} />
                <p className="google-font">Loading Flashcards...</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
                    <h3 className="google-font">No Flashcards Found</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Click "Generate" on the lecture page to create some.</p>
                    <button onClick={onBack} className="btn-modern btn-solid" style={{ marginTop: '1rem' }}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={onBack} className="btn-modern btn-glass" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </button>
                <h2 className="google-font" style={{ margin: 0 }}>Flashcards: {loading ? 'Loading...' : `Study Set (${cards.length})`}</h2>
                <span style={{ marginLeft: 'auto', background: 'var(--google-blue-light)', color: 'var(--google-blue)', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {currentCard + 1} / {cards.length}
                </span>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
                <motion.div
                    className="flashcard"
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '600px',
                        height: '400px',
                        cursor: 'pointer',
                        transformStyle: 'preserve-3d',
                    }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: 'white',
                        borderRadius: '24px',
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        border: '1px solid #e1e7f0',
                        textAlign: 'center'
                    }}>
                        <span style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px' }}>QUESTION</span>
                        <h3 style={{ fontSize: '1.5rem', lineHeight: 1.5, color: '#1a202c' }}>{cards[currentCard].question}</h3>
                        <p style={{ position: 'absolute', bottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Click to flip</p>
                    </div>

                    {/* Back */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        background: '#f8faff', // NotebookLM uses very light backgrounds
                        borderRadius: '24px',
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        border: '1px solid #e1e7f0',
                        transform: 'rotateY(180deg)',
                        textAlign: 'center'
                    }}>
                        <span style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'var(--google-blue)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px' }}>ANSWER</span>
                        <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: '#2d3748' }}>{cards[currentCard].answer}</p>
                    </div>
                </motion.div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
                <button onClick={prevCard} className="btn-modern btn-glass" style={{ width: 120, justifyContent: 'center' }}>Previous</button>
                <button onClick={nextCard} className="btn-modern btn-solid" style={{ width: 120, justifyContent: 'center' }}>Next</button>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---

const Dashboard = ({ user, onLogout }) => {
    const [status, setStatus] = useState('idle');
    const [file, setFile] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const [isCopied, setIsCopied] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);

    // Navigation State
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [viewMode, setViewMode] = useState('subject'); // 'subject', 'lecture', 'flashcards'

    const [subjects, setSubjects] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [newSubject, setNewSubject] = useState('');

    const timerRef = useRef(null);
    const fileInputRef = useRef(null);
    const timetableRef = useRef(null);

    // Initial User Setup & Data Fetching
    useEffect(() => {
        if (user) {
            import('../services/db').then(({ initializeUser, subscribeToSubjects }) => {
                initializeUser(user);
                const unsubscribe = subscribeToSubjects(user.uid, (data) => {
                    setSubjects(data);
                });
                return () => unsubscribe();
            });
        }
    }, [user]);

    // Fetch Lectures when Subject is Selected
    useEffect(() => {
        if (user && selectedSubject) {
            import('../services/db').then(({ subscribeToLectures }) => {
                const unsubscribe = subscribeToLectures(user.uid, selectedSubject.id, (data) => {
                    setLectures(data);
                });
                return () => unsubscribe();
            });
        } else {
            setLectures([]);
        }
    }, [user, selectedSubject]);

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

    const saveLectureToDB = async (transcriptText) => {
        if (!user || !selectedSubject) return;

        const lectureData = {
            title: `Lecture ${lectures.length + 1}`,
            transcript: transcriptText,
            duration: recordingTime,
            summary: transcriptText.slice(0, 100) + '...', // Simple summary for now
            type: file ? 'Upload' : 'Recording'
        };

        try {
            const { addLecture } = await import('../services/db');
            await addLecture(user.uid, selectedSubject.id, lectureData);
            console.log("Lecture saved!");
        } catch (error) {
            console.error("Failed to save lecture:", error);
        }
    };

    const simulateTranscription = () => {
        setTimeout(async () => {
            setStatus('completed');
            const resultText = `SUMMARY: ADVANCED DATA STRUCTURES - SEGMENT TREES

A Segment Tree is a tree data structure used for storing information about intervals, or segments. It allows querying which of the stored segments contain a given point.

KEY CONCEPTS:
1. Range Queries: Efficiently find sums, mins, or maxes in a range.
2. Update Efficiency: O(log N) for both updates and queries.
3. Memory: Space complexity is approximately 4N.

[EXAM ALERT]
Expect a question on "Lazy Propagation" in Segment Trees for range updates.`;

            setTranscription(resultText);

            // Auto-save to DB
            await saveLectureToDB(resultText);

            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335']
            });
        }, 3000);
    };

    const addSubject = async () => {
        if (newSubject.trim() && user) {
            const colors = [
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];

            try {
                const { addSubject } = await import('../services/db');
                await addSubject(user.uid, newSubject, color);
                setNewSubject('');
                setShowSubjectModal(false);
            } catch (error) {
                console.error("Error adding subject:", error);
                alert("Failed to create subject. Check console.");
            }
        }
    };

    const generateAndSaveFlashcards = async () => {
        if (!user || !selectedSubject || !selectedLecture) return;

        // NotebookLM style cards - clean, scholarly look (Simulated AI Generation)
        const generatedCards = [
            { question: "What is a Segment Tree?", answer: "A tree data structure used for storing information about intervals, allowing efficient range queries." },
            { question: "What is the time complexity for updates?", answer: "O(log N) for both updates and range queries." },
            { question: "What is Lazy Propagation?", answer: "A technique to delay updates to children nodes until they are needed, optimizing range updates to O(log N)." },
            { question: "What is the space complexity?", answer: "Approximately 4N where N is the number of elements in the array." }
        ];

        try {
            const { addFlashcards } = await import('../services/db');
            await addFlashcards(user.uid, selectedSubject.id, selectedLecture.id, generatedCards);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: 0.8, y: 0.2 }
            });

            setViewMode('flashcards');
        } catch (error) {
            console.error("Failed to save flashcards:", error);
            alert("Error generating flashcards. Check console.");
        }
    };

    // --- Views ---

    // 2. Lecture Detail View
    const LectureDetailView = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ height: '100%' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => { setSelectedLecture(null); setViewMode('subject'); }}
                    className="btn-modern btn-glass"
                    style={{ padding: '0.6rem', borderRadius: '50%' }}
                >
                    <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <div>
                    <h2 className="google-font" style={{ margin: 0, fontSize: '2rem' }}>{selectedLecture.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Processed Notes & Study Material</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-modern btn-solid"
                        onClick={generateAndSaveFlashcards}
                        style={{ background: 'var(--grad-primary)', border: 'none' }}
                    >
                        <BrainCircuit size={18} /> Generate Flashcards
                    </button>
                </div>
            </div>

            <div className="lab-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', border: 'none', minHeight: '600px', whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                {selectedLecture.transcript}
            </div>
        </motion.div>
    );

    // 1. Subject Detail View
    const SubjectDetailView = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => { setSelectedSubject(null); setLectures([]); }}
                    className="btn-modern btn-glass"
                    style={{ padding: '0.6rem', borderRadius: '50%' }}
                >
                    <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <div>
                    <h2 className="google-font" style={{ margin: 0, fontSize: '2rem' }}>{selectedSubject.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Subject Workspace</p>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Area: Audio Lab & Notes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* The Audio Lab */}
                    <motion.div
                        className="lab-card"
                        style={{ padding: '2.5rem', borderRadius: '32px', border: 'none', background: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
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
                                        <p style={{ color: 'var(--text-secondary)' }}>Cleaning background noise and extracting key concepts.</p>
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
                                        <button className="btn-modern btn-solid" onClick={() => { setStatus('idle'); setTranscription(''); }}>
                                            <CheckCircle2 size={18} /> Done (Saved)
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
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{status === 'recording' ? formatTime(recordingTime) : 'Noise-Aware'}</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Recent Lectures List (New) */}
                    <div>
                        <h3 className="google-font" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your Lectures</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {lectures.length === 0 && (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', width: '100%', fontStyle: 'italic' }}>
                                    No lectures recorded yet. Start recording above!
                                </p>
                            )}
                            {lectures.map((lecture, i) => (
                                <div
                                    key={lecture.id}
                                    onClick={() => { setSelectedLecture(lecture); setViewMode('lecture'); }}
                                    style={{
                                        background: 'white',
                                        borderRadius: '20px',
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s ease',
                                        // Simple gradient effect wrapper could be added here
                                    }}
                                    className="lecture-card-hover"
                                >
                                    <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem', fontWeight: 700 }}>
                                        {i + 1}
                                    </div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{lecture.title}</h4>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={14} /> {new Date(lecture.createdAt?.seconds * 1000).toLocaleDateString() || 'Just now'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="lab-card" style={{ padding: '1.5rem', background: 'white', borderRadius: '24px', border: 'none' }}>
                        <h3 className="google-font" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Next Exam</h3>
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <Calendar size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                            <p>No exams scheduled.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="dashboard-container" style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8faff' }}>
            <div className="container" style={{ padding: '2rem 1rem' }}>

                {/* Dashboard Header - Show only if no subject selected */}
                {!selectedSubject && (
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
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Select a subject to start recording or view notes.</p>
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
                )}

                <AnimatePresence mode="wait">
                    {/* View Router */}
                    {viewMode === 'flashcards' && selectedLecture ? (
                        <FlashcardDeck
                            key="flashcards"
                            userId={user.uid}
                            subjectId={selectedSubject.id}
                            lectureId={selectedLecture.id}
                            onBack={() => setViewMode('lecture')}
                        />
                    ) : viewMode === 'lecture' && selectedLecture ? (
                        <LectureDetailView key="lecture" />
                    ) : selectedSubject ? (
                        <SubjectDetailView key="subject" />
                    ) : (
                        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                            {/* Main Area: Subjects List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Subjects Grid */}
                                <div>
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
                                                onClick={() => { setSelectedSubject(sub); setViewMode('subject'); }} // Set selected subject and mode
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
                                                    <BookOpen size={120} />
                                                </div>
                                                <div style={{ position: 'relative', zIndex: 2 }}>
                                                    <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
                                                        {sub.notes || 0} NOTES
                                                    </div>
                                                    <h3 className="google-font" style={{ fontSize: '1.4rem', margin: 0 }}>{sub.name}</h3>
                                                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                                        Open Workspace <ChevronRight size={16} />
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

                            {/* Sidebar / Stats Area - Only visible on main dashboard */}
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
                    )}
                </AnimatePresence>
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
