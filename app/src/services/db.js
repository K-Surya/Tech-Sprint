import { db } from '../firebase';
import {
    collection,
    doc,
    setDoc,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    orderBy,
    updateDoc,

    arrayUnion,
    increment
} from 'firebase/firestore';

// --- Users ---
export const initializeUser = async (user) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        // New User
        await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName, // Keep for reference
            nickname: user.displayName || 'Scholar', // Default nickname
            avatar: null, // Will trigger selection
            joinedAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });
    } else {
        // Existing User - just update login
        await updateDoc(userRef, {
            lastLogin: serverTimestamp()
        });
    }
};

export const getUserProfile = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};

export const updateUserProfile = async (userId, data) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
};

export const subscribeToUserProfile = (userId, callback) => {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data());
        } else {
            callback(null); // Or {} if preferred, but null matches 'not found'
        }
    });
};

// --- Subjects ---
export const addSubject = async (userId, subjectName, color) => {
    const subjectsRef = collection(db, 'users', userId, 'subjects');
    await addDoc(subjectsRef, {
        name: subjectName,
        color: color,
        createdAt: serverTimestamp(),
        noteCount: 0
    });
};

export const subscribeToSubjects = (userId, callback) => {
    const subjectsRef = collection(db, 'users', userId, 'subjects');
    const q = query(subjectsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const subjects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(subjects);
    });
};

// --- Lectures ---
export const addLecture = async (userId, subjectId, lectureData) => {
    const lecturesRef = collection(db, 'users', userId, 'subjects', subjectId, 'lectures');
    const docRef = await addDoc(lecturesRef, {
        ...lectureData,
        createdAt: serverTimestamp()
    });

    // Update parent subject note count
    const subjectRef = doc(db, 'users', userId, 'subjects', subjectId);
    await updateDoc(subjectRef, {
        noteCount: increment(1)
    });

    return docRef.id;
};

export const subscribeToLectures = (userId, subjectId, callback) => {
    const lecturesRef = collection(db, 'users', userId, 'subjects', subjectId, 'lectures');
    const q = query(lecturesRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const lectures = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(lectures);
    });
};

// --- Subcollections (Flashcards & Quizzes) ---
export const addFlashcards = async (userId, subjectId, lectureId, flashcards) => {
    const flashcardsRef = collection(db, 'users', userId, 'subjects', subjectId, 'lectures', lectureId, 'flashcards');
    // Batch write could be better but sticking to simple adds for now or single doc if array
    // User requested subcollection, so assuming individual cards or a set.
    // Let's store as a set for now to reduce reads, or individual docs. 
    // "flashcards/" implies subcollection.

    // For simplicity efficiently:
    const batchPromises = flashcards.map(card => addDoc(flashcardsRef, card));
    await Promise.all(batchPromises);

    // Update parent lecture document to indicate flashcards exist
    const lectureRef = doc(db, 'users', userId, 'subjects', subjectId, 'lectures', lectureId);
    await updateDoc(lectureRef, { hasFlashcards: true });
};

export const subscribeToFlashcards = (userId, subjectId, lectureId, callback) => {
    const flashcardsRef = collection(db, 'users', userId, 'subjects', subjectId, 'lectures', lectureId, 'flashcards');
    return onSnapshot(flashcardsRef, (snapshot) => {
        const flashcards = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(flashcards);
    });
};

// --- Lecture Updates (Quiz & Scores) ---

export const updateLectureQuiz = async (userId, subjectId, lectureId, quizData) => {
    const lectureRef = doc(db, 'users', userId, 'subjects', subjectId, 'lectures', lectureId);
    await updateDoc(lectureRef, {
        quiz: quizData
    });
};

export const saveQuizScore = async (userId, subjectId, lectureId, score) => {
    const lectureRef = doc(db, 'users', userId, 'subjects', subjectId, 'lectures', lectureId);
    await updateDoc(lectureRef, {
        scores: arrayUnion({
            score: score,
            timestamp: new Date().toISOString()
        })
    });
};
