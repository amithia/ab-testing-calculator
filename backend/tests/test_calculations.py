# tests/test_calculations.py

import pytest
from calculations import (
    calculate_conversion_rate,
    calculate_z_test,
    calculate_confidence_interval,
    calculate_sample_size
)


class TestConversionRate:
    def test_normal_case(self):
        rate = calculate_conversion_rate(50, 1000)
        assert rate == 0.05
    
    def test_zero_visitors(self):
        rate = calculate_conversion_rate(0, 0)
        assert rate == 0.0
    
    def test_no_conversions(self):
        rate = calculate_conversion_rate(0, 1000)
        assert rate == 0.0


class TestZTest:
    def test_not_significant(self):
        result = calculate_z_test(50, 1000, 60, 1000)
        assert result['p_value'] > 0.05
        assert result['is_significant'] == False
    
    def test_significant(self):
        result = calculate_z_test(50, 1000, 100, 1000)
        assert result['p_value'] < 0.05
        assert result['is_significant'] == True
    
    def test_identical_rates(self):
        result = calculate_z_test(50, 1000, 50, 1000)
        assert result['z_score'] == 0.0
        assert result['is_significant'] == False


class TestConfidenceInterval:
    def test_includes_zero_when_not_significant(self):
        result = calculate_confidence_interval(50, 1000, 60, 1000)
        # If not significant, CI should include zero
        assert result['lower_bound'] < 0 < result['upper_bound']
    
    def test_positive_difference(self):
        result = calculate_confidence_interval(50, 1000, 100, 1000)
        assert result['difference'] > 0
        assert result['lower_bound'] > 0  # Clearly better


class TestSampleSize:
    def test_reasonable_sample_size(self):
        result = calculate_sample_size(0.05, 0.06)
        # Should need several thousand per variant
        assert 5000 < result['sample_size_per_variant'] < 10000
    
    def test_total_is_double(self):
        result = calculate_sample_size(0.05, 0.06)
        assert result['total_sample_size'] == result['sample_size_per_variant'] * 2
    
    def test_zero_difference(self):
        result = calculate_sample_size(0.05, 0.05)
        assert result['sample_size_per_variant'] == 0