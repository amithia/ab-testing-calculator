// services/api.ts

import axios from 'axios';
import { TestInputs, TestResults, SampleSizeInputs, SampleSizeResult } from '../types';

// Your Flask backend URL
const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Calculate A/B test results
 */
export const calculateTest = async (inputs: TestInputs): Promise<TestResults> => {
  // TODO: Implement this function
  // 1. Make a POST request to `${API_BASE_URL}/calculate`
  // 2. Send the inputs as JSON
  // 3. Return the response data
  try {
    const response = await axios.post(`${API_BASE_URL}/calculate`, {
      control_conversions: inputs.controlConversions,
      control_visitors: inputs.controlVisitors,
      variant_conversions: inputs.variantConversions,
      variant_visitors: inputs.variantVisitors
    });
    return response.data;
  } catch (error) {
    console.error('Calculate test error:', error);
    throw error; // Re-throw so the component can handle it
  }
};

/**
 * Calculate required sample size
 */
export const calculateSampleSize = async (inputs: SampleSizeInputs): Promise<SampleSizeResult> => {
  // TODO: Implement this function
  // Similar to above, but POST to `${API_BASE_URL}/sample-size`
  try {
    const response = await axios.post(`${API_BASE_URL}/sample-size`, {  
    baseline_rate: inputs.baselineRate,
    expected_rate: inputs.expectedRate,
    alpha: inputs.alpha,
    power: inputs.power
  });
    return response.data;
    } catch (error) {
    console.error('Calculate sample size error:', error);
    throw error; // Re-throw so the component can handle it
  }
};

/**
 * Health check
 */
export const checkHealth = async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data.status === "ok";
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
};