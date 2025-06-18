import pool from '../db';


export async function getJobById(id) {
  const res = await pool.query(
    "SELECT * FROM analysis_jobs WHERE id = $1",
    [id]
  );
return res;
}

export async function insertJob(filename, originalname, size) {
  const res = await pool.query(
    'INSERT INTO analysis_jobs (filename, originalname, size, status) VALUES ($1, $2, $3, $4) RETURNING id',
    [filename, originalname, size, 'processing']
  );
return res.rows[0];
};

export async function updateJob(id) {
  const res = await pool.query("UPDATE analysis_jobs SET status = $1 WHERE id = $2", [
    "completed",
    id,
  ]);
return res.rows[0];
};

export async function setJobError(id, error) {
  const res = await pool.query(
    "UPDATE analysis_jobs SET status = $1, error = $2 WHERE id = $3",
    ["failed", error, id]
  );
}


