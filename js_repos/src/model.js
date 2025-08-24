/**
 * Model module - Data models and domain entities
 */
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class OpenAIError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OpenAIError';
    }
}

export class FormatResult {
    constructor(content, formatType, source = 'standard') {
        this.content = content;
        this.formatType = formatType;
        this.source = source; // 'standard' or 'openai'
    }
}

export class FormatRequest {
    constructor(text, formatType, apiKey = null) {
        this.text = text;
        this.formatType = formatType;
        this.apiKey = apiKey;
    }
}