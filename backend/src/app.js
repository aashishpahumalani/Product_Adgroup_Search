import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Router from './api/index.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', Router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
