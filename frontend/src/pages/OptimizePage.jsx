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
      else setError(data.error || 'No optimization tasks found.');
    } catch (err) {
      setError('Failed to fetch optimization tasks.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      padding: '64px 32px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '80vh',
      backgroundColor: '#fdfdfd'
    }}>
      <h2 style={{
        fontSize: '28px',
        color: '#333',
        marginBottom: 24
      }}>
        🛠 Optimization Recommendations
      </h2>

      <form onSubmit={handleOptimize} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Enter Job ID"
          value={jobId}
          onChange={e => setJobId(e.target.value)}
          style={{
            padding: '10px 12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            width: 250
          }}
        />
        <button
          type="submit"
          disabled={loading || !jobId}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading || !jobId ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Fetching...' : 'Get Recommendations'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          ❌ {error}
        </div>
      )}

      {tasks && (
        <div style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: '22px', marginBottom: 12 }}>📋 Suggested Actions</h3>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '15px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th style={thStyle}>Keyword</th>
                <th style={thStyle}>Recommendation</th>
                <th style={thStyle}>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                  <td style={tdStyle}>{task.keyword}</td>
                  <td style={tdStyle}>{task.recommendation}</td>
                  <td style={tdStyle}>{task.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd'
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee'
};

export default OptimizePage;
