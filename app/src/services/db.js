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
    deleteDoc,
    arrayUnion,
    increment,
    limit
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

export const deleteSubject = async (userId, subjectId) => {
    const subjectRef = doc(db, 'users', userId, 'subjects', subjectId);
    await deleteDoc(subjectRef);
};

export const saveSubjectRoadmap = async (userId, subjectId, roadmap) => {
    const subjectRef = doc(db, 'users', userId, 'subjects', subjectId);
    await updateDoc(subjectRef, {
        roadmap: roadmap,
        roadmapGeneratedAt: serverTimestamp()
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

// One-time fetch of lectures for a subject (used by Learning Curve)
export const getLecturesForSubject = async (userId, subjectId) => {
    const lecturesRef = collection(db, 'users', userId, 'subjects', subjectId, 'lectures');
    const q = query(lecturesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const deleteLecture = async (userId, subjectId, lectureId) => {
    const lectureRef = doc(db, 'users', userId, 'subjects', subjectId, 'lectures', lectureId);
    await deleteDoc(lectureRef);

    // Decrement subject note count
    const subjectRef = doc(db, 'users', userId, 'subjects', subjectId);
    await updateDoc(subjectRef, {
        noteCount: increment(-1)
    });
};

export const updateLecture = async (userId, subjectId, lectureId, data) => {
    const lectureRef = doc(db, 'users', userId, 'subjects', subjectId, 'lectures', lectureId);
    await updateDoc(lectureRef, data);
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

// --- Exam Timetable ---
export const addExam = async (userId, examData) => {
    const examsRef = collection(db, 'users', userId, 'exams');
    const docRef = await addDoc(examsRef, {
        ...examData,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const subscribeToExams = (userId, callback) => {
    const examsRef = collection(db, 'users', userId, 'exams');
    const q = query(examsRef, orderBy('examDate', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const exams = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(exams);
    });
};

export const deleteExam = async (userId, examId) => {
    const examRef = doc(db, 'users', userId, 'exams', examId);
    await deleteDoc(examRef);
};

export const updateExamCalendarId = async (userId, examId, calendarEventId) => {
    const examRef = doc(db, 'users', userId, 'exams', examId);
    await updateDoc(examRef, {
        calendarEventId: calendarEventId
    });
};

export const clearExamCalendarId = async (userId, examId) => {
    const examRef = doc(db, 'users', userId, 'exams', examId);
    await updateDoc(examRef, {
        calendarEventId: null
    });
};

// Save calendar authorization status
export const saveCalendarAuthStatus = async (userId, isAuthorized) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        calendarAuthorized: isAuthorized,
        calendarAuthorizedAt: new Date().toISOString()
    });
};

// Get calendar authorization status
export const getCalendarAuthStatus = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().calendarAuthorized || false : false;
};


// --- Recent Activity ---
export const logActivity = async (userId, activityData) => {
    const activityRef = collection(db, 'users', userId, 'recentActivity');
    await addDoc(activityRef, {
        ...activityData,
        timestamp: serverTimestamp()
    });
};

export const subscribeToRecentActivity = (userId, limitCount, callback) => {
    const activityRef = collection(db, 'users', userId, 'recentActivity');
    const q = query(activityRef, orderBy('timestamp', 'desc'), limit(limitCount));
    return onSnapshot(q, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(activities);
    });
};
