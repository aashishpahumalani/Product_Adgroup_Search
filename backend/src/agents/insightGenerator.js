import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { detailedSummarySchema } from "../zodSchemas.js";
import llm from "./initialiseLLM.js";


async function generateInsights(data) {
  const parser = StructuredOutputParser.fromZodSchema(analysisDataSchema);
  const formatInstructions = parser.getFormatInstructions();

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You're a marketing analyst that explains ad performance trends in plain English."],
    ["user", `Here is recent ad campaign data:\n\n${JSON.stringify(data.slice(0, 15))}\n\n
      Write a paragraph highlighting:
      - Trends in CTR, ACOS, ROAS
      - Good or bad performance keywords
      - Any anomalies in the data`]
    ]);
    const chain = RunnableSequence.from([
      prompt,
      llm,
      parser,
    ]);    
    // const response = await chain.invoke({ input: data });
     const response = await chain.invoke({
      adData: JSON.stringify(data),
      formatInstructions: formatInstructions  // truncate if needed
    });
    console.log(`Response: ${JSON.stringify(response)}`);
}

export default generateInsights;
