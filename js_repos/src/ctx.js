/**
 * Context module - Application configuration and context
 */
export class Context {
    constructor() {
        this.envApiKey = process.env.VIBE_PP_API_KEY || '';
        this.openaiUrl = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo';
        this.maxTokens = 2000;
        this.temperature = 0.1;
    }
}