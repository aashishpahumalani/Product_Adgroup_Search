import React from 'react';

const LandingPage = () => (
  <div style={{
    padding: '64px 32px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    minHeight: '80vh',
  }}>
    <h1 style={{
      fontSize: '36px',
      marginBottom: 16,
      color: '#333'
    }}>
      📈 Ad Analysis Dashboard
    </h1>
    <p style={{
      fontSize: '18px',
      maxWidth: '600px',
      color: '#555',
      lineHeight: '1.6'
    }}>
      Welcome to your campaign insight hub! <br />
      Upload your ad performance data as a CSV file, and get meaningful metrics, anomalies, and keyword recommendations instantly.
    </p>

    <div style={{
      marginTop: 40,
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      <a
        href="/upload"
        style={buttonStyle}
      >
        🚀 Upload CSV
      </a>
      <a
        href="/results"
        style={{ ...buttonStyle, backgroundColor: '#007bff' }}
      >
        📊 Check Results
      </a>
    </div>
  </div>
);

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  color: 'white',
  backgroundColor: '#28a745',
  border: 'none',
  borderRadius: '6px',
  textDecoration: 'none',
  cursor: 'pointer'
};

export default LandingPage;
