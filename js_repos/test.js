import { vibePPrint } from './index.js';

async function runTests() {
  console.log('🧪 Running vibe-pretty-print tests...\n');

  const tests = [
    {
      name: 'JSON formatting',
      text: '{"name":"John","age":30,"city":"New York"}',
      formatType: 'json'
    },
    {
      name: 'YAML formatting',
      text: 'name: John\nage: 30\ncity: New York',
      formatType: 'yaml'
    },
    {
      name: 'XML formatting',
      text: '<person><name>John</name><age>30</age></person>',
      formatType: 'xml'
    },
    {
      name: 'Text formatting',
      text: 'Hello World! This is a test.',
      formatType: 'text'
    }
  ];

  // Test fallback formatting (without OpenAI)
  console.log('Testing fallback formatting...\n');

  for (const test of tests) {
    try {
      const result = await vibePPrint(test.text, test.formatType, ''); // Empty API key triggers fallback
      console.log(`✅ ${test.name}`);
      console.log(`Input: ${test.text}`);
      console.log(`Output: ${result}\n`);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
  }

  // Test validation
  console.log('Testing validation...\n');

  try {
    await vibePPrint('invalid json', 'json');
    console.log('❌ Should have thrown validation error');
  } catch (error) {
    console.log('✅ JSON validation works:', error.message);
  }

  try {
    await vibePPrint('valid text', 'invalid');
    console.log('❌ Should have thrown format type error');
  } catch (error) {
    console.log('✅ Format type validation works:', error.message);
  }

  console.log('Tests completed! 🎉');
}

runTests().catch(console.error);