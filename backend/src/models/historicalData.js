import pool from '../db';

async function getHistoricalMetrics(keyword) {
  // Fetch the latest 30 analysis_results rows where the keyword is in top_keywords
  const res = await pool.query(
    `SELECT * FROM analysis_results WHERE $1 = ANY(top_keywords) ORDER BY id DESC LIMIT 30`,
    [keyword]
  );
  return res.rows;
}

export default { getHistoricalMetrics };
