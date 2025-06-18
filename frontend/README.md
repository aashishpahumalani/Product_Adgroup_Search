# Minimal React Frontend for Ad Analysis

## Overview
This is a minimal React frontend for the Ad Analysis & Optimization backend. It provides three screens:
- **Landing Page:** Simple dashboard
- **Upload Screen:** Upload CSV files for analysis
- **Results Screen:** View analysis results by Job ID

## Setup Instructions
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. The app will be available at `http://localhost:5173` (default Vite port).

## API Integration
- The frontend expects the backend API to be running at `http://localhost:3001`.
- Endpoints used:
  - `POST /api/upload` (file upload)
  - `GET /api/analysis/:id` (fetch results)

## Screens
- **Landing Page:** Welcome and navigation
- **Upload Screen:** File upload form, displays Job ID on success
- **Results Screen:** Enter Job ID to poll and display analysis results

## Customization
- Update API URLs in the code if your backend runs on a different host/port.
- UI is intentionally minimal for clarity and maintainability.
