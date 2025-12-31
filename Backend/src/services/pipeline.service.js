import { analyzePerformance } from "./analytics.service.js";
import { createStudyPlan, determineWeaknessLevel } from "./studyPlan.service.js";

export const processQuizData = async (data) => {
  const { subjectId, lectures } = data;

  const { kms, metrics } = analyzePerformance(lectures || []);

  const studyPlan = createStudyPlan(kms);
  const weaknessLevel = determineWeaknessLevel(kms);

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