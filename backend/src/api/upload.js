import express from 'express';
import multer from 'multer';
import path from 'path';
import pool from '../db.js';
import { addJob } from '../jobs/queue.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const uploadService = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // Store metadata and create job
    const { originalname, filename, size } = req.file;
    const result = await pool.query(
      'INSERT INTO analysis_jobs (filename, originalname, size, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [filename, originalname, size, 'processing']
    );
    const jobId = result.rows[0].id;
    await addJob(jobId, filename);
    return res.json({ jobId });
  } catch (err) {
    console.log('Error uploading file:', err);
    throw res.status(500).json({ error: err.message });
  }
};

export default uploadService;
