// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      // '@typescript-eslint/no-unsafe-argument': 'warn',
      // Desativa o aviso de atribuição insegura
      '@typescript-eslint/no-unsafe-assignment': 'off',
      // Desativa chamadas inseguras de valor tipado como 'unknown' ou 'any'
      '@typescript-eslint/no-unsafe-call': 'off',
      // Desativa acesso inseguro a membros de valor tipado como 'unknown' ou 'any'
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // Desativa retorno inseguro de valor tipado como 'unknown' ou 'any'
      '@typescript-eslint/no-unsafe-return': 'off',
      // Ajuste Prettier para permitir trailing commas em chamadas de função
      'prettier/prettier': ['error', { trailingComma: 'all' }],
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
);
