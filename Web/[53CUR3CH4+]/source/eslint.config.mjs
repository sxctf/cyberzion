import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactJSXRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    reactRecommended,
    reactJSXRuntime,
    eslintConfigPrettier,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
            parser: tseslint.parser
        },
        settings: { react: { version: 'detect' } },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true }],
            '@typescript-eslint/no-var-requires': 'off',
            'no-unused-vars': 'off',
            'react/prop-types': 'off',
            'semi': ['error', 'always']
        }
    },
    {
        ignores: ['build/*', 'node_modules/*']
    }
);
