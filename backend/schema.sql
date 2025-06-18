-- SQL schema for analysis jobs, metrics, and optimization tasks
CREATE TABLE IF NOT EXISTS analysis_jobs (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  originalname TEXT NOT NULL,
  size INTEGER NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS optimize_summary (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES analysis_jobs(id),
  summary TEXT,
  trends TEXT,
  anomalies TEXT[],
  good_keywords TEXT[],
  bad_keywords TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS optimize_tasks (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES analysis_jobs(id),
  keyword TEXT,
  recommendation TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')), -- enforce valid priorities
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES analysis_jobs(id),
  average_roas NUMERIC,
  average_acos NUMERIC,
  average_ctr NUMERIC,
  top_keywords TEXT[],
  anomalies TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
