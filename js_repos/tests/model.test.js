import { test } from 'node:test';
import assert from 'node:assert';
import { FormatRequest, FormatResult, ValidationError, OpenAIError } from '../src/model.js';

test('FormatRequest creation', () => {
    const request = new FormatRequest('test text', 'json', 'api-key');
    assert.strictEqual(request.text, 'test text');
    assert.strictEqual(request.formatType, 'json');
    assert.strictEqual(request.apiKey, 'api-key');
});

test('FormatRequest optional apiKey', () => {
    const request = new FormatRequest('test', 'yaml');
    assert.strictEqual(request.text, 'test');
    assert.strictEqual(request.formatType, 'yaml');
    assert.strictEqual(request.apiKey, null);
});

test('FormatResult creation with defaults', () => {
    const result = new FormatResult('formatted', 'json');
    assert.strictEqual(result.content, 'formatted');
    assert.strictEqual(result.formatType, 'json');
    assert.strictEqual(result.source, 'standard');
});

test('FormatResult with custom source', () => {
    const result = new FormatResult('formatted', 'xml', 'openai');
    assert.strictEqual(result.source, 'openai');
});

test('ValidationError', () => {
    assert.throws(() => {
        throw new ValidationError('test error');
    }, ValidationError);
});

test('OpenAIError', () => {
    assert.throws(() => {
        throw new OpenAIError('test error');
    }, OpenAIError);
});