export const createStudyPlan = (kms) => {
  let planType, strategy;

  if (kms < 0.4) {
    planType = "Remedial";
    strategy = "Revise fundamentals and re-attempt basic quizzes to build core understanding.";
  } else if (kms < 0.7) {
    planType = "Reinforcement";
    strategy = "Focus on mixed practice sets and reviewing weak areas to improve consistency.";
  } else {
    planType = "Exam Polishing";
    strategy = "Attempt mock exams and previous year questions to maximize speed and accuracy.";
  }

  return {
    planType,
    strategy,
    confidence: parseFloat(kms.toFixed(2)), // Using KMS as a confidence proxy
  };
};

export const determineWeaknessLevel = (kms) => {
  // Interpreting "weaknessLevel" as the magnitude of weakness:
  // Low KMS (<0.4) -> Strong Weakness
  // Mid KMS (0.4-0.7) -> Moderate Weakness
  // High KMS (>0.7) -> Stable (Low Weakness)
  if (kms < 0.4) return "Strong";
  if (kms < 0.7) return "Moderate";
  return "Stable";
};