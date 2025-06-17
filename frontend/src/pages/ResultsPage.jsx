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

  const chipStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    margin: '4px',
    backgroundColor: '#f0f0f0',
    borderRadius: '20px',
    fontSize: '14px'
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'Arial, sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>📊 Ad Performance Analysis</h2>

      <form onSubmit={handleCheck} style={{ display: 'flex', gap: '10px', marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Enter Job ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          style={{ flex: 1, padding: 10, fontSize: 16, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button
          type="submit"
          disabled={loading || !jobId}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            borderRadius: 6,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Checking...' : 'Check Results'}
        </button>
      </form>

      {status && <div>Status: <b>{status}</b></div>}

      {results && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <div style={cardStyle}><h4>Average ROAS</h4><p>{results.average_roas}</p></div>
            <div style={cardStyle}><h4>Average ACOS</h4><p>{results.average_acos}</p></div>
            <div style={cardStyle}><h4>Average CTR</h4><p>{results.average_ctr}</p></div>
          </div>

          <div style={{ marginTop: 32 }}>
            <h3>🔥 Top Keywords</h3>
            {results.top_keywords?.length ? (
              results.top_keywords.map((kw, i) => (
                <span key={i} style={chipStyle}>{kw}</span>
              ))
            ) : <p style={{ color: '#888' }}>No top keywords found</p>}
          </div>

          <div style={{ marginTop: 32 }}>
            <h3>🚨 Anomalies (High Spend, No Sales)</h3>
            {results.anomalies?.length ? (
              results.anomalies.map((kw, i) => (
                <span key={i} style={{ ...chipStyle, backgroundColor: '#ffe6e6' }}>{kw}</span>
              ))
            ) : <p style={{ color: '#888' }}>No anomalies found</p>}
          </div>

          <div style={{ marginTop: 24, fontSize: 12, color: '#555' }}>
            Report generated: {new Date(results.created_at).toLocaleString()}
          </div>
        </div>
      )}

      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

const cardStyle = {
  flex: 1,
  padding: 16,
  backgroundColor: '#f9f9f9',
  borderRadius: 8,
  textAlign: 'center',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

export default ResultsPage;
