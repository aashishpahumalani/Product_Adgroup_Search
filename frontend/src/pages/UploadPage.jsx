import React, { useState } from 'react';
import { uploadCsvFile } from '../api';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a CSV file.');
    setLoading(true);
    try {
      const data = await uploadCsvFile(file);
      if (data.jobId) {
        setJobId(data.jobId);
        setError('');
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>📤 Upload CSV for Analysis</h2>

      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            padding: '10px',
            fontSize: 16,
            borderRadius: 6,
            border: '1px solid #ccc'
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            borderRadius: 6,
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </form>

      {jobId && (
        <div
          style={{
            marginTop: 24,
            padding: '12px 16px',
            backgroundColor: '#e6f9ea',
            borderRadius: 6,
            color: '#155724',
            border: '1px solid #c3e6cb'
          }}
        >
          ✅ Upload successful! <br />
          <b>Job ID:</b> {jobId}
        </div>
      )}

      {error && (
        <div style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: 12, borderRadius: 6, marginTop: 16 }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default UploadPage;
