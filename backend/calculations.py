# calculations.py

from scipy import stats 
import math

def calculate_conversion_rate(conversions: int, visitors: int) -> float:
    """
    Calculates conversion rate as a decimal. 

    Args:
        conversions (int): Number of conversions.
        visitors (int): Total number of visitors.

    Returns:
        Conversion rate as a decimal    
    """
    if visitors > 0:
        return conversions/visitors
    return 0.0

def calculate_z_test(x1: int, n1: int, x2: int, n2: int) -> dict:
    """
    Performs a Z-test for two proportions.

    Args:
        x1: Number of successes in group 1.
        n1: Total number of trials in group 1.
        x2: Number of successes in group 2.
        n2: Total number of trials in group 2.

    Returns:
        dict with: z_score, p_value, is_significant
    """
    p1 = x1/n1 if n1 > 0 else 0
    p2 = x2/n2 if n2 > 0 else 0
    p_pool = (x1+x2)/(n1+n2) if (n1+n2) > 0 else 0

    standard_error = math.sqrt(p_pool*(1-p_pool)*(1/n1+1/n2)) if n1 > 0 and n2 > 0 else 0

    if standard_error == 0:
        return {
            'z_score': 0.0,
            'p_value': 1.0,  # If no difference possible, p-value = 1
            'is_significant': False
        }

    z_score = (p2-p1)/standard_error
    
    p_value = 2*(1-stats.norm.cdf(z_score))  # Two-tailed test
    alpha = 0.05
    is_significant = p_value < alpha

    result = {
        'z_score': z_score,
        'p_value': p_value,
        'is_significant': is_significant
    }

    return result

def calculate_confidence_interval(x1: int, n1: int, x2: int, n2: int, confidence_level: float = 0.95) -> dict:
    """
    Calculates the confidence interval for the difference in conversion rates.

    Args:
        x1: Conversions for control
        n1: Visiotors for control
        x2: Conversions for variant
        n2: Visitors for variant
        confidence_level: Confidence level (default 0.95 for 95%)

    Returns:
        dict with: difference, lower_bound, upper_bound, confidence_level
    """
    p1 = x1/n1 if n1 > 0 else 0
    p2 = x2/n2 if n2 > 0 else 0

    standard_error = math.sqrt((p1*(1-p1)/n1)+(p2*(1-p2)/n2)) if n1 > 0 and n2 > 0 else 0

    z_score = stats.norm.ppf(1-(1-confidence_level)/2)

    margin_of_error = z_score * standard_error

    lower_bound = (p2-p1)-margin_of_error
    upper_bound = (p2-p1)+margin_of_error

    result = {
        'difference': p2-p1,
        'lower_bound': lower_bound,
        'upper_bound': upper_bound,
        'confidence_level': confidence_level
    }

    return result

def calculate_sample_size(baseline_rate: float, expected_rate: float, alpha: float = 0.05, power: float = 0.8) -> dict:
    """
    Calculates the required sample size per variant.

    Args:
        baseline_rate: Current conversion rate
        expected_rate: Expected new conversion rate
        alpha: Significance level (default 0.05)
        power: Statistical power (default 0.8)

    Returns:
        dict with: sample_size_per_variant, total_sample_size
    """
    p1 = baseline_rate
    p2 = expected_rate
    p_pool = (p1+p2)/2

    z_alpha = stats.norm.ppf(1-alpha/2)
    z_beta = stats.norm.ppf(power)

    numerator = (z_alpha*math.sqrt(2*p_pool*(1-p_pool)) + z_beta * math.sqrt(p1*(1-p1) + p2*(1-p2))) ** 2
    denominator = (p2-p1) ** 2

    sample_size_per_variant = numerator/denominator if denominator > 0 else 0
    sample_size_per_variant = math.ceil(sample_size_per_variant)

    result = {
        'sample_size_per_variant': sample_size_per_variant,
        'total_sample_size': sample_size_per_variant*2
    }

    return result
