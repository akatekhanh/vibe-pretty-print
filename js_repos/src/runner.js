/**
 * Runner module - Main entry point and interface
 */
import { Context } from './ctx.js';
import { FormatRequest } from './model.js';
import { FormatUseCase } from './usecase.js';

export class VibePPrintRunner {
    constructor() {
        this.context = new Context();
        this.useCase = new FormatUseCase(this.context);
    }

    async run(text, formatType = 'text', apiKey = null) {
        const request = new FormatRequest(text, formatType, apiKey);
        const result = await this.useCase.execute(request);
        return result.content;
    }
}

export async function vibePPrint(text, formatType = 'text', apiKey = null) {
    /**
     * Format text using AI-enhanced or standard formatting
     * 
     * @param {string} text - Content to format (JSON, XML, YAML, or plain text)
     * @param {string} formatType - "json", "xml", "yaml", or "text"
     * @param {string} apiKey - OpenAI API key (optional, uses VIBE_PP_API_KEY env var)
     * 
     * @returns {Promise<string>} Formatted text string
     * 
     * @throws {ValidationError} If input validation fails
     * @throws {OpenAIError} If OpenAI API fails
     */
    const runner = new VibePPrintRunner();
    return await runner.run(text, formatType, apiKey);
}