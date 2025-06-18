import Queue from "bull";
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const analysisQueue = new Queue("analysis", REDIS_URL);
import Redis from "ioredis";

const redisClient = new Redis(REDIS_URL);

export async function addJob(jobId, filename) {
  await analysisQueue.add({ jobId, filename });
}

export async function setAnalysisData(jobId, response) {
  await redisClient.set(
    `analysis:${jobId}`,
    JSON.stringify(response),
    "EX",
    3600
  );
}

export async function getAnalysisData(jobId) {
  return JSON.parse(await redisClient.get(`analysis:${jobId}`));
}

export async function setoptimize(jobId, response) {
  await redisClient.set(
    `optimize:${jobId}`,
    JSON.stringify(response),
    "EX",
    3600
  );
}

export async function getoptimize(jobId) {
  return JSON.parse(await redisClient.get(`optimize:${jobId}`));
}
