// Utility for API calls to backend
export async function fetchAnalysisResults(jobId) {
  const res = await fetch(`http://localhost:3001/api/analysis/${jobId}`);
  if (!res.ok) throw new Error('Failed to fetch results');
  return res.json();
}

export async function uploadCsvFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('http://localhost:3001/api/upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function fetchOptimizationTasks(jobId) {
  const res = await fetch(`http://localhost:3001/api/optimize/${jobId}`);
  if (!res.ok) throw new Error('Failed to fetch optimization tasks');
  return res.json();
}
