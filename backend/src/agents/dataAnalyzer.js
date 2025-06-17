import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { analysisDataSchema } from "../zodSchemas.js";
import llm from "./initialiseLLM.js";

const llm = new ChatGoogleGenerativeAI({  
  model: "models/gemini-1.5-flash", // or "models/gemini-1.5-flash"
  temperature: 0.3,
  apiKey: "AIzaSyB3w_Dd3V9SyH5OARK1MAP7YFSK5VyUT6M", // Set in your .env or env var
});

async function analyzeData(data, schema, requiredPrompt) {
  try {
    
    const parser = StructuredOutputParser.fromZodSchema(schema);
    const formatInstructions = parser.getFormatInstructions();

    const prompt = ChatPromptTemplate.fromMessages(requiredPrompt);

    const chain = RunnableSequence.from([
      prompt,
      llm,
      parser,
    ]);    

     const response = await chain.invoke({
      adData: JSON.stringify(data),
      formatInstructions: formatInstructions  // truncate if needed
    });
    console.log(`Response: ${JSON.stringify(response)}`);
    
    return response;
  } catch (error) {
    console.log('Error analyzing data:', error);
    throw new Error(`Data analysis failed: ${error.message}`);
  }
}

export default analyzeData;
