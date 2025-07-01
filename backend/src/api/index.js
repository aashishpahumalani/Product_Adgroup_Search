import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import analysisService from './analysis.js';
import uploadService from './upload.js';
import optimizeService from './optimize.js';
import lastJobIdService from './lastJobId.js';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
  fs.mkdirSync(path.join(__dirname, '../uploads'), { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
      // Ensure .csv extension
      let ext = path.extname(file.originalname).toLowerCase();
      console.log(`Original file extension: ${ext}`);
      
      let base = path.basename(file.originalname, ext);
      console.log(`Base filename: ${base}`);
      
      if (ext !== '.csv') ext = '.csv';
      cb(null, `${base}-${Date.now()}${ext}`);
    }
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
});

router.post('/upload', upload.single('file'), uploadService);
router.get('/analysis/:id', analysisService);
router.get('/optimize/:id', optimizeService);
router.get('/last-job-id', lastJobIdService);

export default router;



