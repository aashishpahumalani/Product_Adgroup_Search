import { z } from 'zod';

export const analysisDataSchema = z.object({
      average_roas: z.number(),
      average_acos: z.number(),
      average_ctr: z.number(),
      top_keywords: z.array(z.string()),
      anomalies: z.array(z.string())
    });

export const detailedSummarySchema = z.object({
    summary: z.string().min(20, 'Summary must contain useful information'),
    trends: z.string().min(10, 'Trends description should be meaningful'),
    goodKeywords: z.array(z.string()).default([]),
    badKeywords: z.array(z.string()).default([]),
    anomalies: z.array(z.string()).default([]),
});

export const optimizationTaskSchema = z.object({
  keyword: z.string(),
  recommendation: z.string(),
  priority: z.union([
    z.literal('high'),
    z.literal('medium'),
    z.literal('low'),
    z.string(), // fallback in case LLM gives free text
  ]).optional(),
});

export const optimizationTasksResponseSchema = z.object({
  tasks: z.array(optimizationTaskSchema),
});