import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']},
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-x': reactX,
      'react-dom': reactDom,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactX.configs.recommended.rules,
      ...reactDom.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      camelcase: 'warn',
      'no-console': 'warn',
      'spaced-comment': ['error', 'always'],
    },
    ignores: ['src/vite-env.d.ts'],
  },
];
