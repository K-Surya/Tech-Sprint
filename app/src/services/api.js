const BASE_URL = "https://tech-sprint-qn15.onrender.com/benchmate";

export const generateNotes = async (transcript, subject) => {
    try {
        const response = await fetch(`${BASE_URL}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript, subject }),
        });

        if (!response.ok) throw new Error("Failed to generate notes");

        const data = await response.json();
        if (!data.notes) {
            console.error("API returned no notes. Full response:", data);
        }
        return data.notes;
    } catch (error) {
        console.error("API generateNotes error:", error);
        throw error;
    }
};

export const generateQuiz = async (lectureContent, subject) => {
    try {
        // API expects 'summary' and 'subject'
        // We pass the lecture content (notes) as 'summary'
        const response = await fetch(`${BASE_URL}/quiz`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summary: lectureContent, subject }),
        });

        if (!response.ok) throw new Error("Failed to generate quiz");

        const data = await response.json();
        return data.quiz;
    } catch (error) {
        console.error("API generateQuiz error:", error);
        throw error;
    }
};

export const generateFlashcards = async (lectureContent) => {
    try {
        // API expects 'summary'
        const response = await fetch(`${BASE_URL}/flashcards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summary: lectureContent }),
        });

        if (!response.ok) throw new Error("Failed to generate flashcards");

        const data = await response.json();
        return data.flashcards;
    } catch (error) {
        console.error("API generateFlashcards error:", error);
        throw error;
    }
};
