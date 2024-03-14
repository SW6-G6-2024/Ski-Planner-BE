module.exports = {
    root: true,
    env: { node: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended'
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    settings: { react: { version: '18.2' } },
    plugins: ['react-refresh'],
    rules: {
        'react/jsx-no-target-blank': 'off',
        'react/jsx-uses-react': 'warn',
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'react/prop-types': 'warn',
        'react/no-children-prop': 'warn',
        'semi': 'error',
        'no-unused-vars': 'warn',
    },
    overrides: [{
        files: ['**/*.test.jsx', '**/*.test.js'],
        env: { jest: true, node: false },
        extends: ['plugin:jest/recommended'],
        plugins: ['jest'],
    }, ],
}