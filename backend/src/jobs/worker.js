// Bull worker for async analysis job processing
import { analysisQueue } from './queue.js';
import pool from '../db.js';
import path from 'path';
import parseCSV from '../services/csvParser.js';
import analyzeData from '../agents/dataAnalyzer.js';
import { fileURLToPath } from 'url';
import { analysisDataSchema } from "../agents/zodSchemas.js";
import { analysisDataPrompt } from "../agents/prompts.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

analysisQueue.process(async (job) => {
  const { jobId, filename } = job.data;
  try {
    console.log(`Processing job ${jobId} for file ${filename}`);
    const filePath = path.join(__dirname, '../uploads', filename);
    console.log(`Parsing CSV file at ${filePath}`);
    const rows = await parseCSV(filePath);
    console.log(`Parsed ${rows.length} rows from CSV file`);
    const analysisResult = await analyzeData(rows, analysisDataSchema, analysisDataPrompt);
    console.log(`Analysis result for job ${jobId}:`, analysisResult);
    // Store analysis results in DB
    await pool.query(
      'INSERT INTO analysis_results (job_id, average_roas, average_acos, average_ctr, top_keywords, anomalies) VALUES ($1, $2, $3, $4, $5, $6)',
      [jobId, analysisResult.average_roas, analysisResult.average_acos, analysisResult.average_ctr, analysisResult.top_keywords, analysisResult.anomalies]
    );
    await pool.query('UPDATE analysis_jobs SET status = $1 WHERE id = $2', ['completed', jobId]);
  } catch (err) {
    await pool.query('UPDATE analysis_jobs SET status = $1, error = $2 WHERE id = $3', ['failed', err.message, jobId]);
    throw err;
  }
});
