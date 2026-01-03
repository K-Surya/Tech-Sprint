const calculateVariance = (values) => {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map((v) => Math.pow(v - mean, 2));
  return squareDiffs.reduce((a, b) => a + b, 0) / values.length;
};

export const analyzePerformance = (lectures) => {
  let totalLectures = lectures.length;
  let attemptedLectures = 0;
  let lectureAvgScores = [];
  let lectureTrends = [];

  lectures.forEach((lecture) => {
    // Backend expects 'attempts', but legacy frontend used 'scores'
    const rawAttempts = lecture.attempts || lecture.scores || [];
    if (rawAttempts.length === 0) return;

    attemptedLectures++;

    // Sort by timestamp ascending (oldest first) to determine order
    // Handle both numeric and ISO string timestamps
    const sortedAttempts = [...rawAttempts].sort((a, b) => {
      const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp;
      const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp;
      return timeA - timeB;
    });

    // Take last 3 attempts
    const recentAttempts = sortedAttempts.slice(-3);

    // Normalize scores (score / total)
    // Fallback if total is missing (assume total is 10 for legacy quizzes if score <= 10, otherwise assume score is the percentage)
    const normalizedScores = recentAttempts.map((a) => {
      if (a.total && a.total > 0) {
        return a.score / a.total;
      }
      // Legacy fallback
      if (a.score > 1) return a.score / 10; // Assume out of 10
      return a.score; // Assume it was already normalized or 0/1
    });

    // Compute Lecture Avg Score
    const avg =
      normalizedScores.reduce((a, b) => a + b, 0) / normalizedScores.length;
    lectureAvgScores.push(avg);

    // Compute Lecture Trend (Last - First)
    const trend =
      normalizedScores.length > 1
        ? normalizedScores[normalizedScores.length - 1] - normalizedScores[0]
        : 0;
    lectureTrends.push(trend);
  });

  // Aggregate Metrics
  const avgScore =
    lectureAvgScores.length > 0
      ? lectureAvgScores.reduce((a, b) => a + b, 0) / lectureAvgScores.length
      : 0;

  const trend =
    lectureTrends.length > 0
      ? lectureTrends.reduce((a, b) => a + b, 0) / lectureTrends.length
      : 0;

  const variance = calculateVariance(lectureAvgScores);
  const consistency = 1 / (1 + variance);
  const coverage = totalLectures > 0 ? attemptedLectures / totalLectures : 0;

  // KMS Calculation
  const kms = 0.45 * avgScore + 0.25 * Math.max(trend, 0) + 0.2 * consistency + 0.1 * coverage;

  return { kms, metrics: { avgScore, trend, consistency, coverage } };
};