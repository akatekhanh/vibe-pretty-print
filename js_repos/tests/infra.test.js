import { test } from 'node:test';
import assert from 'node:assert';
import { FormatRequest, ValidationError } from '../src/model.js';
import { Validator, StandardFormatter } from '../src/infra.js';

test('Validator - valid json', () => {
    const validator = new Validator();
    const request = new FormatRequest('{"key": "value"}', 'json');
    assert.doesNotThrow(() => validator.validate(request));
});

test('Validator - invalid json', () => {
    const validator = new Validator();
    const request = new FormatRequest('{"invalid": json}', 'json');
    assert.throws(() => validator.validate(request), ValidationError);
});

test('Validator - valid yaml', () => {
    const validator = new Validator();
    const request = new FormatRequest('key: value\nlist:\n  - item1\n  - item2', 'yaml');
    assert.doesNotThrow(() => validator.validate(request));
});

test('Validator - invalid yaml', () => {
    const validator = new Validator();
    const request = new FormatRequest('invalid: yaml: syntax', 'yaml');
    assert.throws(() => validator.validate(request), ValidationError);
});

test('Validator - empty text', () => {
    const validator = new Validator();
    const request = new FormatRequest('', 'text');
    assert.throws(() => validator.validate(request), ValidationError);
});

test('Validator - invalid format type', () => {
    const validator = new Validator();
    const request = new FormatRequest('test', 'invalid');
    assert.throws(() => validator.validate(request), ValidationError);
});

test('StandardFormatter - format json', () => {
    const formatter = new StandardFormatter();
    const request = new FormatRequest('{"b":2,"a":1}', 'json');
    const result = formatter.format(request);
    
    assert.strictEqual(result.formatType, 'json');
    assert.strictEqual(result.source, 'standard');
    assert.ok(result.content.includes('"a"'));
    assert.ok(result.content.includes('"b"'));
});

test('StandardFormatter - format yaml', () => {
    const formatter = new StandardFormatter();
    const request = new FormatRequest('key: value\nlist:\n  - item1', 'yaml');
    const result = formatter.format(request);
    
    assert.strictEqual(result.formatType, 'yaml');
    assert.strictEqual(result.source, 'standard');
    assert.ok(result.content.includes('key: value'));
});

test('StandardFormatter - format text', () => {
    const formatter = new StandardFormatter();
    const request = new FormatRequest('  hello world  ', 'text');
    const result = formatter.format(request);
    
    assert.strictEqual(result.formatType, 'text');
    assert.strictEqual(result.source, 'standard');
    assert.strictEqual(result.content, 'hello world');
});