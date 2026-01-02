export const createStudyPlan = (kms) => {
  let planType, strategy;

  if (kms < 0.4) {
    planType = "Remedial Type";
    strategy = "Revise fundamentals and re-attempt basic quizzes to build core understanding.";
  } else if (kms < 0.7) {
    planType = "Reinforcement Type";
    strategy = "Focus on mixed practice sets and reviewing weak areas to improve consistency.";
  } else {
    planType = "Exam Polishing / Revision Type";
    strategy = "Attempt mock exams and previous year questions to maximize speed and accuracy.";
  }

  return {
    planType,
    strategy,
    confidence: parseFloat(kms.toFixed(2)),
  };
};

export const determineWeaknessLevel = (kms) => {
  if (kms < 0.4) return "Strong";
  if (kms < 0.7) return "Moderate";
  return "Stable";
};