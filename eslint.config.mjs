import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';
import boundaries from 'eslint-plugin-boundaries';

export default defineConfig(
  reactHooks.configs.flat.recommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ['.next/', 'node_modules/', '/build/'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', mode: 'folder' },
        { type: 'pages', pattern: 'src/(pages)/*', mode: 'folder' },
        { type: 'app-init', pattern: 'src/_app', mode: 'folder' },
        {
          type: 'widget',
          pattern: 'src/widgets/*',
          mode: 'folder',
          capture: ['slice'],
        },
        {
          type: 'feature',
          pattern: 'src/features/*',
          mode: 'folder',
          capture: ['slice'],
        },
        { type: 'shared', pattern: 'src/shared', mode: 'folder' },
      ],
    },
  },
  {
    rules: {
      'import/no-named-as-default': 'off',
      'import/namespace': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [
            {
              pattern: '@src/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@src/**/*.css',
              group: 'index',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
        },
      ],
      'no-extra-boolean-cast': 'off',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: { type: 'shared' },
              dependency: { source: '@src/app/icon.png' },
              allow: { to: { type: 'app' } },
            },
            {
              from: { type: 'app' },
              allow: { to: { type: ['pages', 'app-init', 'feature', 'shared'] } },
            },
            {
              from: { type: 'pages' },
              allow: { to: { type: ['widget', 'feature', 'shared'] } },
            },
            {
              from: { type: 'app-init' },
              allow: { to: { type: ['widget', 'feature', 'shared'] } },
            },
            {
              from: { type: 'widget' },
              allow: { to: { type: ['feature', 'shared'] } },
            },
            {
              from: { type: 'feature' },
              allow: { to: { type: 'shared' } },
            },
            {
              from: { type: 'shared' },
              allow: { to: { type: 'shared' } },
            },
          ],
        },
      ],
    },
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
);
