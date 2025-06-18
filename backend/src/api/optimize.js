import { fileURLToPath } from "url";
import {
  detailedSummarySchema,
  optimizationTasksResponseSchema,
} from "../agents/zodSchemas.js";
import getResponseFromAI from "../agents/getResponseFromAI.js";
import {
  insightGeneratorPrompts,
  taskCreatorPrompts,
} from "../agents/prompts.js";
import path from "path";
import parseCSV from "../services/csvParser.js";
import { getOptimizeCached, setoptimizeCache } from "../jobs/queue.js";
import { getJobById } from "../models/analysisJob.js";
import { getOptimizeSummary, getOptimizeTasks, insertOptimizeTasks, insertOptimizeSummary } from "../models/optimizeTask.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const optimizeService = async (req, res) => {
  const jobId = req.params.id;
  try {
    const cachedData = await getOptimizeCached(jobId);
    if (cachedData) return res.json(cachedData);
    

    // fetch the data from the database
    const optimizeSummary = await getOptimizeSummary(jobId);
    const optimizeTasks = await getOptimizeTasks(jobId);
    

    if (optimizeSummary && optimizeTasks) {
      const finalResponse = { optimizeSummary, optimizeTasks };
      await setoptimizeCache(jobId, finalResponse);
      return res.json(finalResponse);
    }

    // fetch the job details
    const jobRes = await getJobById(jobId);

    if (jobRes.rowCount === 0) return res.status(404).json({ error: "Job not found" });

    const job = jobRes.rows[0];
    if (job.status !== "completed") {
      return res.status(400).json({ error: "Analysis not completed" });
    }

    const { filename } = job;
    const filePath = path.join(__dirname, "../uploads", filename);

    const rows = await parseCSV(filePath);
    console.log(`Parsed ${rows.length} rows from CSV file`);

    const getInsightsAI = await getResponseFromAI(
      rows,
      detailedSummarySchema,
      insightGeneratorPrompts
    );

    await insertOptimizeSummary(jobId, getInsightsAI);    

    const getOptimizeAI = await getResponseFromAI(
      rows,
      optimizationTasksResponseSchema,
      taskCreatorPrompts
    );

    const insertPriotizeTask = [];
    for (const task of getOptimizeAI.tasks) {
      insertPriotizeTask.push(insertOptimizeTasks(jobId, getOptimizeAI));
    }
    await Promise.allSettled(insertPriotizeTask);

    const finalResponse = { getInsightsAI, getOptimizeAI };
    await setoptimizeCache(jobId, finalResponse);

    return res.json(finalResponse);
  } catch (err) {
    console.log("Error in optimizeService:", err);
    res.status(500).json({ error: err.message });
  }
};

export default optimizeService;
