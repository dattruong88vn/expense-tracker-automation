import { expect, test } from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { healthResponseSchema } from '../schemas/health.schema';
import { schemaErrors } from '../schemas/validate';

test.describe('API-13 health', () => {
  test('API-13 GET /health returns 200 with status ok', { tag: '@smoke' }, async ({ request }) => {
    const api = new ApiClient(request);

    const response = await api.health();

    expect(response.status()).toBe(200);
    const body: unknown = await response.json();
    expect(body).toMatchObject({ status: 'ok' });
    expect(schemaErrors(healthResponseSchema, body)).toEqual([]);
  });
});
