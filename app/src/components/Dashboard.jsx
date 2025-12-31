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
    Sparkles,
    Clipboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Flashcard Component ---
// --- Flashcard Component --- //
const FlashcardDeck = ({ userId, subjectId, lectureId, onBack, onGenerate }) => {
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
                    <p style={{ color: 'var(--text-secondary)' }}>Click "Generate" above to create some.</p>
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
                        <h3 style={{ fontSize: '1.5rem', lineHeight: 1.5, color: '#1a202c' }}>
                            {cards[currentCard].question || cards[currentCard].front || cards[currentCard].term || "No Question Text"}
                        </h3>
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
                        <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: '#2d3748' }}>
                            {cards[currentCard].answer || cards[currentCard].back || cards[currentCard].definition || "No Answer Text"}
                        </p>
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
// --- Quiz Component --- //
const QuizView = ({ userId, subjectId, lectureId, quiz, onBack, onGenerate }) => {
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
                <p style={{ color: 'var(--text-secondary)' }}>Click "Generate" above to create one.</p>
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
                <h3 style={{ fontSize: '1.4rem', marginBottom: '2rem', lineHeight: 1.4 }}>
                    {question.question || question.text || question.query || "Question Text Missing"}
                </h3>
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
    const [pasting, setPasting] = useState(false);
    const [pastedText, setPastedText] = useState("");

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
                                onClick={async () => {
                                    try {
                                        setStatus('processing');
                                        // 1. Generate Notes via API
                                        const { generateNotes } = await import('../services/api');
                                        // Pass "General" as subject for now since we are in a subject context?
                                        // Actually AudioRecorder doesn't know the subject. 
                                        // Ideally we should pass subject name prop to AudioRecorder or just use "General".
                                        // Wait, onSave is passed from Dashboard -> saveLectureToDB
                                        // Let's keep AudioRecorder emitting raw text, 
                                        // and move the API call to saveLectureToDB in Dashboard main component.
                                        // REVERTING this specific change to keep AudioRecorder simple.
                                        await onSave(transcription);
                                        setStatus('idle');
                                        setTranscription('');
                                    } catch (e) {
                                        console.error(e);
                                        alert("Failed to generate notes");
                                        setStatus('completed'); // Keep text so user can try again
                                    }
                                }}
                            >
                                <Sparkles size={18} /> Generate Notes
                            </button>
                        </div>
                    </motion.div>
                ) : status === 'processing' ? (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '3rem' }}
                    >
                        <Loader2 className="spinner" size={48} color="var(--google-blue)" style={{ marginBottom: '1.5rem' }} />
                        <h3 className="google-font">Generating Magic Notes...</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>AI is structuring your content, please wait.</p>
                    </motion.div>
                ) : pasting ? (
                    <motion.div
                        key="pasting"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <h3 className="google-font" style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Paste Textbook / Note Content</h3>
                        <textarea
                            value={pastedText}
                            onChange={(e) => setPastedText(e.target.value)}
                            placeholder="Paste your chapter content, summaries, or raw notes here..."
                            style={{
                                width: '100%',
                                minHeight: '200px',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                border: '2px solid #e1e7f0',
                                background: '#fcfdfe',
                                fontSize: '1rem',
                                lineHeight: 1.6,
                                marginBottom: '1.5rem',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                className="btn-modern btn-glass"
                                onClick={() => { setPasting(false); setPastedText(""); }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-modern btn-solid"
                                onClick={async () => {
                                    if (!pastedText.trim()) return;
                                    try {
                                        setStatus('processing');
                                        await onSave(pastedText);
                                        // On success, reset (parent handles data)
                                        setStatus('idle');
                                        setPasting(false);
                                        setPastedText("");
                                    } catch (e) {
                                        console.error(e);
                                        // Error handled by parent alert
                                        // Stay in pasting mode to let user retry? 
                                        // Actually if we set status processing, we lost the pasting view state. 
                                        // Better to setStatus('processing') then if error revert to pasting?
                                        // Complex state management locally.
                                        // Simplification: For paste, just show loading on the button, don't change main status.
                                        // But for consistency let's use the full screen loader for now.

                                        // Revert to pasting state on error
                                        setStatus('idle'); // Need to differentiate "idle-pasting" vs "idle-home"
                                        setPasting(true);
                                    }
                                }}
                                disabled={!pastedText.trim()}
                            >
                                <Sparkles size={18} /> Generate Notes
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div
                            className={`upload-zone ${status === 'recording' ? 'live' : ''}`}
                            style={{ padding: '3rem 1.5rem', background: status === 'recording' ? '#fff5f5' : '#fcfdfe', border: '2px solid transparent' }}
                            onClick={startRecording}
                        >
                            <Mic size={32} color="var(--google-red)" />
                            <h4 className="google-font">Live Record</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click to Speak</p>
                        </div>
                        <div
                            className="upload-zone"
                            style={{ padding: '3rem 1.5rem', border: '2px dashed #e1e7f0', background: '#fcfdfe' }}
                            onClick={() => setPasting(true)}
                        >
                            <Clipboard size={32} color="var(--google-green)" style={{ marginBottom: '1rem' }} />
                            <h4 className="google-font">Paste Text</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Chapters / Notes</p>
                        </div>
                    </div>
                )
                }
            </AnimatePresence >
        </motion.div >
    );
};

