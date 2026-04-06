/**
 * scoringService.js
 * Handles quiz validation, score calculation, and interest analysis.
 */

const calculateParameterScores = (answers, totalQuestionsPerParam = 6) => {
  const scores = {};
  
  // Initialize scores for all 12 parameters
  const parameters = [
    "Coding / Programming", "Robotics & AI", "Design (UI/UX / Graphics)",
    "Arts & Creativity (Drawing, Painting)", "Music (Singing / Instruments)",
    "Dance & Performing Arts", "Sports & Physical Activities",
    "Business & Entrepreneurship", "Science & Research",
    "Communication & Public Speaking", "Social Work & Leadership (Politics / NGO)",
    "Media & Film Making"
  ];
  
  parameters.forEach(p => scores[p] = 0);

  // Loop through answers and increment correct counts
  answers.forEach(ans => {
    if (ans.isCorrect) {
      scores[ans.parameter] = (scores[ans.parameter] || 0) + 1;
    }
  });

  // Convert to percentage
  const percentageScores = {};
  for (const param in scores) {
    percentageScores[param] = Math.round((scores[param] / totalQuestionsPerParam) * 100);
  }

  return percentageScores;
};

const analyzeInterests = (parameterScores) => {
  // Sort parameters by score descending
  const sortedParams = Object.entries(parameterScores)
    .sort(([, a], [, b]) => b - a)
    .map(([param, score]) => ({
      parameter: param,
      score,
      interestLevel: score > 70 ? "Strong Interest" : (score >= 50 ? "Moderate Interest" : "Low Interest")
    }));

  // Extract top 3 names
  const topParameters = sortedParams.slice(0, 3).map(p => p.parameter);

  return { sortedParams, topParameters };
};

module.exports = {
  calculateParameterScores,
  analyzeInterests
};
