import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const llm = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash", // or "models/gemini-1.5-flash"
  temperature: 0.3,
  apiKey: process.env.GOOGLE_API_KEY, // Set in your .env or env var
});

async function getResponseFromAI(data, schema, requiredPrompt) {
  try {
    const parser = StructuredOutputParser.fromZodSchema(schema);
    const formatInstructions = parser.getFormatInstructions();

    const prompt = ChatPromptTemplate.fromMessages(requiredPrompt);

    const chain = RunnableSequence.from([prompt, llm, parser]);

    const response = await chain.invoke({
      adData: JSON.stringify(data),
      formatInstructions: formatInstructions,
    });

    return response;
  } catch (error) {
    console.log("Error analyzing data:", error);
    throw new Error(`Data analysis failed: ${error.message}`);
  }
}

export default getResponseFromAI;
