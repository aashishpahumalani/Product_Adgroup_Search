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
      console.log('Uploading file:', file);
      
      const data = await uploadCsvFile(file);
      if (data.jobId) setJobId(data.jobId);
      else setError(data.error || 'Upload failed');
    } catch (err) {
      setError('Upload failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Upload CSV File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {jobId && (
        <div style={{ marginTop: 16 }}>
          <b>Upload successful!</b> Job ID: {jobId}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

export default UploadPage;
