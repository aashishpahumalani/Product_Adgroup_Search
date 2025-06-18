import { addJob } from '../jobs/queue.js';
import {insertJob} from '../models/analysisJob.js';

const uploadService = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Store metadata and create job
    const { originalname, filename, size } = req.file;

    const jobId = await insertJob(filename, originalname, size);

    if (!jobId) {
      return res.status(500).json({ error: 'Failed to create analysis job' });
    }
    
    // Add job to the queue
    await addJob(jobId.id, filename);
    return res.json({ jobId: jobId.id });
  } catch (err) {
    console.log('Error uploading file:', err);
    throw res.status(500).json({ error: err.message });
  }
};

export default uploadService;
