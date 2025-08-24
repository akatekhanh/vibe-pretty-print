import { test } from 'node:test';
import assert from 'node:assert';
import { vibePPrint } from '../src/runner.js';

test('vibePPrint with standard formatting', async () => {
    const jsonText = '{"name":"John","age":30,"city":"New York"}';
    const result = await vibePPrint(jsonText, 'json', ''); // Empty API key triggers fallback
    
    assert.strictEqual(typeof result, 'string');
    assert.ok(result.includes('"name"'));
    assert.ok(result.includes('"age"'));
    assert.ok(result.includes('"city"'));
});

test('vibePPrint with text formatting', async () => {
    const text = '  hello world  ';
    const result = await vibePPrint(text, 'text', '');
    
    assert.strictEqual(result, 'hello world');
});

test('vibePPrint validation error', async () => {
    await assert.rejects(async () => {
        await vibePPrint('invalid json', 'json', '');
    });
});