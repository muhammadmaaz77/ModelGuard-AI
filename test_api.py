import requests
import json
import time

BASE = 'http://localhost:8000'
results = []

def test_endpoint(method, path, **kwargs):
    try:
        if method == 'GET':
            r = requests.get(BASE + path, timeout=5, **kwargs)
        elif method == 'POST':
            r = requests.post(BASE + path, timeout=5, **kwargs)
        
        response_data = r.json() if r.headers.get('content-type', '').startswith('application/json') else r.text[:100]
        
        results.append({
            'endpoint': f'{method} {path}',
            'status': r.status_code,
            'success': 200 <= r.status_code < 300,
            'response': response_data
        })
        if 200 <= r.status_code < 300:
            print(f'[SUCCESS] {method} {path}')
        else:
            print(f'[FAILED] {method} {path} - Status: {r.status_code}')
    except Exception as e:
        results.append({
            'endpoint': f'{method} {path}',
            'status': 'ERROR',
            'success': False,
            'response': str(e)
        })
        print(f'[FAILED] {method} {path} - ERROR: {e}')

print('Running API Tests...')
test_endpoint('GET', '/health')
test_endpoint('GET', '/status')
test_endpoint('GET', '/metrics')
test_endpoint('GET', '/logs')
test_endpoint('GET', '/model-info')
test_endpoint('GET', '/drift-summary')

# Test Predict Endpoint (Full valid payload)
full_payload = {
    'SeniorCitizen': 0, 'tenure': 24, 'MonthlyCharges': 65.5, 'TotalCharges': 1572.0,
    'gender_Male': 1, 'Partner_Yes': 1, 'Dependents_Yes': 0, 'PhoneService_Yes': 1,
    'MultipleLines_No phone service': 0, 'MultipleLines_Yes': 1,
    'InternetService_Fiber optic': 1, 'InternetService_No': 0,
    'OnlineSecurity_No internet service': 0, 'OnlineSecurity_Yes': 0,
    'OnlineBackup_No internet service': 0, 'OnlineBackup_Yes': 1,
    'DeviceProtection_No internet service': 0, 'DeviceProtection_Yes': 0,
    'TechSupport_No internet service': 0, 'TechSupport_Yes': 0,
    'StreamingTV_No internet service': 0, 'StreamingTV_Yes': 1,
    'StreamingMovies_No internet service': 0, 'StreamingMovies_Yes': 1,
    'Contract_One year': 0, 'Contract_Two year': 0,
    'PaperlessBilling_Yes': 1, 'PaymentMethod_Credit card (automatic)': 0,
    'PaymentMethod_Electronic check': 1, 'PaymentMethod_Mailed check': 0
}
test_endpoint('POST', '/predict', json=full_payload)

# Test Predict Endpoint (Missing feature payload)
partial_payload = {'SeniorCitizen': 0, 'tenure': 24, 'MonthlyCharges': 65.5}
test_endpoint('POST', '/predict', json=partial_payload)

print('\\nDetailed Failures & Validations:')
for r in results:
    if not r['success'] or (r['endpoint'] == 'POST /predict'):
        print(f"{r['endpoint']} -> Status: {r['status']}")
        print(f"Response: {str(r['response'])[:300]}\\n")
