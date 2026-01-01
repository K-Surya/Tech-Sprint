import { analyzePerformance } from "../services/analytics.service.js";

export const getLearningCurveData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { subjects } = req.body;

    if (!userId || !subjects || !Array.isArray(subjects)) {
      return res.status(400).json({
        error: "userId and subjects array are required"
      });
    }

    const learningCurveData = [];

    // Calculate KMS for each subject
    for (const subject of subjects) {
      const { subjectId, subjectName, lectures } = subject;

      if (!lectures || lectures.length === 0) {
        // No lectures, KMS is 0
        learningCurveData.push({
          subjectId,
          subjectName,
          kms: 0,
          percentage: 0,
          metrics: {
            avgScore: 0,
            trend: 0,
            consistency: 0,
            coverage: 0
          }
        });
        continue;
      }

      // Calculate KMS using analytics service
      const { kms, metrics } = analyzePerformance(lectures);

      learningCurveData.push({
        subjectId,
        subjectName,
        kms: parseFloat(kms.toFixed(2)),
        percentage: parseFloat((kms * 100).toFixed(1)),
        metrics: {
          avgScore: parseFloat(metrics.avgScore.toFixed(2)),
          trend: parseFloat(metrics.trend.toFixed(2)),
          consistency: parseFloat(metrics.consistency.toFixed(2)),
          coverage: parseFloat(metrics.coverage.toFixed(2))
        }
      });
    }

    res.json({ data: learningCurveData });
  } catch (error) {
    console.error("Learning curve analytics error:", error);
    res.status(500).json({
      error: "Failed to generate learning curve data",
      details: error.message
    });
  }
};
