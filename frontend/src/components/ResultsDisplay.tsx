// components/ResultsDisplay.tsx

import React from 'react';
import { TestResults } from '../types';
import './ResultsDisplay.css';
import { exportTestResultsToPDF } from '../utils/exportPDF';

interface Props {
  results: TestResults;
}

export const ResultsDisplay: React.FC<Props> = ({ results }) => {
  const controlRatePercent = (results.control_rate * 100).toFixed(1);
  const variantRatePercent = (results.variant_rate * 100).toFixed(1);
  const difference = ((results.variant_rate - results.control_rate) * 100).toFixed(1);
  
  const relativeImprovement = results.control_rate > 0
    ? (((results.variant_rate - results.control_rate) / results.control_rate) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="results-display">
      {/* Verdict Section */}
      <div className={`verdict-card ${results.is_significant ? 'significant' : 'not-significant'}`}>
        <h3>The Verdict</h3>
        {results.is_significant ? (
          <div>
            <p className="verdict-title">Result is Statistically Significant</p>
            <p className="verdict-description">
              Version B is performing {difference}% {parseFloat(difference) > 0 ? 'better' : 'worse'} than Version A.
              This difference is reliable and unlikely due to chance.
            </p>
          </div>
        ) : (
          <div>
            <p className="verdict-title">Keep Testing - Not Enough Data</p>
            <p className="verdict-description">
              Version B shows a {difference}% difference, but we need more data to be confident this is real
              and not just random chance.
            </p>
          </div>
        )}
      </div>

      {/* Export Button */}
      <button 
        className="export-button"
        onClick={() => exportTestResultsToPDF(results)}
      >
        Export to PDF
      </button>

      {/* Comparison Section */}
      <div className="comparison-section">
        <h3>Conversion Rate Comparison</h3>
        <div className="comparison-bars">
          <div className="comparison-row">
            <span className="version-label">Version A:</span>
            <div className="bar-container">
              <div 
                className="bar bar-control" 
                style={{ width: `${Math.min(results.control_rate * 100 * 10, 100)}%` }}
              />
              <span className="bar-value">{controlRatePercent}%</span>
            </div>
          </div>

          <div className="comparison-row">
            <span className="version-label">Version B:</span>
            <div className="bar-container">
              <div 
                className="bar bar-variant" 
                style={{ width: `${Math.min(results.variant_rate * 100 * 10, 100)}%` }}
              />
              <span className="bar-value">{variantRatePercent}%</span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Absolute Difference</span>
            <span className="stat-value">{difference}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Relative Improvement</span>
            <span className="stat-value">{relativeImprovement}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Confidence</span>
            <span className="stat-value">
              {(results.confidence_interval.confidence_level * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Stats - Collapsible */}
      <details className="advanced-stats">
        <summary>Show Advanced Statistics</summary>
        <div className="advanced-content">
          <div className="stat-row">
            <span>P-value:</span>
            <span>{results.p_value.toFixed(4)}</span>
          </div>
          <div className="stat-row">
            <span>Z-score:</span>
            <span>{results.z_score.toFixed(2)}</span>
          </div>
          <div className="stat-row">
            <span>Confidence Interval:</span>
            <span>
              [{(results.confidence_interval.lower_bound * 100).toFixed(2)}%, 
               {(results.confidence_interval.upper_bound * 100).toFixed(2)}%]
            </span>
          </div>
        </div>
      </details>
    </div>
  );
};