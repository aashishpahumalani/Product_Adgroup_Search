import { DataTypes } from 'sequelize';
import pool from '../db';

const AnalysisJob = {
  async getJobById(id) {
    const res = await pool.query('SELECT * FROM analysis_jobs WHERE id = $1', [id]);
    return res.rows[0];
  },
};

export default AnalysisJob;
