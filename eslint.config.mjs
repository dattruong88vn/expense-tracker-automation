import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

/** Suite boundary: api-tests and ui-tests share only shared/. */
const forbid = (suite) => ({
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: [`**/${suite}/**`, `**/${suite}`],
          message: `The API and UI suites must not import from each other; move shared code to shared/.`,
        },
      ],
    },
  ],
});

export default tseslint.config(
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'blob-report/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['api-tests/**/*.ts', 'ui-tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/no-focused-test': 'error',
    },
  },
  { files: ['api-tests/**/*.ts'], rules: forbid('ui-tests') },
  { files: ['ui-tests/**/*.ts'], rules: forbid('api-tests') },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
);
