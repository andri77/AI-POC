import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

/**
 * @description API JSON Validation
 */

test.describe('JSON Tests', () => {
  // Initialise AJV
  const ajv = new Ajv();

  /**
   * @description Validate Beers JSON
   */
  test('Schema Test', async ({ request }) => {
	// Load the beer JSON URL
    const response = await (await request.get('https://alehouse.rocks/api/beers.json')).json();

	// Validate the response against the schema file
    const valid = ajv.validate(require("./schema.json"), response);

	// Output the errors text
    if (!valid) {
      console.error('AJV Validation Errors:', ajv.errorsText());
    }

	// If the JSON is valid, the variable is "true"
    expect(valid).toBe(true);
  });
});