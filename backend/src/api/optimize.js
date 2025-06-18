import express from "express";
import pool from "../db.js";
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
import { getoptimize, setoptimize } from "../jobs/queue.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const optimizeService = async (req, res) => {
  const jobId = req.params.id;
  try {
    const cachedData = await getOptimize(jobId);
    if (cachedData) {
      console.log(`✅ Returned cached result for job ${jobId}`);
      return res.json(JSON.parse(cachedData));
    }

    const optimizeSummary = await pool.query(
      `SELECT * FROM optimize_summary WHERE job_id = $1`,
      [jobId]
    );

    const optimizeTasks = await pool.query(
      `SELECT * FROM optimize_tasks WHERE job_id = $1`,
      [jobId]
    );

    if (optimizeSummary && optimizeTasks) {
      const finalResponse = { getInsights, getOptimize };
      await setoptimize(jobId, finalResponse);
      return res.json(finalResponse);
    }

    // Check if analysis is completed
    const jobRes = await pool.query(
      "SELECT * FROM analysis_jobs WHERE id = $1",
      [jobId]
    );
    if (jobRes.rowCount === 0)
      return res.status(404).json({ error: "Job not found" });
    const job = jobRes.rows[0];
    if (job.status !== "completed") {
      return res.status(400).json({ error: "Analysis not completed" });
    }
    const { filename } = job;
    console.log(`Processing job ${jobId} for file ${filename}`);
    const filePath = path.join(__dirname, "../uploads", filename);

    const rows = await parseCSV(filePath);
    console.log(`Parsed ${rows.length} rows from CSV file`);

    const getInsights = await getResponseFromAI(
      rows,
      detailedSummarySchema,
      insightGeneratorPrompts
    );

    console.log("getInsights ::>> ", getInsights);

    await pool.query(
      "INSERT INTO optimize_summary (job_id, summary, trends, anomalies, good_keywords, bad_keywords) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        jobId,
        getInsights.summary,
        getInsights.trends,
        getInsights.anomalies,
        getInsights.goodKeywords,
        getInsights.badKeywords,
      ]
    );

    const getOptimize = await getResponseFromAI(
      rows,
      optimizationTasksResponseSchema,
      taskCreatorPrompts
    );
    console.log("getOptimize ::>> ", getOptimize);

    const insertPriotizeTask = [];
    for (const task of getOptimize.tasks) {
      insertPriotizeTask.push(
        pool.query(
          "INSERT INTO optimize_tasks (job_id, keyword, recommendation, priority) VALUES ($1, $2, $3, $4)",
          [
            jobId,
            getInsights.keyword,
            getInsights.recommendation,
            getInsights.priority,
          ]
        )
      );
    }
    await Promise.allSettled(insertPriotizeTask);

    const finalResponse = { getInsights, getOptimize };
    await setoptimize(jobId, finalResponse);

    return res.json(finalResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default optimizeService;
