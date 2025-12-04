import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Prettier
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

const eslintConfig = defineConfig([
  // Configurações padrão do Next
  ...nextVitals,
  ...nextTs,

  // Prettier — Desabilita regras do ESLint que conflitam com o Prettier
  prettier,

  // Ativa o Prettier como uma regra do ESLint (opcional, mas recomendado)
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },

  // Override dos ignores padrão
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
