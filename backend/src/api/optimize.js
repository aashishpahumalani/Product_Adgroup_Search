import express from 'express';
import pool from '../db.js';

const router = express.Router();

const optimizeService = async (req, res) => {
  const jobId = req.params.id;
  try {
    // Check if analysis is completed
    const jobRes = await pool.query('SELECT * FROM analysis_jobs WHERE id = $1', [jobId]);
    if (jobRes.rowCount === 0) return res.status(404).json({ error: 'Job not found' });
    const job = jobRes.rows[0];
    if (job.status !== 'completed') {
      return res.status(400).json({ error: 'Analysis not completed' });
    }
    // Fetch analysis results
    const resultRes = await pool.query('SELECT * FROM analysis_results WHERE job_id = $1', [jobId]);
    const analysis = resultRes.rows[0];
    // Example: Use analysis to generate tasks (stub)
    const tasks = [
      {
        insight: analysis ? `Top keywords: ${analysis.top_keywords?.join(', ')}` : '',
        task: 'Review and optimize bids for top keywords',
      },
      {
        insight: analysis ? `Anomalies: ${analysis.anomalies?.join('; ')}` : '',
        task: 'Investigate anomalies and adjust campaigns',
      }
    ];
    // Store tasks
    for (const t of tasks) {
      await pool.query(
        'INSERT INTO optimize_tasks (job_id, insight, task) VALUES ($1, $2, $3)',
        [jobId, t.insight, t.task]
      );
    }
    res.json({ insights: analysis, tasks: tasks.map(t => t.task) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export default optimizeService;
