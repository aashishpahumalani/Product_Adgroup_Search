import { analysisQueue } from "./queue.js";
import path from "path";
import parseCSV from "../services/csvParser.js";
import getResponseFromAI from "../agents/getResponseFromAI.js";
import { fileURLToPath } from "url";
import { analysisDataSchema } from "../agents/zodSchemas.js";
import { analysisDataPrompt } from "../agents/prompts.js";
import { setJobError, updateJob } from "../models/analysisJob.js";
import { insertAnalyzeData } from "../models/analysisData.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

analysisQueue.process(async (job) => {
  const { jobId, filename } = job.data;
  try {
    console.log(`Processing job ${jobId} for file ${filename}`);
    const filePath = path.join(__dirname, "../uploads", filename);

    console.log(`Parsing CSV file at ${filePath}`);
    const rows = await parseCSV(filePath);

    console.log(`Parsed ${rows.length} rows from CSV file`);

    // analyzing data using AI
    const analysisResult = await getResponseFromAI(
      rows,
      analysisDataSchema,
      analysisDataPrompt
    );

    // Store analysis results in DB
    await insertAnalyzeData(jobId, analysisResult);    

    // Update job status to completed
    await updateJob(jobId);
  } catch (err) {
    console.log(`Error processing job ${jobId}:`, err);
    await setJobError(jobId, err.message);
    throw err;
  }
});
