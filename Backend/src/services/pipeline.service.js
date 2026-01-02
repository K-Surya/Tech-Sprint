import { analyzePerformance } from "./analytics.service.js";
import { determineWeaknessLevel } from "./studyPlan.service.js";
import generateStudyPlan from "./gemini-studyplan.js";
import generateRoadmap from "./gemini-roadmap.js";

export const processQuizData = async (data) => {
  const { subjectId, lectures, examDate } = data;

  const { kms, metrics } = analyzePerformance(lectures || []);

  let daysRemaining = 7; // Default
  if (examDate) {
    const today = new Date("2025-12-31");
    const exam = new Date(examDate);
    const diffTime = exam - today;
    daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const weaknessLevel = determineWeaknessLevel(kms);
  const studyPlan = await generateStudyPlan(kms, metrics, weaknessLevel, daysRemaining);

  return {
    subjectId,
    kms: parseFloat(kms.toFixed(2)),
    metrics: {
      avgScore: parseFloat(metrics.avgScore.toFixed(2)),
      trend: parseFloat(metrics.trend.toFixed(2)),
      consistency: parseFloat(metrics.consistency.toFixed(2)),
      coverage: parseFloat(metrics.coverage.toFixed(2)),
    },
    weaknessLevel,
    studyPlan,
  };
};

export const generateRoadmapForSubject = async (data) => {
  const { subject, examDate, lectures } = data;

  // Aggregate all lecture transcripts
  const topics = (lectures || [])
    .filter(l => l.transcript)
    .map(l => l.title + ": " + (l.transcript.slice(0, 500) + "...")); // Use title and preview

  return await generateRoadmap(subject, examDate, topics);
};
