import React from 'react';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={{
      display: 'flex', height: '100vh', alignItems: 'center',
      justifyContent: 'center', backgroundColor: '#0f172a', padding: '24px'
    }}>
      <div style={{
        padding: '32px', textAlign: 'center', maxWidth: '500px',
        borderRadius: '12px', backgroundColor: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ color: '#ef4444', fontWeight: 800, marginBottom: '16px', fontFamily: 'sans-serif' }}>
          सिस्टीममध्ये बिघाड झाला आहे! 🚨
        </h2>
        <pre style={{
          marginBottom: '24px', fontFamily: 'monospace', color: '#94a3b8',
          backgroundColor: '#0f172a', padding: '16px', borderRadius: '4px',
          textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-wrap', fontSize: '12px'
        }}>
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          style={{
            fontWeight: 700, padding: '10px 24px', borderRadius: '8px',
            backgroundColor: '#7c3aed', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: '14px', fontFamily: 'sans-serif'
          }}
        >
          ॲप पुन्हा लोड करा (Try Again)
        </button>
      </div>
    </div>
  );
}