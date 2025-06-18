import pool from "../db.js";
import { getAnalysisData, setAnalysisData } from "../jobs/queue.js";

const analysisService = async (req, res) => {
  const jobId = req.params.id;
  // Check cache first
  const cached = await getAnalysisData(jobId);
  if (cached) return res.json(cached);
  try {
    const jobRes = await pool.query(
      "SELECT * FROM analysis_jobs WHERE id = $1",
      [jobId]
    );
    if (jobRes.rowCount === 0)
      return res.status(404).json({ error: "Job not found" });
    const job = jobRes.rows[0];
    if (job.status === "processing") {
      return res.json({ status: "processing" });
    } else if (job.status === "failed") {
      return res.json({ status: "failed", error: job.error });
    } else if (job.status === "completed") {
      // Fetch analysis results
      const resultRes = await pool.query(
        "SELECT * FROM analysis_results WHERE job_id = $1",
        [jobId]
      );
      const results = resultRes.rows[0];
      const response = { status: "completed", results };
      await setAnalysisData(jobId, response);
      return res.json(response);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default analysisService;
