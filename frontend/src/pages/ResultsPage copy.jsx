import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAnalysisResults } from '../api';

const ResultsPage = () => {
  const { jobId: paramJobId } = useParams();
  const [jobId, setJobId] = useState(paramJobId || '');
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchResults = async (id) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAnalysisResults(id);
      setStatus(data.status);
      if (data.status === 'completed') setResults(data.results);
      else setResults(null);
      if (data.error) setError(data.error);
    } catch (err) {
      setError('Failed to fetch results');
    }
    setLoading(false);
  };

  const handleCheck = (e) => {
    e.preventDefault();
    if (jobId) fetchResults(jobId);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Analysis Results</h2>
      <form onSubmit={handleCheck} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Enter Job ID"
          value={jobId}
          onChange={e => setJobId(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button type="submit" disabled={loading || !jobId}>
          {loading ? 'Checking...' : 'Check Results'}
        </button>
      </form>
      {status && <div>Status: <b>{status}</b></div>}
      {results && (
        <div style={{ marginTop: 16 }}>
          <h3>Metrics</h3>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Spend</th>
                <th>Sales</th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>ROAS</th>
                <th>ACOS</th>
                <th>CTR</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i}>
                  <td>{row.keyword}</td>
                  <td>{row.spend}</td>
                  <td>{row.sales}</td>
                  <td>{row.clicks}</td>
                  <td>{row.impressions}</td>
                  <td>{row.roas}</td>
                  <td>{row.acos}</td>
                  <td>{row.ctr}</td>
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

export default ResultsPage;
