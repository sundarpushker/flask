#!/usr/bin/env python3

import requests
import json

def make_get_request(url):
    """Make a GET request to an HTTPS endpoint"""
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
    except requests.exceptions.RequestException as e:
        print(f"Error making GET request: {e}")
        return None

def make_post_request(url, data):
    """Make a POST request to an HTTPS endpoint"""
    try:
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=json.dumps(data), headers=headers)
        response.raise_for_status()
        return response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
    except requests.exceptions.RequestException as e:
        print(f"Error making POST request: {e}")
        return None

def main():
    # Example using a public API that doesn't require authentication
    base_url = "https://jsonplaceholder.typicode.com"
    
    # GET request example
    print("Making GET request...")
    get_result = make_get_request(f"{base_url}/posts/1")
    if get_result:
        print("GET Response:")
        print(json.dumps(get_result, indent=2))
    
    print("\n" + "="*50 + "\n")
    
    # POST request example
    print("Making POST request...")
    post_data = {
        "title": "Test Post",
        "body": "This is a test post",
        "userId": 1
    }
    
    post_result = make_post_request(f"{base_url}/posts", post_data)
    if post_result:
        print("POST Response:")
        print(json.dumps(post_result, indent=2))

if __name__ == "__main__":
    main()
