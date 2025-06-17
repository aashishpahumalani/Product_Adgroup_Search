import { DataTypes } from 'sequelize';
import pool from '../db';

const OptimizeTask = {
  async getTasksByJobId(jobId) {
    const res = await pool.query('SELECT * FROM optimize_tasks WHERE job_id = $1', [jobId]);
    return res.rows;
  },
};

export default OptimizeTask;
