import globals from 'globals';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import ts from 'typescript-eslint';

export default ts.config(eslint.configs.recommended, ts.configs.strict, {
  files: ['**/*.{ts}'],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      projectService: true,
      project: './tsconfig.eslint.json',
    },
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    import: importPlugin,
  },
  rules: {
    '@typescript-eslint/no-empty-object-type': 'off',
    'import/exports-last': 'warn',
    'import/first': 'warn',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'type'],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
});
