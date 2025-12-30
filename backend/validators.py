# validators.py

class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass


def validate_test_inputs(x1: int, n1: int, x2: int, n2: int) -> None:
    """
    Validate inputs for A/B test calculations.
    
    Args:
        x1: Conversions for control
        n1: Visitors for control
        x2: Conversions for variant
        n2: Visitors for variant
        
    Raises:
        ValidationError: If any validation fails
    """
    if not all(isinstance(i, int) and i >= 0 for i in [x1, n1, x2, n2]):
        raise ValidationError("All values must be non-negative integers")
    
    if n1 == 0 or n2 == 0:
        raise ValidationError("Visitors must be greater than 0")

    if x1 > n1 or x2 > n2:
        raise ValidationError("Conversions cannot exceed visitors")

    if n1 < 30 or n2 < 30:
        print("Warning: Sample sizes are less than 30. Results may be unreliable.")


def validate_sample_size_inputs(baseline_rate: float, 
                                expected_rate: float,
                                alpha: float = 0.05,
                                power: float = 0.80) -> None:
    """
    Validate inputs for sample size calculation.
    
    Args:
        baseline_rate: Current conversion rate (0-1)
        expected_rate: Expected new conversion rate (0-1)
        alpha: Significance level (0-1)
        power: Statistical power (0-1)
        
    Raises:
        ValidationError: If any validation fails
    """
    if not (0 <= baseline_rate <= 1):
        raise ValidationError("Baseline rate must be between 0 and 1")

    if not (0 <= expected_rate <= 1):
        raise ValidationError("Expected rate must be between 0 and 1")

    if not (0 < alpha < 1):
        raise ValidationError("Alpha must be between 0 and 1")

    if not (0 < power < 1):
        raise ValidationError("Power must be between 0 and 1")

    if baseline_rate == expected_rate:
        raise ValidationError("Baseline rate and expected rate must be different")