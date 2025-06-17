import express from 'express';
import pool from '../db.js';


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
    console.log(`Processing job ${jobId} for file ${filename}`);
    const filePath = path.join(__dirname, '../uploads', filename);


    const rows = await parseCSV(filePath);
    console.log(`Parsed ${rows.length} rows from CSV file`);
    
    // Fetch metrics data
    const metricsRes = await pool.query('SELECT * FROM matrics_data WHERE job_id = $1', [jobId]);
    console.log(`Metrics for job ${jobId}:`, metricsRes);
    
    const metrics = metricsRes.rows;

    // Example: Use metrics to generate tasks (stub)
    const tasks = [
      {
      insight: metrics.length > 0 ? `Top metrics: ${metrics.map(m => m.metric_name).join(', ')}` : '',
      task: 'Review and optimize based on top metrics',
      }
    ];
    // Store tasks
    for (const t of tasks) {
      await pool.query(
      'INSERT INTO optimize_tasks (job_id, insight, task) VALUES ($1, $2, $3)',
      [jobId, t.insight, t.task]
      );
    }
    res.json({ metrics, tasks: tasks.map(t => t.task) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export default optimizeService;
