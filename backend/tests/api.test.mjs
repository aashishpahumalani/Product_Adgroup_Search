import request from 'supertest';
import app from '../src/app.js';
import fs from 'fs';
import path from 'path';

describe('API Endpoints', () => {
//   describe('POST /api/upload', () => {
//     it('should upload a CSV file and return a jobId', async () => {
//       const testCsvPath = path.join(process.cwd(), 'tests', 'test.csv');
//       fs.writeFileSync(testCsvPath, 'Matched product,Product targets,Added as,Impressions\nfoo,bar,baz,1');
//       const res = await request(app)
//         .post('/api/upload')
//         .attach('file', testCsvPath);
//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('jobId');
//       fs.unlinkSync(testCsvPath);
//     });
//   });

//   describe('GET /api/analysis/', () => {
//     it('should return analysis status or results', async () => {
//       // Replace '1' with a valid jobId for a real test
//       const res = await request(app).get('/api/analysis/1');
//       expect([200, 404]).toContain(res.statusCode);
//       expect(res.body).toHaveProperty('status');
//     });
//   });

//   describe('GET /api/optimize/', () => {
//     it('should return optimization summary and tasks', async () => {
//       // Replace '1' with a valid jobId for a real test
//       const res = await request(app).get('/api/optimize/1');
//       expect([200, 404]).toContain(res.statusCode);
//       // The response may vary depending on job existence
//     });
//   });

  describe('GET /api/last-job-id', () => {
    it('should return the last jobId or 404 if none exist', async () => {
      const res = await request(app).get('/api/last-job-id');
      expect([200, 404]).toContain(res.statusCode);      
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('lastJobId');
      } else {
        expect(res.body).toHaveProperty('error');
      }
    });
  });
});
