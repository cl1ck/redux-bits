module.exports = {
  root: true,
  extends: [
  	'airbnb',
  ],
  plugins: [
    'jest',
  ],
  parser: 'babel-eslint',
	env: {
      browser: true,
		  commonjs: true,
		  es6: true,
		  'jest/globals': true,
	},
	parserOptions: {
		ecmaVersion: 8,
	},
  rules: {
    'no-param-reassign': ['error', {
	    props: true,
	    ignorePropertyModificationsFor: [
	      'draft',
	     ],
    }],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
	},
	settings: {
	  'import/resolver': {
      node: {
        moduleDirectory: [
          'node_modules',
          'src',
        ],
      },
	  },
	},
	globals: {
	  'createMockStore': true,
	  'shallowWithStore': true,
	  'mountWithStore': true,
	}
};
