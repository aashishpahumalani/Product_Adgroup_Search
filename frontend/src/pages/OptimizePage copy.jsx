import React, { useState } from 'react';
import { fetchOptimizationTasks } from '../api';

const OptimizePage = () => {
  const [jobId, setJobId] = useState('');
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!jobId) return setError('Please enter a Job ID.');
    setLoading(true);
    setError('');
    try {
      const data = await fetchOptimizationTasks(jobId);
      if (data.tasks) setTasks(data.tasks);
      else setError(data.error || 'No tasks found');
    } catch (err) {
      setError('Failed to fetch optimization tasks');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Optimization Tasks</h2>
      <form onSubmit={handleOptimize} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Enter Job ID"
          value={jobId}
          onChange={e => setJobId(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button type="submit" disabled={loading || !jobId}>
          {loading ? 'Fetching...' : 'Get Optimization Tasks'}
        </button>
      </form>
      {tasks && (
        <div style={{ marginTop: 16 }}>
          <h3>Tasks</h3>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Recommendation</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => (
                <tr key={i}>
                  <td>{task.keyword}</td>
                  <td>{task.recommendation}</td>
                  <td>{task.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

export default OptimizePage;
