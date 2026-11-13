/**
 * Response schema of GET /health, as specified in Implementation Plan step 4.1
 * (`{ status: 'ok' }`). Schemas of versioned endpoints are taken from the
 * published openapi.json of the API.
 */
export const healthResponseSchema = {
  type: 'object',
  required: ['status'],
  properties: {
    status: { type: 'string', const: 'ok' },
  },
} as const;
