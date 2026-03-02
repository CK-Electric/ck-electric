'use client';

import { useState } from 'react';

export default function EmailTestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phone: '(555) 123-4567',
          project: 'Test project description',
          address: '123 Test St'
        }),
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testEstimateAPI = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phone: '(555) 123-4567',
          project: 'Test project description with enough characters to pass validation',
          address: '123 Test St, Tacoma, WA'
        }),
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Email API Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testAPI} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'Testing...' : 'Test Basic API'}
        </button>
        
        <button 
          onClick={testEstimateAPI} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'Testing...' : 'Test Estimate API'}
        </button>
      </div>
      
      {result && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          whiteSpace: 'pre-wrap',
          fontSize: '12px'
        }}>
          <h3>Result:</h3>
          {result}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <h3>Troubleshooting Steps:</h3>
        <ol>
          <li>Check if RESEND_API_KEY is set in .env.local</li>
          <li>Verify your domain in Resend dashboard</li>
          <li>Check browser console for errors</li>
          <li>Check terminal logs for server-side errors</li>
        </ol>
      </div>
    </div>
  );
}
