import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        ignorePatterns: ['node_modules/', 'dist/', 'db/', 'logs/', 'public/'],
    },
    { languageOptions: { globals: globals.browser } },
    {
        rules: {
            'no-var': 'error',
            'no-useless-call': 'error',
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
]
