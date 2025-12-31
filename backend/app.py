# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from calculations import (
    calculate_z_test, 
    calculate_confidence_interval,
    calculate_sample_size
)
from validators import validate_test_inputs, validate_sample_size_inputs, ValidationError

app = Flask(__name__)
CORS(app)  # Allow frontend to connect


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "A/B Test Calculator API is running"})


@app.route('/api/calculate', methods=['POST'])
def calculate():
    try:
        data = request.json
        print(f"DEBUG: Received data: {data}")
        
        x1 = data.get('control_conversions')
        n1 = data.get('control_visitors')
        x2 = data.get('variant_conversions')
        n2 = data.get('variant_visitors')
        
        print(f"DEBUG: x1={x1}, n1={n1}, x2={x2}, n2={n2}")
        print(f"DEBUG: Types: {type(x1)}, {type(n1)}, {type(x2)}, {type(n2)}")
        
        validate_test_inputs(x1, n1, x2, n2)
        
        z_result = calculate_z_test(x1, n1, x2, n2)
        ci_result = calculate_confidence_interval(x1, n1, x2, n2)
        
        result = {
            'control_rate': x1/n1,
            'variant_rate': x2/n2,
            'z_score': float(z_result['z_score']),  # Ensure it's a Python float
            'p_value': float(z_result['p_value']),  # Ensure it's a Python float
            'is_significant': bool(z_result['is_significant']),  # Convert to Python bool
            'confidence_interval': ci_result
        }
        
        return jsonify(result), 200
        
    except ValidationError as e:
        print(f"VALIDATION ERROR: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"EXCEPTION: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/sample-size', methods=['POST'])
def sample_size():
    """Sample size calculator endpoint."""
    try:
        # 1. Get data from request
        data = request.json
        baseline_rate = data.get('baseline_rate')
        expected_rate = data.get('expected_rate')
        alpha = data.get('alpha', 0.05)  # Default to 0.05 if not provided
        power = data.get('power', 0.80)  # Default to 0.80 if not provided
        
        # 2. Validate inputs
        validate_sample_size_inputs(baseline_rate, expected_rate, alpha, power)
        
        # 3. Calculate sample size
        result = calculate_sample_size(baseline_rate, expected_rate, alpha, power)
        
        # 4. Return result
        return jsonify(result), 200
        
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)