# OpenScroll Conversation Schema

This directory contains the formal JSON Schema definition for OpenScroll conversation data. This schema is a critical component of the OpenScroll ecosystem and must be treated as a first-class citizen in the development process.

## Schema Versioning

- **Current Stable Version**: `1.2.0`
- **Status**: `Active Development`

## Versioning Policy

The schema follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality additions
- **PATCH** version for backward-compatible bug fixes

## Schema Update Workflow

### 1. Proposing Changes

1. Create a new branch: `git checkout -b schema/update-<version>`
2. Update the schema version in `JSONschema.json`
3. Document changes in `CHANGELOG.md`
4. Update any affected scrapers
5. Update tests to validate against the new schema

### 2. Review Process

All schema changes must be reviewed by at least two maintainers. Create a Pull Request with:

- Description of changes
- Impact analysis on existing data
- Migration plan if breaking changes are introduced
- Updates to documentation

### 3. Version Bumping

- **PATCH**: For bug fixes and clarifications
- **MINOR**: For backward-compatible additions
- **MAJOR**: For breaking changes (requires migration plan)

## Validation

All scrapers must validate their output against this schema. Use the provided validation utilities:

```javascript
const { validateConversation } = require('../../utils/validation');

// In your scraper
try {
  validateConversation(conversationData);
} catch (error) {
  console.error('Validation failed:', error.message);
  throw error;
}
```

## Testing

Run the schema validation tests:

```bash
npm test schemas
```

## Deprecation Policy

1. Deprecated fields will be marked with `deprecated: true`
2. Deprecated fields will be supported for at least 2 minor versions
3. Breaking changes require a MAJOR version bump

## Documentation Updates

Update the following when making schema changes:

1. This README
2. `CHANGELOG.md`
3. Any relevant scraper documentation
4. API documentation if applicable

## Related Files

- `JSONschema.json`: The schema definition
- `CHANGELOG.md`: Version history and changes
- `validation.js`: Validation utilities
- `migrations/`: Data migration scripts (if needed)
