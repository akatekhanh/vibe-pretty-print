# Vibe Pretty Print

A smart library for formatting JSON, XML, YAML, and plain text with OpenAI-powered enhancement. Available for both **Python** and **JavaScript**.

## 🌟 Features

- **Multi-format support**: JSON, XML, YAML, and plain text formatting
- **Validation**: Validates JSON, XML, and YAML before formatting
- **OpenAI integration**: Uses OpenAI GPT for enhanced formatting and readability
- **Color output**: Provides colored output for better readability
- **Fallback handling**: Gracefully falls back to standard formatting if OpenAI fails
- **Type-safe**: Full type hints and error handling

## 📦 Installation

### Python

```bash
pip install vibe-pretty-print
```

### JavaScript/Node.js

```bash
npm install vibe-pretty-print
```

## 🔧 Setup

### Prerequisites

You'll need an OpenAI API key to use the enhanced formatting features. If you don't have one, you can get it from [OpenAI's platform](https://platform.openai.com/api-keys).

### Environment Variable Setup (Recommended)

Set your OpenAI API key as an environment variable for both Python and JavaScript:

```bash
# Linux/macOS
export VIBE_PP_API_KEY="your-openai-api-key-here"

# Windows (PowerShell)
$env:VIBE_PP_API_KEY="your-openai-api-key-here"

# Windows (Command Prompt)
set VIBE_PP_API_KEY=your-openai-api-key-here
```

## 🚀 Usage

### Python Usage

```python
from vibe_pprint import vibe_pprint

# Format JSON
json_text = '{"name":"John","age":30,"city":"New York"}'
formatted_json = vibe_pprint(text=json_text, format_type="json")
print(formatted_json)

# Format YAML
yaml_text = "name: John\nage: 30\ncity: New York"
formatted_yaml = vibe_pprint(text=yaml_text, format_type="yaml")
print(formatted_yaml)

# Format XML
xml_text = "<person><name>John</name><age>30</age></person>"
formatted_xml = vibe_pprint(text=xml_text, format_type="xml")
print(formatted_xml)

# Format plain text
text = "Hello World! This is a test."
formatted_text = vibe_pprint(text=text, format_type="text")
print(formatted_text)
```

### JavaScript Usage

```javascript
import { vibePPrint } from 'vibe-pretty-print';

// Format JSON
const jsonText = '{"name":"John","age":30,"city":"New York"}';
const formattedJson = await vibePPrint(jsonText, 'json');
console.log(formattedJson);

// Format YAML
const yamlText = "name: John\nage: 30\ncity: New York";
const formattedYaml = await vibePPrint(yamlText, 'yaml');
console.log(formattedYaml);

// Format XML
const xmlText = "<person><name>John</name><age>30</age></person>";
const formattedXml = await vibePPrint(xmlText, 'xml');
console.log(formattedXml);

// Format plain text
const text = "Hello World! This is a test.";
const formattedText = await vibePPrint(text, 'text');
console.log(formattedText);
```

## 🎯 API Reference

### Python API

```python
vibe_pprint(text, format_type="text", api_key=None)
```

**Parameters:**
- `text` (str): The content to format (JSON, XML, YAML, or plain text)
- `format_type` (str): Type of content - `"json"`, `"xml"`, `"yaml"`, or `"text"` (default: `"text"`)
- `api_key` (str, optional): Your OpenAI API key. If not provided, will use `VIBE_PP_API_KEY` environment variable.

**Returns:**
- `str`: Pretty-printed/formatted string

### JavaScript API

```javascript
vibePPrint(text, formatType, apiKey?)
```

**Parameters:**
- `text` (string): The content to format (JSON, XML, YAML, or plain text)
- `formatType` (string): Type of content - `"json"`, `"xml"`, `"yaml"`, or `"text"` (default: `"text"`)
- `apiKey` (string, optional): Your OpenAI API key. If not provided, will use `VIBE_PP_API_KEY` environment variable.

**Returns:**
- `Promise<string>`: Pretty-printed/formatted string

## 📋 Examples

### JSON Formatting

**Input:**
```json
{"users":[{"name":"Alice","age":25},{"name":"Bob","age":30}]}
```

**Output:**
```json
{
  "users": [
    {
      "age": 25,
      "name": "Alice"
    },
    {
      "age": 30,
      "name": "Bob"
    }
  ]
}
```

### YAML Formatting

**Input:**
```yaml
users:
  - name: Alice
    age: 25
    skills:
      - Python
      - JavaScript
  - name: Bob
    age: 30
    skills:
      - Java
      - SQL
```

### XML Formatting

**Input:**
```xml
<book><title>Python Guide</title><author>John Doe</author><year>2024</year></book>
```

**Output:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<book>
  <title>Python Guide</title>
  <author>John Doe</author>
  <year>2024</year>
</book>
```

## ⚠️ Error Handling

Both libraries provide specific exceptions for different error scenarios:

### Python

```python
from vibe_pprint import ValidationError, OpenAIError

try:
    result = vibe_pprint(invalid_json, "json")
except ValidationError as e:
    print(f"Input validation failed: {e}")
except OpenAIError as e:
    print(f"OpenAI API error: {e}")
except ValueError as e:
    print(f"Invalid input: {e}")
```

### JavaScript

```javascript
import { ValidationError, OpenAIError } from 'vibe-pretty-print';

try {
    const result = await vibePPrint(invalidJson, 'json');
} catch (error) {
    if (error instanceof ValidationError) {
        console.error('Input validation failed:', error.message);
    } else if (error instanceof OpenAIError) {
        console.error('OpenAI API error:', error.message);
    } else {
        console.error('Unknown error:', error.message);
    }
}
```

## 📋 Requirements

### Python
- Python 3.7+
- requests
- PyYAML
- colorama
- lxml

### JavaScript
- Node.js 14+
- OpenAI API key

## 🛠️ Development

### Python Development

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Code formatting
black vibe_pprint/

# Type checking
mypy vibe_pprint/
```

### JavaScript Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Code formatting
npm run format
```

## 📁 Repository Structure

```
vibe-pretty-print/
├── README.md                 # This file
├── python_repos/            # Python package
│   ├── README.md           # Python-specific documentation
│   ├── vibe_pretty_print/  # Python source code
│   └── tests/              # Python tests
├── js_repos/               # JavaScript package
│   ├── README.md          # JavaScript-specific documentation
│   ├── src/               # JavaScript source code
│   └── tests/             # JavaScript tests
└── build.sh              # Build script
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Run the test suite
6. Submit a pull request

## 📞 Support

For issues and questions, please use the [GitHub Issues](https://github.com/yourusername/vibe-pretty-print/issues) page.