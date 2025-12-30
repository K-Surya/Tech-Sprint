import { analyzePerformance } from "./analytics.service.js";
import { createStudyPlan, determineWeaknessLevel } from "./studyPlan.service.js";

export const processQuizData = async (data) => {
  const { subjectId, lectures } = data;

  // 1. Run Analytics
  const { kms, metrics } = analyzePerformance(lectures || []);

  // 2. Generate Study Plan
  const studyPlan = createStudyPlan(kms);
  const weaknessLevel = determineWeaknessLevel(kms);

  // 3. Construct Response
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