# vibe-pretty-print (JavaScript)

A smart JavaScript library for formatting JSON, XML, YAML, and plain text with OpenAI-powered enhancement.

## Features

- **Multi-format support**: JSON, XML, YAML, and plain text formatting
- **Validation**: Validates JSON, XML, and YAML before formatting
- **OpenAI integration**: Uses OpenAI GPT for enhanced formatting and readability
- **Color output**: Provides colored output for better readability
- **Fallback handling**: Gracefully falls back to standard formatting if OpenAI fails
- **Type-safe**: Full TypeScript support and error handling

## Installation

```bash
npm install vibe-pretty-print
```

## Quick Start

### Setup API Key (Recommended)

Export your OpenAI API key as an environment variable:

```bash
export VIBE_PP_API_KEY="your-openai-api-key-here"
```

Then use the library without hardcoding your API key:

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

### Alternative: Hardcoded API Key (Not Recommended)

```javascript
import { vibePPrint } from 'vibe-pretty-print';

// Only use this approach for quick testing
const formatted = await vibePPrint(
  '{"test": "data"}', 
  'json',
  'your-openai-api-key'
);
```

## API Reference

### `vibePPrint(text, formatType, apiKey?)`

**Parameters:**
- `text` (string): The content to format (JSON, XML, YAML, or plain text)
- `formatType` (string): Type of content - `"json"`, `"xml"`, `"yaml"`, or `"text"` (default: `"text"`)
- `apiKey` (string, optional): Your OpenAI API key. If not provided, will use `VIBE_PP_API_KEY` environment variable.

**Returns:**
- `Promise<string>`: Pretty-printed/formatted string

**Throws:**
- `ValidationError`: If the input format is invalid
- `OpenAIError`: If OpenAI API calls fail
- `Error`: If inputs are invalid

## Requirements

- Node.js 14+
- OpenAI API key

## License

MIT License - see LICENSE file for details.