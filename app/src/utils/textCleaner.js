const STOPWORDS = new Set([
  "is", "was", "were", "am", "are",
  "the", "a", "an",
  "and", "or", "but", "so",
  "to", "of", "in", "on", "at", "for",
  "with", "by", "from",
  "that", "this", "these", "those",
  "it", "its", "they", "them",
  "we", "you", "i", "he", "she",
  "as", "be", "been", "being",
  "have", "has", "had",
  "do", "does", "did"
]);

export function cleanText(rawText) {
  if (!rawText) return "";

  // 1. Lowercase
  let text = rawText.toLowerCase();

  // 2. Remove filler phrases
  const fillers = [
    "uh", "um", "you know", "like", "basically",
    "actually", "literally", "i mean", "sort of", "kind of"
  ];

  fillers.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, "g");
    text = text.replace(regex, "");
  });

  // 3. Remove special characters (keep letters and spaces)
  text = text.replace(/[^a-z\s]/g, " ");

  // 4. Tokenize
  let words = text.split(/\s+/);

  // 5. Remove stopwords + repeated consecutive words
  let cleanedWords = [];
  let prevWord = "";

  for (let word of words) {
    if (
      word.length > 2 &&                 // remove tiny noise
      !STOPWORDS.has(word) &&
      word !== prevWord
    ) {
      cleanedWords.push(word);
      prevWord = word;
    }
  }

  // 6. Reconstruct cleaned text
  return cleanedWords.join(" ");
}
