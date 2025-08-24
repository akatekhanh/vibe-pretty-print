/**
 * Use case module - Core business logic
 */
import { ValidationError, OpenAIError, FormatRequest } from './model.js';
import { Validator, StandardFormatter, OpenAIFormatter } from './infra.js';

export class FormatUseCase {
    constructor(context) {
        this.context = context;
        this.validator = new Validator();
        this.formatter = new StandardFormatter();
        this.openaiFormatter = new OpenAIFormatter(context);
    }

    async execute(request) {
        // Validate input
        this.validator.validate(request);

        // Get API key
        const apiKey = request.apiKey || this.context.envApiKey;

        // Try OpenAI if API key available
        if (apiKey) {
            try {
                return await this.openaiFormatter.format(request, apiKey);
            } catch (error) {
                // Fallback to standard formatting
                console.warn(`⚠️  OpenAI failed, using fallback: ${error.message}`);
            }
        }

        // Standard formatting
        return this.formatter.format(request);
    }
}