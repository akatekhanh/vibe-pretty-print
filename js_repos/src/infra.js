/**
 * Infrastructure module - External services and implementations
 */
import yaml from 'js-yaml';
import { ValidationError, OpenAIError, FormatRequest, FormatResult } from './model.js';
import { Context } from './ctx.js';

export class Validator {
    validate(request) {
        if (!request.text || typeof request.text !== 'string') {
            throw new ValidationError('Text must be a non-empty string');
        }

        const validFormats = ['json', 'xml', 'yaml', 'text'];
        if (!validFormats.includes(request.formatType)) {
            throw new ValidationError(`formatType must be one of: ${validFormats.join(', ')}`);
        }

        // Format-specific validation
        this[`_validate${request.formatType.charAt(0).toUpperCase() + request.formatType.slice(1)}`](request.text);
    }

    _validateJson(text) {
        try {
            JSON.parse(text);
        } catch (error) {
            throw new ValidationError(`Invalid JSON: ${error.message}`);
        }
    }

    _validateXml(text) {
        // Basic XML validation
        const xmlRegex = /<(\/?[^>]+)>/;
        if (!xmlRegex.test(text)) {
            throw new ValidationError('Invalid XML format');
        }
    }

    _validateYaml(text) {
        try {
            yaml.load(text);
        } catch (error) {
            throw new ValidationError(`Invalid YAML: ${error.message}`);
        }
    }

    _validateText(text) {
        // Text has no validation
    }
}

export class StandardFormatter {
    format(request) {
        const method = this[`_format${request.formatType.charAt(0).toUpperCase() + request.formatType.slice(1)}`];
        const content = method.call(this, request.text);
        return new FormatResult(content, request.formatType, 'standard');
    }

    _formatJson(text) {
        return JSON.stringify(JSON.parse(text), null, 2);
    }

    _formatXml(text) {
        // Basic XML formatting
        return text.replace(/></g, '>\n<').trim();
    }

    _formatYaml(text) {
        const data = yaml.load(text);
        return yaml.dump(data, { indent: 2 });
    }

    _formatText(text) {
        return text.trim();
    }
}

export class OpenAIFormatter {
    constructor(context) {
        this.context = context;
    }

    async format(request, apiKey) {
        const prompt = this._buildPrompt(request.formatType);

        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };

        const payload = {
            model: this.context.model,
            messages: [
                { role: 'system', content: 'You are a formatting expert. Format the given content perfectly.' },
                { role: 'user', content: `${prompt}\n\n${request.text}` }
            ],
            max_tokens: this.context.maxTokens,
            temperature: this.context.temperature
        };

        try {
            const response = await fetch(this.context.openaiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new OpenAIError(`OpenAI API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.choices || !data.choices[0]) {
                throw new OpenAIError('No response choices from OpenAI');
            }

            const content = data.choices[0].message.content.trim();
            return new FormatResult(content, request.formatType, 'openai');
        } catch (error) {
            if (error instanceof OpenAIError) {
                throw error;
            }
            throw new OpenAIError(`Network error: ${error.message}`);
        }
    }

    _buildPrompt(formatType) {
        const prompts = {
            json: 'Format this JSON for readability with proper indentation and sorting. Only return the formatted JSON:',
            xml: 'Format this XML with proper indentation and structure. Only return the formatted XML:',
            yaml: 'Format this YAML with consistent indentation and structure. Only return the formatted YAML:',
            text: 'Format this text for better readability with proper spacing and structure. Only return the formatted text:'
        };
        return prompts[formatType] || prompts.text;
    }
}