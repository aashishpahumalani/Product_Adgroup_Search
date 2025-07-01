import { getLastJobId } from '../models/analysisJob.js';

const lastJobIdService = async (req, res) => {
  try {
    const lastJobId = await getLastJobId();
    if (lastJobId === null) {
      return res.status(404).json({ error: 'No jobs found' });
    }
    return res.json({ lastJobId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default lastJobIdService;
