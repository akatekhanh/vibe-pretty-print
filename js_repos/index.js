import yaml from 'js-yaml';
import chalk from 'chalk';
import fetch from 'node-fetch';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class OpenAIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OpenAIError';
  }
}

function validateJSON(text) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    throw new ValidationError('Invalid JSON format');
  }
}

function validateXML(text) {
  // Basic XML validation
  const xmlRegex = /<[^>]+>/;
  if (!xmlRegex.test(text)) {
    throw new ValidationError('Invalid XML format');
  }
  return true;
}

function validateYAML(text) {
  try {
    yaml.load(text);
    return true;
  } catch {
    throw new ValidationError('Invalid YAML format');
  }
}

async function getFormattedTextOpenAI(text, formatType, apiKey) {
  const prompts = {
    json: 'Format this JSON for readability with proper indentation and sorting. Only return the formatted JSON, no explanations:',
    xml: 'Format this XML with proper indentation and structure. Only return the formatted XML, no explanations:',
    yaml: 'Format this YAML with consistent indentation and structure. Only return the formatted YAML, no explanations:',
    text: 'Format this text for better readability with proper spacing and structure. Only return the formatted text:'
  };

  const prompt = prompts[formatType] || prompts.text;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a formatting expert. Format the given content perfectly.' },
        { role: 'user', content: `${prompt}\n\n${text}` }
      ],
      max_tokens: 2000,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    throw new OpenAIError(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function getApiKey(apiKey) {
  return apiKey || process.env.VIBE_PP_API_KEY || '';
}

function formatWithFallback(text, formatType) {
  switch (formatType) {
    case 'json':
      try {
        return JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        return text;
      }
    case 'xml':
      return text; // Basic fallback
    case 'yaml':
      try {
        const parsed = yaml.load(text);
        return yaml.dump(parsed, { indent: 2 });
      } catch {
        return text;
      }
    case 'text':
    default:
      return text;
  }
}

function addColorFormatting(text, formatType) {
  switch (formatType) {
    case 'json':
      return text
        .replace(/"([^"]+)":/g, chalk.blue('"$1":'))
        .replace(/: (["']?[^,"\n\r]*["']?)/g, ': ' + chalk.green('$1'))
        .replace(/[{}\[\]]/g, chalk.yellow('$&'));
    case 'xml':
      return text
        .replace(/<\/?([^>]+)>/g, chalk.blue('<$1>'))
        .replace(/="([^"]+)"/g, '="' + chalk.green('$1') + '"');
    case 'yaml':
      return text
        .replace(/^([\s-]*)([^:]+):/gm, '$1' + chalk.blue('$2:'))
        .replace(/: (.+)/g, ': ' + chalk.green('$1'));
    default:
      return text;
  }
}

export async function vibePPrint(text, formatType = 'text', apiKey = null) {
  if (!text || typeof text !== 'string') {
    throw new ValidationError('Text must be a non-empty string');
  }

  const validFormats = ['json', 'xml', 'yaml', 'text'];
  if (!validFormats.includes(formatType)) {
    throw new ValidationError(`formatType must be one of: ${validFormats.join(', ')}`);
  }

  const finalApiKey = getApiKey(apiKey);

  // Validate format
  switch (formatType) {
    case 'json':
      validateJSON(text);
      break;
    case 'xml':
      validateXML(text);
      break;
    case 'yaml':
      validateYAML(text);
      break;
  }

  try {
    if (!finalApiKey) {
      throw new OpenAIError('API key required. Set VIBE_PP_API_KEY environment variable or pass apiKey parameter.');
    }

    const formatted = await getFormattedTextOpenAI(text, formatType, finalApiKey);
    return addColorFormatting(formatted, formatType);
  } catch (error) {
    if (error instanceof OpenAIError) {
      console.warn('Falling back to standard formatting:', error.message);
      return addColorFormatting(formatWithFallback(text, formatType), formatType);
    }
    throw error;
  }
}

// CommonJS compatibility
export default { vibePPrint };