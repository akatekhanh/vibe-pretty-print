# Deploying vibe-pretty-print to PyPI

## Quick Start

Your package is ready for PyPI! Here's how to deploy:

### 1. Build the package
```bash
python -m build
```

### 2. Upload to PyPI Test
```bash
twine upload --repository testpypi dist/*
```

### 3. Upload to PyPI (Production)
```bash
twine upload dist/*
```

## Package Structure

```
vibe-pretty-print/
├── vibe_pprint/
│   ├── __init__.py
│   └── core.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_core.py
├── dist/                    # Built packages
├── LICENSE
├── MANIFEST.in
├── README.md
├── example.py
├── setup.py
└── .gitignore
```

## Features Implemented

✅ **Multi-format support**: JSON, XML, YAML, and plain text
✅ **Validation**: Validates JSON, XML, and YAML before formatting
✅ **OpenAI integration**: Uses OpenAI GPT for enhanced formatting
✅ **Color output**: Provides colored output for better readability
✅ **Fallback handling**: Gracefully falls back to standard formatting if OpenAI fails
✅ **Type-safe**: Full type hints and error handling
✅ **PyPI ready**: Proper package structure and metadata
✅ **Comprehensive tests**: 27 tests covering all functionality
✅ **Documentation**: Complete README with examples

## Installation Testing

You can test the package locally:

```bash
pip install dist/vibe_pretty_print-0.1.0-py3-none-any.whl
```

## Usage Examples

### **Method 1: Using Environment Variable (Recommended)**

```bash
# Set your OpenAI API key as environment variable
export VIBE_PP_API_KEY="sk-your-openai-api-key-here"
```

```python
from vibe_pprint import vibe_pprint

# Format JSON - API key will be read from environment
json_text = '{"name": "John", "age": 30}'
result = vibe_pprint(text=json_text, format_type="json")

# Format YAML
yaml_text = "name: John\\nage: 30"
result = vibe_pprint(text=yaml_text, format_type="yaml")

# Format XML
xml_text = "<person><name>John</name><age>30</age></person>"
result = vibe_pprint(text=xml_text, format_type="xml")

# Format plain text
text = "Hello World! This is a test."
result = vibe_pprint(text=text, format_type="text")
```

### **Method 2: Using Hardcoded API Key**

```python
from vibe_pprint import vibe_pprint

# Format JSON with hardcoded API key
json_text = '{"name": "John", "age": 30}'
result = vibe_pprint(api_key="sk-your-openai-api-key-here", text=json_text, format_type="json")

# Format YAML with hardcoded API key
yaml_text = "name: John\\nage: 30"
result = vibe_pprint(api_key="sk-your-openai-api-key-here", text=yaml_text, format_type="yaml")

# Format XML with hardcoded API key
xml_text = "<person><name>John</name><age>30</age></person>"
result = vibe_pprint(api_key="sk-your-openai-api-key-here", text=xml_text, format_type="xml")

# Format plain text with hardcoded API key
text = "Hello World! This is a test."
result = vibe_pprint(api_key="sk-your-openai-api-key-here", text=text, format_type="text")
```

### **Method 3: Priority Order**

The library uses this priority order for API key resolution:
1. **Function parameter** (highest priority)
2. **Environment variable** `VIBE_PP_API_KEY`
3. **Hardcoded fallback** (empty by default, users can modify source)

```python
# Example: function parameter takes priority over environment variable
import os
os.environ['VIBE_PP_API_KEY'] = 'env-key'

# This will use 'function-key' instead of 'env-key'
result = vibe_pprint(api_key='function-key', text='{"test": "data"}', format_type='json')
```

## Requirements

- Python 3.7+
- requests (>=2.25.0)
- PyYAML (>=5.4.0)
- colorama (>=0.4.4)
- lxml (>=4.6.0)

## Next Steps

1. **Update author information** in setup.py
2. **Create PyPI account** at https://pypi.org/account/register/
3. **Create API token** in PyPI account settings
4. **Upload package** using twine
5. **Test installation** from PyPI

## API Documentation

### `vibe_pprint(api_key=None, text="", format_type="text")`

**Parameters:**
- `api_key` (str, optional): Your OpenAI API key. If not provided, will check environment variable `VIBE_PP_API_KEY`
- `text` (str): Content to format
- `format_type` (str): Type - "json", "xml", "yaml", or "text"

**Returns:**
- `str`: Formatted content

**Raises:**
- `ValidationError`: Invalid format
- `OpenAIError`: API issues
- `ValueError`: Invalid inputs or no API key found

## Commands Summary

```bash
# Install in development mode
pip install -e .

# Run tests
python -m pytest tests/ -v

# Build package
python -m build

# Upload to PyPI
python -m twine upload dist/*
```

Your library is production-ready! 🚀