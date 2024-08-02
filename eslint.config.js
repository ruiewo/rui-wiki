import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['**/dist/**'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
];
