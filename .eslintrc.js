module.exports = {
	env: {
		browser: false,
		commonjs: true,
		es6: true,
		node: true,
		'jest/globals': true
	},
	parser: '@typescript-eslint/parser',
	extends: [ 'plugin:@typescript-eslint/recommended' ],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
  overrides: [{
    files: ["**/**.test.ts"],
    rules: {
      "@typescript-eslint/no-empty-function": 'off'
    }
  }],
	ignorePatterns: [ 'experiment', 'dist' ],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	plugins: [ 'jest', '@typescript-eslint' ],
	rules: {
		'no-mixed-spaces-and-tabs': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-extra-semi': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
    "@typescript-eslint/no-non-null-assertion": "off"
	}
};
