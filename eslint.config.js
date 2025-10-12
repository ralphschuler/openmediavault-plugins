export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'script',
            globals: {
                Ext: 'readonly',
                OMV: 'readonly',
                _: 'readonly',
                console: 'readonly',
                window: 'readonly',
                document: 'readonly'
            }
        },
        rules: {
            'indent': ['error', 4],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-unused-vars': ['warn'],
            'no-console': ['warn'],
            'no-debugger': ['warn']
        }
    }
];