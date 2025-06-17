import Queue from 'bull';
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const analysisQueue = new Queue('analysis', REDIS_URL);

export async function addJob(jobId, filename) {
  await analysisQueue.add({ jobId, filename });
}
