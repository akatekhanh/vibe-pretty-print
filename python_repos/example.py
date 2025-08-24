#!/usr/bin/env python3
"""
Example usage of vibe-pretty-print library.

This example demonstrates using environment variable for API key.
Set your OpenAI API key as environment variable:
export VIBE_PP_API_KEY="sk-your-openai-api-key-here"
"""

import os
from vibe_pprint import vibe_pprint
from vibe_pprint.core import ValidationError

# Example data
json_data = '{"users":[{"name":"Alice","age":25,"skills":["Python","JavaScript"]},{"name":"Bob","age":30,"skills":["Java","SQL"]}]}'

yaml_data = """
config:
  database:
    host: localhost
    port: 5432
    name: myapp
  cache:
    type: redis
    host: localhost
    port: 6379
"""

xml_data = "<bookstore><book id=\"1\"><title>Python Guide</title><author>John Doe</author><price>29.99</price></book></bookstore>"

text_data = """
# Configuration File
server_name: my-server
port: 8080
url: https://example.com/api/v1
max_connections: 100
"""

if __name__ == "__main__":
    print("=== Environment Variable Setup ===")
    print("Make sure to set your API key:")
    print("export VIBE_PP_API_KEY='sk-your-openai-api-key-here'")
    print()
    
    # Check if API key is available
    if not os.getenv('VIBE_PP_API_KEY'):
        print("⚠️  Warning: VIBE_PP_API_KEY environment variable not set")
        print("You can either:")
        print("1. Set the environment variable: export VIBE_PP_API_KEY='your-key'")
        print("2. Use hardcoded key: vibe_pprint(api_key='your-key', text=data, format_type='json')")
        print()
    
    print("=== JSON Formatting ===")
    try:
        formatted_json = vibe_pprint(text=json_data, format_type="json")
        print(formatted_json)
    except Exception as e:
        print(f"JSON formatting failed: {e}")
    
    print("\n=== YAML Formatting ===")
    try:
        formatted_yaml = vibe_pprint(text=yaml_data, format_type="yaml")
        print(formatted_yaml)
    except Exception as e:
        print(f"YAML formatting failed: {e}")
    
    print("\n=== XML Formatting ===")
    try:
        formatted_xml = vibe_pprint(text=xml_data, format_type="xml")
        print(formatted_xml)
    except Exception as e:
        print(f"XML formatting failed: {e}")
    
    print("\n=== Text Formatting ===")
    try:
        formatted_text = vibe_pprint(text=text_data, format_type="text")
        print(formatted_text)
    except Exception as e:
        print(f"Text formatting failed: {e}")
    
    print("\n=== Validation Examples ===")
    
    # Invalid JSON example
    invalid_json = '{"invalid": json, "missing": quotes}'
    try:
        vibe_pprint(text=invalid_json, format_type="json")
    except ValidationError as e:
        print(f"Caught validation error: {e}")
    
    # Invalid format type
    try:
        vibe_pprint(text="test", format_type="invalid")
    except ValueError as e:
        print(f"Caught value error: {e}")
    
    print("\n=== Alternative: Hardcoded API Key Example ===")
    print("# Uncomment to use hardcoded key instead of environment variable")
    print("# api_key = 'sk-your-openai-api-key-here'")
    print("# result = vibe_pprint(api_key=api_key, text=json_data, format_type='json')")