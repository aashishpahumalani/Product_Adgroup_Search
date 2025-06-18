import { getAnalysisCache, setAnalysisCache } from "../jobs/queue.js";
import {getJobById} from "../models/analysisJob.js";
import {getAnalysisData} from "../models/analysisData.js";


const analysisService = async (req, res) => {
  const jobId = req.params.id;
  const cached = await getAnalysisCache(jobId);
  if (cached) return res.json(cached);
  try {
    const jobRes = await getJobById(jobId);

    if (jobRes.rowCount === 0)
      return res.status(404).json({ error: "Job not found" });
    const job = jobRes.rows[0];
    if (job.status === "processing") {
      return res.json({ status: "processing" });
    } else if (job.status === "failed") {
      return res.json({ status: "failed", error: job.error });
    } else if (job.status === "completed") {
      // Fetch analysis results
      const results = await getAnalysisData(jobId);
      if (!results) {
        return res.status(404).json({ error: "Analysis results not found" });
      }
      const response = { status: "completed", results };
      await setAnalysisCache(jobId, response);
      return res.json(response);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default analysisService;
