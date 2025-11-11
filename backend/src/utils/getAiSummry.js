export const generateAiSummary = async (diagnosis, prescription) => {
  try {
    return `Based on diagnosis "${diagnosis}", it is recommended to follow the prescribed treatment: "${prescription}". Maintain regular hydration and monitor recovery.`;
  } catch {
    return "AI suggestion not available at the moment.";
  }
};
