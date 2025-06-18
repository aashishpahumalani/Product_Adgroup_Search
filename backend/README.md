# Ad Analysis & Optimization Backend

## Project Overview
This project is a robust backend system for large-scale advertising data analysis and optimization. It enables users to upload large CSV files (up to 100MB) containing ad performance data, processes the data asynchronously, and provides comprehensive analysis results and actionable optimization recommendations. The system features a RESTful API, asynchronous job processing, a modular data pipeline for parsing and validating CSVs, and a metrics engine for calculating key advertising KPIs (ROAS, ACOS, CTR, etc.). It also includes a foundation for advanced LangChain agent integration, enabling automated insight generation and optimization strategies using LLMs.

## Architecture Diagram
```
+-----------+         +-----------+         +----------------+         +-----------+
|  Frontend | <-----> |  Backend  | <-----> | LangChain Agent| <-----> |  LLM API  |
+-----------+         +-----------+         +----------------+         +-----------+
      |                     |                        |                        |
      |  REST API           |   Async Job Queue      |   LLM Calls            |
      +---------------------+------------------------+------------------------+
```

## Setup Instructions
1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd backend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Start required services with Docker Compose**
   ```sh
   docker-compose up -d postgres redis
   ```
4. **Start the backend server**
   ```sh
   npm run start
   ```
5. **Start the worker**
   ```sh
   npm run worker
   ```

## API Documentation
### 1. Upload CSV
**POST** `/api/upload`
- **Request:** `multipart/form-data` with `file` (CSV, max 100MB)
- **Response:** `{ "jobId": <string> }`
- **Example:**
  ```http
  POST /api/upload
  Content-Type: multipart/form-data
  file: <yourfile.csv>
  ```

### 2. Poll Analysis Results
**GET** `/api/analysis/:id`
- **Response:**
  - `{ "status": "processing" }`
  - `{ "status": "completed", "results": [...] }`
  - `{ "status": "failed", "error": <string> }`
- **Example:**
  ```http
  GET /api/analysis/123
  ```

### 3. Get Optimization Recommendations
**GET** `/api/optimize/:id`
- **Response:** `{ "tasks": [ { keyword, recommendation, priority } ] }`
- **Example:**
  ```http
  GET /api/optimize/123
  ```

## Agent Design (LangChain Integration)
The backend is designed to support a multi-agent LangChain architecture:
- **DataAnalyzer Agent:** Parses and analyzes CSV data, calculates advanced metrics, and detects patterns/anomalies.
- **InsightGenerator Agent:** Integrates with LLMs (OpenAI, Claude, Gemini, etc.) to generate human-readable insights and recommendations.
- **TaskCreator Agent:** Produces prioritized optimization tasks and actionable strategies based on analysis results.

Agents communicate via internal APIs and can be extended using the LangChain.js or OpenAI SDK. The current implementation includes stubs for future LLM integration.

## Future Improvements
1. **Full LangChain/LLM Integration:** Automate insight and recommendation generation using real LLMs.
2. **User Authentication & Authorization:** Secure endpoints and support multi-user workflows.
3. **Advanced Trend Analysis:** Add time-series and anomaly detection for deeper insights.
4. **Frontend Dashboard:** Build a React/Vue dashboard for visualization and management.
5. **Cloud & Docker Support:** Add Dockerfiles and deployment scripts for cloud scalability.
6. **Notification System:** Email or webhook notifications on job completion or failure.
7. **Role-based Access Control:** Fine-grained permissions for different user roles.

---
For questions or contributions, please open an issue or pull request.
