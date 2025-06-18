import pool from '../db';

export async function insertAnalyzeData(id, analysisResult) {
    await pool.query(
      "INSERT INTO analysis_results (job_id, average_roas, average_acos, average_ctr, top_keywords, anomalies) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        id,
        analysisResult.average_roas,
        analysisResult.average_acos,
        analysisResult.average_ctr,
        analysisResult.top_keywords,
        analysisResult.anomalies,
      ]
    );
}

export async function getAnalysisData(id) {
    const res = await pool.query(
    "SELECT * FROM analysis_results WHERE job_id = $1",
    [id]
  );
  return res.rows[0];
}
