export const analysisDataPrompt = [
  ["system", "You are a data analyst for ad performance metrics."],
  [
    "human",
    `Analyze this ad data:\n{adData}\n\n
        Calculate:
        - average ROAS
        - average ACOS  
        - average CTR
        Identify:
        - top-performing keywords (high ROAS/CTR)
        - anomalies (e.g., high spend but no sales)
        {formatInstructions}`,
  ],
];

export const insightGeneratorPrompts = [
  [
    "system",
    "You're a marketing analyst that explains ad performance trends in plain English.",
  ],
  [
    "user",
    `Here is recent ad campaign data:\n\n{adData}\n\n
      Write a paragraph highlighting:
      - Trends in CTR, ACOS, ROAS
      - Good or bad performance keywords
      - Any anomalies in the data
      {formatInstructions}`,
  ],
];

export const taskCreatorPrompts = [
  ["system", "You're a PPC campaign strategist."],
  [
    "user",
    `Given the following campaign data:\n\n{adData}\n\n
      Generate a list of optimization tasks:
      - Which keywords to pause or boost
      - Bid adjustments
      - Suggestions to improve CTR, reduce ACOS, or increase ROAS
      {formatInstructions}`,
  ],
];
