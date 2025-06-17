import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { optimizationTaskSchema } from "../zodSchemas.js";
import llm from "./initialiseLLM.js";

async function generateOptimizationTasks(data) {
   const parser = StructuredOutputParser.fromZodSchema(analysisDataSchema);
    const formatInstructions = parser.getFormatInstructions();
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You're a PPC campaign strategist."],
    ["user", `Given the following campaign data:\n${JSON.stringify(data.slice(0, 15))}\n\n
      Generate a list of optimization tasks:
      - Which keywords to pause or boost
      - Bid adjustments
      - Suggestions to improve CTR, reduce ACOS, or increase ROAS`]
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
    return response;
}

export default generateOptimizationTasks;
