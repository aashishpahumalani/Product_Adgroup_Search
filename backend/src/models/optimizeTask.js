import pool from '../db.js';

export async function getOptimizeSummary(jobId) {
  const optimizeSummary = await pool.query(
      `SELECT * FROM optimize_summary WHERE job_id = $1`,
      [jobId]
    );
  return  optimizeSummary.rows.length ? optimizeSummary.rows : null;
  
}

export async function getOptimizeTasks(jobId) {
  const optimizeTasks = await pool.query(
      `SELECT * FROM optimize_tasks WHERE job_id = $1`,
      [jobId]
    );
  return  optimizeTasks.rows.length ? optimizeTasks.rows : null;
}

export async function insertOptimizeSummary(jobId, getInsightsAI) {
  await pool.query(
      "INSERT INTO optimize_summary (job_id, summary, trends, anomalies, good_keywords, bad_keywords) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        jobId,
        getInsightsAI.summary,
        getInsightsAI.trends,
        getInsightsAI.anomalies,
        getInsightsAI.goodKeywords,
        getInsightsAI.badKeywords,
      ]
    );
}

export function insertOptimizeTasks(jobId, getInsightsAI) {
  return pool.query(
    "INSERT INTO optimize_tasks (job_id, keyword, recommendation, priority) VALUES ($1, $2, $3, $4)",
    [
      jobId,
      getInsightsAI.keyword,
      getInsightsAI.recommendation,
      getInsightsAI.priority,
    ]
  )
}
