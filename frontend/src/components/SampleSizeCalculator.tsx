// components/SampleSizeCalculator.tsx

import React, { useState } from 'react';
import { SampleSizeInputs, SampleSizeResult } from '../types';
import { calculateSampleSize } from '../services/api';
import './SampleSizeCalculator.css';

export const SampleSizeCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<SampleSizeInputs>({
    baselineRate: 0.05,
    expectedRate: 0.06,
    alpha: 0.05,
    power: 0.80,
  });

  const [result, setResult] = useState<SampleSizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof SampleSizeInputs, value: string) => {
    setInputs({
      ...inputs,
      [field]: parseFloat(value) || 0
    });
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calculateSampleSize(inputs);
      setResult(data);
    } catch (err) {
      setError('Failed to calculate sample size. Check backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const relativeImprovement = inputs.baselineRate > 0
    ? (((inputs.expectedRate - inputs.baselineRate) / inputs.baselineRate) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="sample-size-calculator">
      <div className="input-section">
        <div className="input-card">
          <div className="input-group">
            <label>Current Conversion Rate (%):</label>
            <input
              type="number"
              step="0.1"
              value={inputs.baselineRate * 100}
              onChange={(e) => handleInputChange('baselineRate', (parseFloat(e.target.value) / 100).toString())}
            />
            <span className="input-hint">Your current conversion rate</span>
          </div>

          <div className="input-group">
            <label>Expected Conversion Rate (%):</label>
            <input
              type="number"
              step="0.1"
              value={inputs.expectedRate * 100}
              onChange={(e) => handleInputChange('expectedRate', (parseFloat(e.target.value) / 100).toString())}
            />
            <span className="input-hint">
              What you hope to achieve (That's a {relativeImprovement}% relative improvement)
            </span>
          </div>

          <div className="advanced-toggle">
            <button onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? '▼' : '▶'} Advanced Settings
            </button>
          </div>

          {showAdvanced && (
            <div className="advanced-inputs">
              <div className="input-group">
                <label>Significance Level (α):</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.alpha}
                  onChange={(e) => handleInputChange('alpha', e.target.value)}
                />
                <span className="input-hint">Typically 0.05 (95% confidence)</span>
              </div>

              <div className="input-group">
                <label>Statistical Power:</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.power}
                  onChange={(e) => handleInputChange('power', e.target.value)}
                />
                <span className="input-hint">Typically 0.80 (80% power)</span>
              </div>
            </div>
          )}

          <button 
            className="calculate-button"
            onClick={handleCalculate}
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate Sample Size'}
          </button>

          {error && <div className="error">{error}</div>}
        </div>
      </div>

      {result && (
        <div className="result-section">
          <div className="result-card">
            <h3>You Need:</h3>
            <div className="result-highlight">
              <span className="result-number">{result.sample_size_per_variant.toLocaleString()}</span>
              <span className="result-label">visitors per version</span>
            </div>
            <div className="result-highlight secondary">
              <span className="result-number">{result.total_sample_size.toLocaleString()}</span>
              <span className="result-label">total visitors</span>
            </div>
          </div>

          <div className="timeline-estimator">
            <h4>Timeline Estimate</h4>
            <p className="tip">
              Tip: Smaller improvements need more data! To detect a {inputs.baselineRate * 100}% → {inputs.expectedRate * 100}% 
              change requires {result.sample_size_per_variant.toLocaleString()} visitors per version.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};