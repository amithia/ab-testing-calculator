// components/TestResultsCalculator.tsx

import React, { useState } from 'react';
import { TestInputs, TestResults } from '../types';
import { calculateTest } from '../services/api';
import './TestResultsCalculator.css';
import { ResultsDisplay } from './ResultsDisplay';


export const TestResultsCalculator: React.FC = () => {
  // State for inputs
  const [inputs, setInputs] = useState<TestInputs>({
    controlConversions: 50,
    controlVisitors: 1000,
    variantConversions: 60,
    variantVisitors: 1000,
  });

  // State for results
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Write a function to handle input changes
  const handleInputChange = (field: keyof TestInputs, value: string) => {
    // Convert string to number and update state
    setInputs({
      ...inputs,
      [field]: Number(value)
    });
  };

  // TODO: Write a function to handle calculate button click
  const handleCalculate = async () => {
    // 1. Set loading to true
    // 2. Clear any previous error
    // 3. Call calculateTest API
    // 4. Set results
    // 5. Handle errors
    // 6. Set loading to false
    setLoading(true);
    setError(null);
    try {
      const data = await calculateTest(inputs);
      setResults(data);
    } catch (err) {
      setError('Failed to calculate test results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Calculate conversion rates for display
  const controlRate = inputs.controlVisitors > 0 
    ? (inputs.controlConversions / inputs.controlVisitors * 100).toFixed(1)
    : '0.0';
  
  const variantRate = inputs.variantVisitors > 0
    ? (inputs.variantConversions / inputs.variantVisitors * 100).toFixed(1)
    : '0.0';  

  return (
    <div className="calculator">
      <div className="input-section">
        <div className="version-inputs">
          <div className="version-card">
            <h3>Version A (Control)</h3>
            {/* TODO: Add input fields for controlVisitors and controlConversions */}
            <div className="input-group">
              <label>Visitors:</label>
              <input
                type="number"
                value={inputs.controlVisitors}
                onChange={(e) => handleInputChange('controlVisitors', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Conversions:</label>
              <input
                type="number"
                value={inputs.controlConversions}
                onChange={(e) => handleInputChange('controlConversions', e.target.value)}
              />
            </div>
            <p>Conversion Rate: {controlRate}%</p>
          </div>

          <div className="version-card">
            <h3>Version B (Variant)</h3>
            {/* TODO: Add input fields for variantVisitors and variantConversions */}
            <div className="input-group">
              <label>Visitors:</label>
              <input
                type="number"
                value={inputs.variantVisitors}
                onChange={(e) => handleInputChange('variantVisitors', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Conversions:</label>
              <input
                type="number"
                value={inputs.variantConversions}
                onChange={(e) => handleInputChange('variantConversions', e.target.value)}
              />
            </div>
            <p>Conversion Rate: {variantRate}%</p>
            {/* Show calculated rate below */}
          </div>
        </div>

        <button 
          className="calculate-button"
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Calculate Results'}
        </button>

        {error && <div className="error">{error}</div>}
      </div>

      {/* TODO: Display results here when results is not null */}
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};