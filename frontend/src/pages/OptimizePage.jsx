import React, { useState } from 'react';
import { fetchOptimizationTasks } from '../api';

const OptimizePage = () => {
  const [jobId, setJobId] = useState('');
  const [insights, setInsights] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!jobId) return setError('Please enter a Job ID.');
    setLoading(true);
    setError('');
    setInsights(null);
    setTasks([]);
    try {
      const data = await fetchOptimizationTasks(jobId);
      if (data.getInsights || data.getOptimize) {
        setInsights(data.getInsights || {});
        setTasks(data.getOptimize?.tasks || []);
      } else {
        setError(data.error || 'No insights or tasks found.');
      }
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
      <h2 style={{ fontSize: '28px', color: '#333', marginBottom: 24 }}>
        🧠 Campaign Optimization Dashboard
      </h2>

      <form onSubmit={handleOptimize} style={{ marginBottom: 24, display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Enter Job ID"
          value={jobId}
          onChange={e => setJobId(e.target.value)}
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={loading || !jobId}
          style={buttonStyle(loading || !jobId)}
        >
          {loading ? 'Fetching...' : 'Get Insights'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          ❌ {error}
        </div>
      )}

      {insights && (
        <div style={{ marginTop: 24 }}>
          <h3 style={sectionTitle}>📊 Summary</h3>
          <p>{insights.summary}</p>

          <h3 style={sectionTitle}>📈 Trends</h3>
          <p>{insights.trends}</p>

          {insights.anomalies?.length > 0 && (
            <>
              <h3 style={sectionTitle}>🚨 Anomalies</h3>
              <ul>
                {insights.anomalies.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </>
          )}

          {insights.goodKeywords?.length > 0 && (
            <>
              <h3 style={sectionTitle}>✅ Good Keywords</h3>
              <p>{insights.goodKeywords.join(', ')}</p>
            </>
          )}

          {insights.badKeywords?.length > 0 && (
            <>
              <h3 style={sectionTitle}>⚠️ Bad Keywords</h3>
              <p>{insights.badKeywords.join(', ')}</p>
            </>
          )}
        </div>
      )}

      {tasks.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: '22px', marginBottom: 12 }}>📋 Suggested Actions</h3>
          <table style={tableStyle}>
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

// === Styles ===

const inputStyle = {
  padding: '10px 12px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  width: 250
};

const buttonStyle = (disabled) => ({
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: disabled ? 'not-allowed' : 'pointer'
});

const sectionTitle = {
  marginTop: 20,
  marginBottom: 8,
  fontSize: '18px',
  color: '#222'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '15px'
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
