import Ajv, { type AnySchema } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Validates a response body against a JSON schema taken from the API's
 * openapi.json and returns a readable list of violations (empty when valid).
 */
export function schemaErrors(schema: AnySchema, body: unknown): string[] {
  const validate = ajv.compile(schema);
  if (validate(body)) return [];
  return (validate.errors ?? []).map((e) => `${e.instancePath || '(root)'} ${e.message ?? ''}`);
}
