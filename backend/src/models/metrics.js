import pool from '../db';

async function getMetricsByJobId(jobId) {
  // Fetch analysis_results for the given jobId
  const res = await pool.query('SELECT * FROM analysis_results WHERE job_id = $1', [jobId]);
  return res.rows;
}

export default { getMetricsByJobId };
