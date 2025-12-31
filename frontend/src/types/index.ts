// types/index.ts

// Input data for the calculator
export interface TestInputs {
  controlConversions: number;
  controlVisitors: number;
  variantConversions: number;
  variantVisitors: number;
}

// Results from the /api/calculate endpoint
export interface TestResults {
  // TODO: API return for test results
  control_rate: number;
  variant_rate: number;
  z_score: number;
  p_value: number;
  is_significant: boolean;
  confidence_interval: ConfidenceInterval;
}

// Confidence interval structure
export interface ConfidenceInterval {
  // TODO: API return for confidence intervals
  difference: number;
  lower_bound: number;
  upper_bound: number;
  confidence_level: number;

}

// Sample size calculator inputs
export interface SampleSizeInputs {
  baselineRate: number;
  expectedRate: number;
  alpha?: number;  // Optional, defaults to 0.05
  power?: number;  // Optional, defaults to 0.80
}

// Sample size calculator results
export interface SampleSizeResult {
  sample_size_per_variant: number;
  total_sample_size: number;
      
}