// --- Extracted Views ---

const LectureDetailView = ({
    selectedLecture,
    setSelectedLecture,
    setViewMode,
    generateAndSaveFlashcards,
    generateAndSaveQuiz,
    userId,
    subjectId,
    removeLecture
}) => {
    const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'flashcards', 'quiz'
    const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
    const [generatingQuiz, setGeneratingQuiz] = useState(false);

    const tabs = [
        { id: 'notes', label: 'Lecture Notes', icon: FileText, visible: true },
        { id: 'flashcards', label: 'Flashcards', icon: BrainCircuit, visible: !!selectedLecture.hasFlashcards },
        { id: 'quiz', label: 'Quiz', icon: Sparkles, visible: !!selectedLecture.quiz && selectedLecture.quiz.length > 0 }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={(e) => removeLecture(e, selectedLecture.id, selectedLecture.title)}
                        className="btn-modern btn-glass"
                        style={{ color: '#e53e3e', border: '1px solid rgba(229, 62, 62, 0.2)', padding: '0.6rem 1rem' }}
                    >
                        <Trash2 size={18} /> Delete Lecture
                    </button>

                    <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>
                    {!selectedLecture.hasFlashcards && (
                        <button
                            className="btn-modern btn-solid"
                            onClick={async () => {
                                try {
                                    setGeneratingFlashcards(true);
                                    const success = await generateAndSaveFlashcards();
                                    if (success) setActiveTab('flashcards');
                                } finally {
                                    setGeneratingFlashcards(false);
                                }
                            }}
                            disabled={generatingFlashcards}
                            style={{ background: 'var(--grad-primary)', border: 'none', opacity: generatingFlashcards ? 0.7 : 1, cursor: generatingFlashcards ? 'wait' : 'pointer' }}
                        >
                            {generatingFlashcards ? (
                                <><Loader2 size={18} className="spinner" /> Generating...</>
                            ) : (
                                <><BrainCircuit size={18} /> Generate Flashcards</>
                            )}
                        </button>
                    )}

                    {(!selectedLecture.quiz || selectedLecture.quiz.length === 0) && (
                        <button
                            className="btn-modern btn-solid"
                            onClick={async () => {
                                try {
                                    setGeneratingQuiz(true);
                                    const success = await generateAndSaveQuiz();
                                    if (success) setActiveTab('quiz');
                                } finally {
                                    setGeneratingQuiz(false);
                                }
                            }}
                            disabled={generatingQuiz}
                            style={{ background: '#fff', color: '#1a202c', border: '1px solid #e2e8f0', opacity: generatingQuiz ? 0.7 : 1, cursor: generatingQuiz ? 'wait' : 'pointer' }}
                        >
                            {generatingQuiz ? (
                                <><Loader2 size={18} className="spinner" /> Generating...</>
                            ) : (
                                <><Sparkles size={18} className="text-gradient" /> Generate Quiz</>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
                {/* Inner Sidebar */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '1.5rem',
                    height: 'fit-content',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                    <h3 className="google-font" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '0.5rem' }}>Study Tools</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tabs.filter(t => t.visible).map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    border: 'none',
                                    background: activeTab === tab.id ? 'var(--google-blue-light)' : 'transparent',
                                    color: activeTab === tab.id ? 'var(--google-blue)' : 'var(--text-secondary)',
                                    fontWeight: activeTab === tab.id ? 700 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left'
                                }}
                            >
                                <tab.icon size={20} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ height: '100%', flex: 1 }}
                        >
                            {activeTab === 'notes' && (
                                <div className="lab-card" style={{ padding: '3rem', background: 'white', borderRadius: '32px', border: 'none', minHeight: '100%' }}>
                                    <div className="markdown-content">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {selectedLecture.transcript}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'flashcards' && (
                                <FlashcardDeck
                                    userId={userId}
                                    subjectId={subjectId}
                                    lectureId={selectedLecture.id}
                                    onBack={() => setActiveTab('notes')}
                                    onGenerate={generateAndSaveFlashcards}
                                />
                            )}

                            {activeTab === 'quiz' && (
                                <QuizView
                                    userId={userId}
                                    subjectId={subjectId}
                                    lectureId={selectedLecture.id}
                                    quiz={selectedLecture.quiz}
                                    onBack={() => setActiveTab('notes')}
                                    onGenerate={generateAndSaveQuiz}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

const SubjectDetailView = ({
    selectedSubject,
    setSelectedSubject,
    setLectures,
    saveLectureToDB,
    lectures,
    setSelectedLecture,
    setViewMode,
    timetableRef,
    exams,
    removeLecture,
    removeSubject
}) => {
    const subjectExams = exams.filter(e => e.subjectName === selectedSubject.name);

    return (
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

                <div style={{ marginLeft: 'auto' }}>
                    <button
                        onClick={(e) => removeSubject(e, selectedSubject.id, selectedSubject.name)}
                        className="btn-modern btn-glass"
                        style={{ color: '#e53e3e', border: '1px solid rgba(229, 62, 62, 0.2)' }}
                    >
                        <Trash2 size={18} /> Delete Subject
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
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
                                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FileText size={20} />
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600 }}>
                                                {i === 0 ? 'LATEST' : 'SAVED'}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                                            {selectedSubject.name}
                                        </div>
                                        <h4 className="google-font" style={{ margin: '0 0 0.8rem 0', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {lecture.title}
                                        </h4>
                                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {subjectExams.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <Calendar size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                    <p>No exams scheduled for this subject.</p>
                                </div>
                            ) : (
                                subjectExams.map((exam, i) => (
                                    <div key={exam.id || i} style={{
                                        background: 'var(--grad-hero)',
                                        padding: '1rem',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <div style={{ background: 'white', padding: '0.5rem', borderRadius: '12px', color: 'var(--google-red)' }}>
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{exam.subjectName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {new Date(exam.examDate).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Dashboard = ({ user, onLogout }) => {
    const [status, setStatus] = useState('idle');
    const [file, setFile] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showExamModal, setShowExamModal] = useState(false);
    const [exams, setExams] = useState([]);
    const [newExam, setNewExam] = useState({ subjectName: '', examDate: '', syncToCalendar: false });
    const [calendarAuthorized, setCalendarAuthorized] = useState(false);
    const [calendarInitialized, setCalendarInitialized] = useState(false);

    // Navigation State
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [viewMode, setViewMode] = useState('subject'); // 'subject', 'lecture', 'flashcards'

    const [subjects, setSubjects] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [newSubject, setNewSubject] = useState('');

    const timerRef = useRef(null);
    const fileInputRef = useRef(null);
    const timetableRef = useRef(null);

    // Initial User Setup & Data Fetching
    useEffect(() => {
        if (user) {
            import('../services/db').then(async ({ initializeUser, subscribeToSubjects, subscribeToExams, subscribeToRecentActivity }) => {
                initializeUser(user);
                const unsubscribeSubjects = subscribeToSubjects(user.uid, (data) => {
                    setSubjects(data);
                });
                const unsubscribeExams = subscribeToExams(user.uid, (data) => {
                    setExams(data);
                });
                const unsubscribeActivity = subscribeToRecentActivity(user.uid, 3, (data) => {
                    setRecentActivities(data);
                });
                return () => {
                    unsubscribeSubjects();
                    unsubscribeExams();
                    unsubscribeActivity();
                };
            });

            // Initialize Google Calendar and check saved auth status
            import('../services/calendar').then(async ({ initializeGoogleCalendar, isCalendarAuthorized, refreshCalendarToken }) => {
                const { getCalendarAuthStatus } = await import('../services/db');

                await initializeGoogleCalendar();
                setCalendarInitialized(true);

                // Check if user previously authorized calendar
                const savedAuthStatus = await getCalendarAuthStatus(user.uid);
                let currentAuthStatus = isCalendarAuthorized();

                if (savedAuthStatus && !currentAuthStatus) {
                    console.log('ℹ️ User previously authorized calendar, attempting silent refresh...');
                    // Try to restore session silently with email hint
                    const refreshed = await refreshCalendarToken(user.email);
                    if (refreshed) {
                        currentAuthStatus = true;
                        console.log('✨ Session restored silently!');
                    } else {
                        console.log('❌ Silent refresh failed, user needs to re-authorize');
                    }
                }

                setCalendarAuthorized(currentAuthStatus);
                console.log('📊 Calendar auth status:', currentAuthStatus ? 'Active' : savedAuthStatus ? 'Previously authorized' : 'Not authorized');
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

    // Cleanup past exams
    useEffect(() => {
        if (exams.length > 0 && calendarAuthorized) {
            const cleanupPastExams = async () => {
                const { cleanupPastEvents } = await import('../services/calendar');
                const { deleteExam } = await import('../services/db');

                const pastExamIds = await cleanupPastEvents(exams);
                // Delete past exams from database
                for (const examId of pastExamIds) {
                    await deleteExam(user.uid, examId);
                }
            };
            cleanupPastExams();
        }
    }, [exams, calendarAuthorized, user]);

    // Verify calendar sync status (detect external deletions)
    useEffect(() => {
        if (exams.length > 0 && calendarAuthorized && user) {
            const verifySyncs = async () => {
                const { verifyAllExamSyncs } = await import('../services/calendar');
                const { deleteExam } = await import('../services/db');

                // Callback to delete exam if event was deleted externally
                const deleteCallback = async (examId) => {
                    await deleteExam(user.uid, examId);
                    console.log('🗑️ Deleted exam from timetable (removed from Google Calendar externally)');
                };

                await verifyAllExamSyncs(exams, user.uid, deleteCallback);
            };

            // Run verification every 30 seconds
            const interval = setInterval(verifySyncs, 30000);
            verifySyncs(); // Run immediately on mount

            return () => clearInterval(interval);
        }
    }, [exams, calendarAuthorized, user]);

    // Recording logic moved to AudioRecorder component for performance
    const saveLectureToDB = async (rawText) => {
        if (!user || !selectedSubject) return;

        try {
            console.log("Starting note generation for subject:", selectedSubject.name);
            // 1. Call Backend API to generate structured notes
            const { generateNotes } = await import('../services/api');
            const result = await generateNotes(rawText, selectedSubject.name);
            console.log("AI Result:", result);

            if (!result || !result.notes) {
                const faultData = result ? JSON.stringify(result).slice(0, 100) : "null/undefined";
                console.error("Invalid AI response:", result);
                throw new Error(`AI returned invalid format: ${faultData}`);
            }

            const structuredNotes = result.notes;

            // Extract a title from the notes
            let extractedTitle = result.title || `Lecture ${lectures.length + 1}`;

            if (!result.title) {
                const lines = structuredNotes.split('\n');
                const subjectLower = selectedSubject.name.toLowerCase().trim();

                for (const line of lines) {
                    const cleanLine = line.trim().replace(/^[\*\#\s\_]+|[\*\#\s\_]+$/g, '');
                    if (!cleanLine || cleanLine.length < 3) continue;

                    // Skip if the extracted title is too similar to the subject name
                    const cleanLower = cleanLine.toLowerCase();
                    if (cleanLower === subjectLower ||
                        cleanLower === `${subjectLower} notes` ||
                        cleanLower === `about ${subjectLower}`) continue;

                    const originalLine = line.trim();
                    // Prioritize structured separators
                    if (originalLine.startsWith('#') ||
                        (originalLine.startsWith('**') && originalLine.endsWith('**')) ||
                        originalLine.toLowerCase().startsWith('topic:') ||
                        originalLine.toLowerCase().startsWith('title:')) {

                        let crispTitle = cleanLine.replace(/^(topic|title):\s*/i, '');

                        // Aggressive cleaning for crisp headings
                        // 1. Remove academic prefixes
                        crispTitle = crispTitle.replace(/^(understanding|introduction to|basics of|intro to|lecture:|notes on|chapter:|about|overview of)\s+/i, '');

                        // 2. Handle separators and academic suffixes
                        // Split on common separators - use the first significant part
                        crispTitle = crispTitle.split(/[\-\–\—\:]/)[0].trim();

                        // Remove academic fluff at the end
                        crispTitle = crispTitle.replace(/\s+(an introduction|basics|notes|overview|series|lecture)$/i, '');

                        // 3. Clear subject name prefix
                        if (crispTitle.toLowerCase().includes(':')) {
                            const parts = crispTitle.split(':');
                            const firstPart = parts[0].toLowerCase().trim();
                            if (firstPart === subjectLower || firstPart.includes('lecture') || firstPart.includes('notes')) {
                                crispTitle = parts.slice(1).join(':').trim();
                            }
                        }

                        // 4. Enforce 2-word limit for most professional look
                        const words = crispTitle.split(/\s+/).filter(w => w.length > 0);
                        extractedTitle = words.slice(0, 2).join(' ').replace(/[\:\-\s]+$/, '').trim();
                        break;
                    }
                }
            }

            // 2. Save both raw and structured (or just structured)
            // Storing structuredNotes as the main 'transcript' used for study
            const lectureData = {
                title: extractedTitle,
                transcript: structuredNotes, // Using AI generated notes
                rawTranscript: rawText, // Keeping raw just in case
                duration: 0,
                summary: structuredNotes.replace ? structuredNotes.slice(0, 100) + '...' : 'No summary',
                type: 'Recording'
            };

            const { addLecture, logActivity } = await import('../services/db');
            await addLecture(user.uid, selectedSubject.id, lectureData);
            await logActivity(user.uid, {
                type: 'note',
                text: `Generated notes for ${selectedSubject.name}`
            });
            console.log("Lecture saved!");
        } catch (error) {
            console.error("Failed to save lecture:", error);
            alert("⚠️ Generation Error: " + (error.message || "Something went wrong") + "\n\nPlease check your internet connection or the length of the transcript.");
            throw error; // Re-throw so AudioRecorder knows it failed
        }
    };

    const removeSubject = async (e, subjectId, subjectName) => {
        if (e) e.stopPropagation();
        const confirmed = window.confirm(
            `⚠️ DANGER: Are you sure you want to delete "${subjectName}"?\n\n` +
            `This will permanently remove the subject and ALL associated notes, flashcards, and quizzes. This action cannot be undone.`
        );

        if (confirmed) {
            try {
                const { deleteSubject, logActivity } = await import('../services/db');
                await deleteSubject(user.uid, subjectId);
                await logActivity(user.uid, {
                    type: 'subject',
                    text: `Deleted subject (and all its notes): ${subjectName}`
                });
                // Redirect to main dashboard
                setSelectedSubject(null);
                setLectures([]);
                setSelectedLecture(null);
                setViewMode('dashboard');
            } catch (error) {
                console.error("Failed to delete subject:", error);
                alert("Failed to delete subject.");
            }
        }
    };

    const removeLecture = async (e, lectureId, lectureTitle) => {
        if (e) e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${lectureTitle}"?`)) {
            try {
                const { deleteLecture, logActivity } = await import('../services/db');
                await deleteLecture(user.uid, selectedSubject.id, lectureId);
                await logActivity(user.uid, {
                    type: 'note',
                    text: `Deleted lecture: ${lectureTitle}`
                });
                // If we are currently viewing this lecture, go back to subject view
                if (selectedLecture && selectedLecture.id === lectureId) {
                    setSelectedLecture(null);
                    setViewMode('subject');
                }
            } catch (error) {
                console.error("Failed to delete lecture:", error);
                alert("Failed to delete lecture.");
            }
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
                const { addSubject, logActivity } = await import('../services/db');
                await addSubject(user.uid, newSubject, color);
                await logActivity(user.uid, {
                    type: 'subject',
                    text: `Created subject: ${newSubject}`
                });
                setNewSubject('');
                setShowSubjectModal(false);
            } catch (error) {
                console.error("Error adding subject:", error);
                alert("Failed to create subject. Check console.");
            }
        }
    };

    const addExam = async () => {
        if (newExam.subjectName.trim() && newExam.examDate && user) {
            try {
                console.log('🎯 Adding exam:', newExam);
                console.log('📊 Calendar status:', { authorized: calendarAuthorized, syncRequested: newExam.syncToCalendar });

                const examData = {
                    subjectName: newExam.subjectName,
                    examDate: newExam.examDate
                };

                // Add to database first
                const { addExam, updateExamCalendarId, logActivity } = await import('../services/db');
                const examId = await addExam(user.uid, examData);
                await logActivity(user.uid, {
                    type: 'exam',
                    text: `Scheduled exam for ${newExam.subjectName}`
                });
                console.log('✅ Exam saved to database, ID:', examId);

                // If calendar sync is enabled, create calendar event
                if (newExam.syncToCalendar && calendarAuthorized) {
                    console.log('📅 Syncing to Google Calendar...');
                    try {
                        const { createExamEvent, isCalendarAuthorized, refreshCalendarToken } = await import('../services/calendar');

                        // Check if we still have a valid token
                        if (!isCalendarAuthorized()) {
                            console.log('🔄 Token missing during sync, attempting silent refresh...');
                            const refreshed = await refreshCalendarToken(user.email);
                            if (!refreshed) {
                                throw new Error("Google Calendar session expired. Please re-link your account.");
                            }
                        }

                        const eventId = await createExamEvent(examData);
                        console.log('✅ Calendar event created, ID:', eventId);

                        // Update exam with calendar event ID
                        await updateExamCalendarId(user.uid, examId, eventId);
                        console.log('✅ Database updated with calendar event ID');
                    } catch (calError) {
                        console.error("❌ Failed to create calendar event:", calError);
                        if (calError.message?.includes("session expired")) {
                            setCalendarAuthorized(false); // Update UI to show disconnect
                        }
                        alert("Exam added but failed to sync to Google Calendar. Error: " + (calError.message || 'Unknown error'));
                    }
                } else {
                    console.log('ℹ️ Skipping calendar sync:', !newExam.syncToCalendar ? 'Not requested' : 'Not authorized');
                }

                setNewExam({ subjectName: '', examDate: '', syncToCalendar: false });
                setShowExamModal(false);
            } catch (error) {
                console.error("❌ Error adding exam:", error);
                alert("Failed to add exam. Check console for details.");
            }
        }
    };

    const handleCalendarAuth = async () => {
        try {
            const { requestCalendarAccess, isCalendarAuthorized } = await import('../services/calendar');
            const { saveCalendarAuthStatus } = await import('../services/db');

            await requestCalendarAccess(user.email);
            const authStatus = isCalendarAuthorized();
            setCalendarAuthorized(authStatus);

            // Save authorization status to database
            if (authStatus) {
                await saveCalendarAuthStatus(user.uid, true);
                console.log('✅ Calendar authorization saved to database');
            }
        } catch (error) {
            console.error("Calendar authorization failed:", error);
            alert("Failed to authorize Google Calendar access.");
        }
    };

    const removeExam = async (examId, calendarEventId) => {
        if (user) {
            try {
                // Delete from calendar first if it has an event ID
                if (calendarEventId && calendarAuthorized) {
                    const { deleteExamEvent } = await import('../services/calendar');
                    await deleteExamEvent(calendarEventId);
                }

                // Then delete from database
                const { deleteExam } = await import('../services/db');
                await deleteExam(user.uid, examId);
            } catch (error) {
                console.error("Error deleting exam:", error);
                alert("Failed to delete exam.");
            }
        }
    };

    const generateAndSaveFlashcards = async () => {
        if (!user || !selectedSubject || !selectedLecture) return false;

        try {
            // Call Backend API
            const { generateFlashcards } = await import('../services/api');
            // Use current lecture notes as summary input and pass subject name
            const generatedCards = await generateFlashcards(selectedLecture.transcript, selectedSubject.name);

            if (!generatedCards || generatedCards.length === 0) {
                alert("No flashcards could be generated from this content.");
                return false;
            }

            const { addFlashcards, logActivity } = await import('../services/db');
            await addFlashcards(user.uid, selectedSubject.id, selectedLecture.id, generatedCards);
            await logActivity(user.uid, {
                type: 'note',
                text: `Generated flashcards for ${selectedLecture.title}`
            });

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: 0.8, y: 0.2 }
            });

            // setViewMode('flashcards'); // Removed to keep navigation local
            return true;
        } catch (error) {
            console.error("Failed to save flashcards:", error);
            alert("Error generating flashcards. The backend might be busy.");
            return false;
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
        if (!user || !selectedSubject || !selectedLecture) return false;

        try {
            // Call Backend API
            const { generateQuiz } = await import('../services/api');
            // Use current lecture notes and subject name
            const generatedQuiz = await generateQuiz(selectedLecture.transcript, selectedSubject.name);

            if (!generatedQuiz || generatedQuiz.length === 0) {
                alert("No quiz could be generated. Try adding more notes.");
                return false;
            }

            const { updateLectureQuiz, logActivity } = await import('../services/db');
            await updateLectureQuiz(user.uid, selectedSubject.id, selectedLecture.id, generatedQuiz);
            await logActivity(user.uid, {
                type: 'note',
                text: `Generated quiz for ${selectedLecture.title}`
            });

            confetti({ particleCount: 100, spread: 70, origin: { x: 0.8, y: 0.2 } });
            // setViewMode('quiz'); // Removed to keep navigation local
            return true;
        } catch (error) {
            console.error("Failed to save quiz:", error);
            alert(`Error generating quiz: ${error.message || "Check console for details"}`);
            return false;
        }
    };



    return (
        <div className="dashboard-container" style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8faff' }}>
            <div className="container" style={{ padding: '2rem 1rem' }}>

                {/* Dashboard Header - Show only if no subject selected */}
                {!selectedSubject && (
                    <div className="dashboard-header" style={{ marginBottom: '3rem' }}>
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
                            <button className="btn-modern btn-glass" onClick={() => setShowExamModal(true)}>
                                <Calendar size={20} /> Add Exam
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
                            userId={user.uid}
                            subjectId={selectedSubject.id}
                            removeLecture={removeLecture}
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
                            exams={exams}
                            removeLecture={removeLecture}
                            removeSubject={removeSubject}
                        />
                    ) : (
                        <div className="dashboard-grid">

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
                                                        {Math.max(0, sub.noteCount || 0)} NOTES
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 className="google-font" style={{ fontSize: '1.1rem', margin: 0 }}>Exam Timetable</h3>
                                        <button
                                            className="btn-modern btn-glass"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                            onClick={() => setShowExamModal(true)}
                                        >
                                            <Plus size={14} /> Add
                                        </button>
                                    </div>
                                    {exams.length === 0 ? (
                                        <div style={{ padding: '2rem 1rem', border: '1px dashed #e2e8f0', borderRadius: '16px', textAlign: 'center' }}>
                                            <Calendar size={32} color="#cbd5e0" style={{ marginBottom: '1rem' }} />
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No exams scheduled yet.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {exams
                                                .filter(exam => {
                                                    // Only show upcoming exams (today and future)
                                                    const examDate = new Date(exam.examDate);
                                                    const today = new Date();
                                                    examDate.setHours(0, 0, 0, 0);
                                                    today.setHours(0, 0, 0, 0);
                                                    return examDate >= today;
                                                })
                                                .slice(0, 5)
                                                .map((exam) => {
                                                    const examDate = new Date(exam.examDate);
                                                    const today = new Date();
                                                    const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                                                    return (
                                                        <div
                                                            key={exam.id}
                                                            style={{
                                                                padding: '1rem',
                                                                background: '#f8faff',
                                                                borderRadius: '12px',
                                                                border: '1px solid #e1e7f0',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exam.subjectName}</span>
                                                                    {exam.calendarEventId && (
                                                                        <Calendar size={14} color="var(--google-blue)" title="Synced to Google Calendar" />
                                                                    )}
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                    {examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    {daysUntil >= 0 && ` • ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => removeExam(exam.id, exam.calendarEventId)}
                                                                style={{
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    padding: '0.25rem',
                                                                    color: 'var(--text-secondary)',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    )}
                                </div>

                                {/* Recent Activity */}
                                <div style={{ padding: '1rem' }}>
                                    <h3 className="google-font" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Activity</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {recentActivities.length === 0 ? (
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No recent activity yet.</p>
                                        ) : (
                                            recentActivities.map((act, i) => (
                                                <div key={act.id || i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--google-blue)', marginTop: 6 }}></div>
                                                    <div>
                                                        <span>{act.text}</span>
                                                        <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '2px' }}>
                                                            {act.timestamp ? new Date(act.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
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
                                <button className="btn-modern btn-solid" style={{ flex: 1 }} onClick={addSubject}>Create Subject</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Exam Modal */}
            <AnimatePresence>
                {showExamModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }} onClick={() => setShowExamModal(false)}>
                        <motion.div
                            className="lab-card"
                            style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: 'white' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="google-font" style={{ marginBottom: '1.5rem' }}>Add Exam</h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Subject</label>
                                <select
                                    value={newExam.subjectName}
                                    onChange={(e) => setNewExam({ ...newExam, subjectName: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem',
                                        background: 'white'
                                    }}
                                >
                                    <option value="">Select a subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.id} value={subject.name}>{subject.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Exam Date</label>
                                <input
                                    type="date"
                                    value={newExam.examDate}
                                    onChange={(e) => setNewExam({ ...newExam, examDate: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            {/* Google Calendar Sync Section */}
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                background: '#f8faff',
                                borderRadius: '12px',
                                border: '1px solid #e1e7f0'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={newExam.syncToCalendar}
                                            onChange={(e) => setNewExam({ ...newExam, syncToCalendar: e.target.checked })}
                                            disabled={!calendarAuthorized}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <Calendar size={16} />
                                        Sync to Google Calendar
                                    </label>
                                    {calendarAuthorized ? (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--google-green)', fontWeight: 600 }}>
                                            ✓ Connected
                                        </span>
                                    ) : (
                                        <button
                                            onClick={handleCalendarAuth}
                                            className="btn-modern btn-glass"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                            type="button"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                                    {calendarAuthorized
                                        ? 'Exam will be added to your Google Calendar with reminders'
                                        : 'Connect your Google Calendar to sync exams automatically'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-modern btn-glass" style={{ flex: 1 }} onClick={() => setShowExamModal(false)}>Cancel</button>
                                <button
                                    className="btn-modern btn-solid"
                                    style={{ flex: 1 }}
                                    onClick={addExam}
                                    disabled={!newExam.subjectName || !newExam.examDate}
                                >
                                    Add Exam
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
