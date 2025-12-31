// App.tsx

import React, { useState } from 'react';
import './App.css';
import { TestResultsCalculator } from './components/TestResultsCalculator';

type Tab = 'results' | 'sample-size';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('results');

  return (
    <div className="App">
      <header className="app-header">
        <h1>A/B Test Calculator</h1>
      </header>

      <div className="tab-container">
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Test Results
        </button>
        <button
          className={`tab ${activeTab === 'sample-size' ? 'active' : ''}`}
          onClick={() => setActiveTab('sample-size')}
        >
          Sample Size Calculator
        </button>
      </div>

      <div className="content">
        {activeTab === 'results' && (
          <div>
            <h2>TestResultsCalculator</h2>
            <TestResultsCalculator />
          </div>
        )}

        {activeTab === 'sample-size' && (
          <div>
            <h2>Sample Size Calculator</h2>
            {/* TODO: SampleSizeCalculator component will go here */
            <p>Sample Size Calculator Component Placeholder</p>
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default App;