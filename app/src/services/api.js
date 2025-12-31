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
        console.log("DEBUG: API Response Data:", data);

        let notesResult = data.notes || data.summary || data.content;

        // If data itself is a string, it might be the notes
        if (!notesResult && (typeof data === 'string')) {
            notesResult = data;
        }

        // Handle potential double-stringified JSON or direct object
        if (typeof notesResult === 'string' && (notesResult.startsWith('{') || notesResult.startsWith('['))) {
            try {
                const parsed = JSON.parse(notesResult);
                notesResult = parsed.notes || parsed.summary || parsed.content || parsed;
                console.log("DEBUG: Parsed internal JSON:", notesResult);
            } catch (e) {
                console.warn("Attempted to parse notes as JSON but failed:", e);
            }
        }

        if (!notesResult) {
            console.error("API returned no identifiable notes content. Full response:", data);
            // Final fallback: stringify the whole response if it's an object, otherwise use as is
            notesResult = typeof data === 'string' ? data : (data ? JSON.stringify(data) : null);
        }

        // Absolute last resort
        if (!notesResult) {
            notesResult = "No clear content found in AI response.";
        }

        const finalResult = {
            notes: typeof notesResult === 'string' ? notesResult : JSON.stringify(notesResult),
            title: data.title || null
        };
        console.log("DEBUG: Final Returning Object:", finalResult);
        return finalResult;
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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to generate quiz (Status ${response.status}): ${errorText}`);
        }

        const text = await response.text();
        console.log("Raw Quiz API Response:", text); // Debug log

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error("Invalid JSON from server: " + text.slice(0, 100));
        }

        let quizResult = data.quiz;

        // Handle potential double-stringified JSON from backend
        if (typeof quizResult === 'string') {
            try {
                const parsed = JSON.parse(quizResult);
                // The inner object might contain metadata like "subject" and the actual "quiz" array
                if (parsed.quiz && Array.isArray(parsed.quiz)) {
                    quizResult = parsed.quiz;
                } else {
                    quizResult = parsed;
                }
            } catch (e) {
                console.warn("Received string quiz data but failed to parse it as JSON:", e);
                // Keep as string? Likely useless, but let caller handle or fail.
            }
        }

        return quizResult;
    } catch (error) {
        console.error("API generateQuiz error:", error);
        throw error;
    }
};

export const generateFlashcards = async (lectureContent, subject) => {
    try {
        // API expects 'summary' and 'subject'
        const response = await fetch(`${BASE_URL}/flashcards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summary: lectureContent, subject }),
        });

        if (!response.ok) throw new Error("Failed to generate flashcards");

        const data = await response.json();
        let flashcardsResult = data.flashcards;

        // Handle potential double-stringified JSON
        if (typeof flashcardsResult === 'string') {
            try {
                const parsed = JSON.parse(flashcardsResult);
                if (parsed.flashcards && Array.isArray(parsed.flashcards)) {
                    flashcardsResult = parsed.flashcards;
                } else if (Array.isArray(parsed)) {
                    flashcardsResult = parsed;
                } else {
                    // Start of the object might be the cards themselves if format varies?
                    flashcardsResult = parsed;
                }
            } catch (e) {
                console.warn("Received string flashcard data but failed to parse:", e);
            }
        }

        return flashcardsResult;
    } catch (error) {
        console.error("API generateFlashcards error:", error);
        throw error;
    }
};
