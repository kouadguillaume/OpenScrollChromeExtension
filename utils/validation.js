const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const path = require('path');
const fs = require('fs');

// Load the schema
const schemaPath = path.join(__dirname, '../schemas/JSONschema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Initialize AJV with strict mode
const ajv = new Ajv({
  allErrors: true,
  strict: true,
  strictSchema: true,
  strictNumbers: true,
  strictRequired: true,
  strictTypes: true,
  strictTuples: true,
});

// Add format validators
addFormats(ajv);

// Compile the schema
const validate = ajv.compile(schema);

/**
 * Validates conversation data against the schema
 * @param {Object} data - The conversation data to validate
 * @returns {Object} - { valid: boolean, errors: Array|null }
 */
function validateConversation(data) {
  const valid = validate(data);
  return {
    valid,
    errors: valid ? null : validate.errors,
  };
}

/**
 * Asserts that the conversation data is valid
 * @param {Object} data - The conversation data to validate
 * @throws {Error} If the data is invalid
 */
function assertValidConversation(data) {
  const { valid, errors } = validateConversation(data);
  if (!valid) {
    const errorMessages = errors.map(err => 
      `${err.instancePath || 'root'} ${err.message}`
    ).join('\n');
    throw new Error(`Invalid conversation data:\n${errorMessages}`);
  }
}

module.exports = {
  validateConversation,
  assertValidConversation,
  getSchema: () => schema,
};
