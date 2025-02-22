import globals, { browser } from 'globals'
import pluginJs from '@eslint/js'
import config from 'eslint-config-prettier'
import plugin from 'eslint-plugin-prettier/recommended'

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: { globals: globals.browser },
        evn: {
            browser: true,
        },
    },
    pluginJs.configs.recommended,
    config,
    plugin,
]
