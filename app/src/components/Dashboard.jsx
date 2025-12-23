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

// --- Quiz Component ---
const QuizView = ({ userId, subjectId, lectureId, quiz, onBack }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isQuizComplete, setIsQuizComplete] = useState(false);

    const finishQuiz = async (finalScore) => {
        setIsQuizComplete(true);
        confetti({
            particleCount: 300,
            spread: 120,
            origin: { y: 0.5 }
        });

        try {
            const { saveQuizScore } = await import('../services/db');
            await saveQuizScore(userId, subjectId, lectureId, finalScore);
        } catch (e) {
            console.error("Failed to save score:", e);
        }
    };

    const handleOptionSelect = (optionKey) => {
        if (selectedOption) return; // Prevent multiple selects
        setSelectedOption(optionKey);
        setShowExplanation(true);

        const correct = quiz[currentQuestion].correctAnswer === optionKey;
        if (correct) {
            setScore(prev => prev + 1);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#48bb78', '#38a169', '#2f855a']
            });
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            finishQuiz(score); // Score is already updated in handleOptionSelect
        }
    };

    // Safety check if no quiz data passed
    if (!quiz || quiz.length === 0) return (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
                <h3 className="google-font">No Quiz Found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Click "Generate Quiz" on the lecture page.</p>
                <button onClick={onBack} className="btn-modern btn-solid" style={{ marginTop: '1rem' }}>Go Back</button>
            </div>
        </div>
    );

    if (isQuizComplete) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="lab-card" style={{ padding: '3rem', textAlign: 'center', background: 'white', borderRadius: '32px' }}>
                <h2 className="google-font" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Quiz Completed!</h2>
                <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--google-blue)', marginBottom: '1rem' }}>
                    {score} / {quiz.length}
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {score >= 8 ? 'Outstanding! You are an expert.' : score >= 5 ? 'Good job! Review the notes to improve.' : 'Keep practicing!'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={onBack} className="btn-modern btn-glass">Back to Lecture</button>
                    <button onClick={() => { setCurrentQuestion(0); setScore(0); setSelectedOption(null); setIsQuizComplete(false); }} className="btn-modern btn-solid">Retake Quiz</button>
                </div>
            </motion.div>
        );
    }

    const question = quiz[currentQuestion];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={onBack} className="btn-modern btn-glass" style={{ marginRight: '1rem' }}><ArrowLeft size={20} /></button>
                <div>
                    <h2 className="google-font" style={{ margin: 0 }}>Question {currentQuestion + 1} <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>/ {quiz.length}</span></h2>
                </div>
                <div style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--google-blue)' }}>Score: {score}</div>
            </div>

            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lab-card"
                style={{ padding: '2.5rem', background: 'white', borderRadius: '24px', marginBottom: '2rem' }}
            >
                <h3 style={{ fontSize: '1.4rem', marginBottom: '2rem', lineHeight: 1.4 }}>{question.question}</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {Object.entries(question.options).map(([key, text]) => {
                        const isSelected = selectedOption === key;
                        const isCorrect = question.correctAnswer === key;
                        let bg = 'white';
                        let border = '1px solid #e2e8f0';

                        if (selectedOption) {
                            if (isSelected && isCorrect) { bg = '#f0fff4'; border = '2px solid #48bb78'; }
                            else if (isSelected && !isCorrect) { bg = '#fff5f5'; border = '2px solid #f56565'; }
                            else if (isCorrect && showExplanation) { bg = '#f0fff4'; border = '2px solid #48bb78'; }
                        }

                        return (
                            <div
                                key={key}
                                onClick={() => handleOptionSelect(key)}
                                style={{
                                    padding: '1.2rem',
                                    borderRadius: '16px',
                                    border: border,
                                    background: bg,
                                    cursor: selectedOption ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <span style={{ fontWeight: 700, minWidth: '30px', height: '30px', borderRadius: '50%', background: '#edf2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{key}</span>
                                <span style={{ fontSize: '1.05rem' }}>{text}</span>
                                {selectedOption && isCorrect && <CheckCircle2 size={20} color="#48bb78" style={{ marginLeft: 'auto' }} />}
                            </div>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {showExplanation && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '2rem', padding: '1.5rem', background: '#ebf8ff', borderRadius: '16px', color: '#2c5282' }}>
                            <strong>Explanation:</strong> {question.explanation}
                        </motion.div>
                    )}
                </AnimatePresence>

                {selectedOption && (
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={nextQuestion} className="btn-modern btn-solid" style={{ padding: '0.8rem 2rem' }}>
                            {currentQuestion < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// --- Main Dashboard Component ---

// Isolated Recorder Component to prevent Dashboard re-renders
const AudioRecorder = ({ onSave }) => {
    const [status, setStatus] = useState('idle');
    const [transcription, setTranscription] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (status === 'recording') {
            timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } else {
            clearInterval(timerRef.current);
            if (status !== 'completed') setRecordingTime(0);
        }
        return () => clearInterval(timerRef.current);
    }, [status]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
                finalTranscript += event.results[i][0].transcript;
            }
            setTranscription(finalTranscript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed') {
                alert("Microphone access denied. Please allow microphone access.");
                stopRecording();
            }
        };

        recognition.onend = () => {
            if (status === 'recording' && recognitionRef.current) {
                try {
                    recognition.start();
                } catch (e) { }
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
        setStatus('recording');
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            recognitionRef.current.stop();
        }
        setStatus('completed');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{ padding: '2rem', borderRadius: '24px', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.6)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="heading-font" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <Volume2 className="text-gradient" /> Audio Transcription Lab
                </h2>
                {status !== 'idle' && (
                    <button className="btn-modern btn-glass" onClick={() => { setStatus('idle'); setTranscription(''); }} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                        <RefreshCw size={14} /> New Session
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {status === 'recording' ? (
                    <motion.div
                        key="recording"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '2rem' }}
                    >
                        <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #fed7d7', borderTopColor: '#f56565', margin: '0 auto 1.5rem' }}></div>
                        <h3 className="google-font" style={{ color: '#e53e3e' }}>Listening...</h3>
                        <p style={{ fontSize: '1.1rem', color: '#2d3748', minHeight: '60px', marginTop: '1rem' }}>
                            {transcription || "Speak clearly into your microphone..."}
                        </p>
                        <button onClick={stopRecording} className="btn-modern btn-solid" style={{ background: '#f56565', color: 'white', marginTop: '1rem' }}>
                            <Square size={16} fill="white" /> Stop Recording
                        </button>
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
                            <button
                                className="btn-modern btn-solid"
                                style={{ background: 'var(--grad-primary)', padding: '0.8rem 2rem' }}
                                onClick={async () => { await onSave(transcription); setStatus('idle'); setTranscription(''); }}
                            >
                                <Sparkles size={18} /> Generate Notes
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div
                            className="upload-zone"
                            style={{ padding: '3rem 1.5rem', border: '2px dashed #e1e7f0', background: '#fcfdfe' }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <Upload size={32} color="var(--google-blue)" style={{ marginBottom: '1rem' }} />
                            <h4 className="google-font">Upload Audio</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>MP3, WAV, M4A</p>
                            <input type="file" ref={fileInputRef} hidden accept="audio/*" onChange={(e) => { /* Handle file upload if needed later */ }} />
                        </div>
                        <div
                            className={`upload-zone ${status === 'recording' ? 'live' : ''}`}
                            style={{ padding: '3rem 1.5rem', background: status === 'recording' ? '#fff5f5' : '#fcfdfe', border: '2px solid transparent' }}
                            onClick={startRecording}
                        >
                            <Mic size={32} color="var(--google-red)" />
                            <h4 className="google-font">Live Record</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click to Speak</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Extracted Views ---

const LectureDetailView = ({
    selectedLecture,
    setSelectedLecture,
    setViewMode,
    generateAndSaveFlashcards,
    generateAndSaveQuiz
}) => (
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
                <button
                    className="btn-modern btn-solid"
                    onClick={generateAndSaveQuiz}
                    style={{ background: '#fff', color: '#1a202c', border: '1px solid #e2e8f0' }}
                >
                    <Sparkles size={18} className="text-gradient" /> Generate Quiz
                </button>
            </div>
        </div>

        <div className="lab-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', border: 'none', minHeight: '600px', whiteSpace: 'pre-line', lineHeight: 1.8 }}>
            {selectedLecture.transcript}
        </div>
    </motion.div>
);

const SubjectDetailView = ({
    selectedSubject,
    setSelectedSubject,
    setLectures,
    saveLectureToDB,
    lectures,
    setSelectedLecture,
    setViewMode,
    timetableRef
}) => (
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
                {/* Isolated Recorder Component */}
                <AudioRecorder onSave={saveLectureToDB} />

                {/* Recent Lectures List (New) */}
                <div>
                    <h3 className="google-font" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your Lectures</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {lectures.length === 0 && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', width: '100%', fontStyle: 'italic' }}>
                                No lectures recorded yet. Start recording above!
                            </p>
                        )}
                        {lectures.map((lecture, i) => {
                            const lectureNumber = lectures.length - i;
                            // Use the exact same gradient as the home page (brand blue)
                            const bg = 'var(--grad-primary)';

                            return (
                                <div
                                    key={lecture.id}
                                    onClick={() => { setSelectedLecture(lecture); setViewMode('lecture'); }}
                                    style={{
                                        background: bg,
                                        borderRadius: '20px',
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        border: 'none',
                                        transition: 'all 0.2s ease',
                                        color: 'white',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                    }}
                                    className="lecture-card-hover"
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                            {lectureNumber}
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem' }}>
                                            {i === 0 ? 'Latest' : 'Saved'}
                                        </div>
                                    </div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 600 }}>{lecture.title}</h4>
                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={14} /> {new Date(lecture.createdAt?.seconds * 1000).toLocaleDateString() || 'Just now'}
                                    </div>
                                </div>
                            )
                        })}
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

const Dashboard = ({ user, onLogout }) => {
    const [status, setStatus] = useState('idle');
    const [file, setFile] = useState(null);
    const [transcription, setTranscription] = useState('');
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

    // Recording logic moved to AudioRecorder component for performance
    const saveLectureToDB = async (transcriptText) => {
        if (!user || !selectedSubject) return;

        const lectureData = {
            title: `Lecture ${lectures.length + 1}`,
            transcript: transcriptText,
            duration: 0, // Simplified for now since duration was state-dependent
            summary: transcriptText.slice(0, 100) + '...',
            type: 'Recording'
        };

        try {
            const { addLecture } = await import('../services/db');
            await addLecture(user.uid, selectedSubject.id, lectureData);
            console.log("Lecture saved!");
        } catch (error) {
            console.error("Failed to save lecture:", error);
        }
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

    // Keep selectedLecture in sync with real-time updates
    useEffect(() => {
        if (selectedLecture) {
            const updatedLecture = lectures.find(l => l.id === selectedLecture.id);
            if (updatedLecture) {
                setSelectedLecture(updatedLecture);
            }
        }
    }, [lectures]);


    const generateAndSaveQuiz = async () => {
        if (!user || !selectedSubject || !selectedLecture) return;

        const generatedQuiz = [
            {
                question: "What is the primary purpose of a Segment Tree?",
                options: { "A": "Sorting arrays", "B": "Performing range queries efficiently", "C": "Storing strings", "D": "Compressing images" },
                correctAnswer: "B",
                explanation: "Segment Trees are designed to handle range queries (like sum, min, max) and point updates in logarithmic time."
            },
            {
                question: "What is the time complexity for a range query in a Segment Tree?",
                options: { "A": "O(1)", "B": "O(N)", "C": "O(log N)", "D": "O(N log N)" },
                correctAnswer: "C",
                explanation: "Both updates and range queries take O(log N) time because the tree height is logarithmic."
            },
            {
                question: "How much space does a Segment Tree typically require?",
                options: { "A": "N", "B": "2N", "C": "4N", "D": "N^2" },
                correctAnswer: "C",
                explanation: "A safe upper bound for the array size representing a Segment Tree is 4*N."
            },
            {
                question: "Which technique allows for efficient range updates?",
                options: { "A": "Lazy Propagation", "B": "Binary Search", "C": "Hashing", "D": "Dynamic Programming" },
                correctAnswer: "A",
                explanation: "Lazy Propagation delays updates to children nodes until they are accessed, maintaining O(log N) performance."
            },
            {
                question: "What is a leaf node in a Segment Tree represent?",
                options: { "A": "A range sum", "B": "A single element of the array", "C": "The root sum", "D": "An update operation" },
                correctAnswer: "B",
                explanation: "Leaf nodes in a Segment Tree correspond to individual elements of the original array (interval [i, i])."
            },
            {
                question: "Segment Trees are essentially what type of tree?",
                options: { "A": "Binary Tree", "B": "B-Tree", "C": "Red-Black Tree", "D": "AVL Tree" },
                correctAnswer: "A",
                explanation: "They are full binary trees where each node represents an interval."
            },
            {
                question: "Can Segment Trees handle non-invertible operations like MAX?",
                options: { "A": "Yes", "B": "No", "C": "Only if sorted", "D": "Only with hashing" },
                correctAnswer: "A",
                explanation: "Yes, Segment Trees work well with any associative operation, including MAX, MIN, GCD, and SUM."
            },
            {
                question: "If an array has 8 elements, what is the height of the Segment Tree?",
                options: { "A": "3", "B": "4", "C": "8", "D": "1" },
                correctAnswer: "B",
                explanation: "The height is roughly log2(N). For N=8, log2(8) = 3, but implementation often uses height 4 to cover the range."
            },
            {
                question: "Building a Segment Tree takes what time complexity?",
                options: { "A": "O(N)", "B": "O(N log N)", "C": "O(log N)", "D": "O(1)" },
                correctAnswer: "A",
                explanation: "A Segment Tree can be built in O(N) time using a divide-and-conquer approach."
            },
            {
                question: "In 1-based indexing, if a node is at index 'i', where is its left child?",
                options: { "A": "2*i", "B": "2*i + 1", "C": "i + 1", "D": "i/2" },
                correctAnswer: "A",
                explanation: "Standard heap-like indexing puts the left child at 2*i and the right child at 2*i + 1."
            }
        ];

        try {
            const { updateLectureQuiz } = await import('../services/db');
            await updateLectureQuiz(user.uid, selectedSubject.id, selectedLecture.id, generatedQuiz);

            confetti({ particleCount: 100, spread: 70, origin: { x: 0.8, y: 0.2 } });
            setViewMode('quiz');
        } catch (error) {
            console.error("Failed to save quiz:", error);
            alert("Error generating quiz. Check console.");
        }
    };



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
                    ) : viewMode === 'quiz' && selectedLecture ? (
                        <QuizView
                            key="quiz"
                            userId={user.uid}
                            subjectId={selectedSubject.id}
                            lectureId={selectedLecture.id}
                            quiz={selectedLecture.quiz}
                            onBack={() => setViewMode('lecture')}
                        />
                    ) : viewMode === 'lecture' && selectedLecture ? (
                        <LectureDetailView
                            key="lecture"
                            selectedLecture={selectedLecture}
                            setSelectedLecture={setSelectedLecture}
                            setViewMode={setViewMode}
                            generateAndSaveFlashcards={generateAndSaveFlashcards}
                            generateAndSaveQuiz={generateAndSaveQuiz}
                        />
                    ) : selectedSubject ? (
                        <SubjectDetailView
                            key="subject"
                            selectedSubject={selectedSubject}
                            setSelectedSubject={setSelectedSubject}
                            setLectures={setLectures}
                            saveLectureToDB={saveLectureToDB}
                            lectures={lectures}
                            setSelectedLecture={setSelectedLecture}
                            setViewMode={setViewMode}
                            timetableRef={timetableRef}
                        />
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
