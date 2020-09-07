// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  $: true,
  jQuery: true,
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    'func-names': ["error", "as-needed"],
    // don't require .vue extension when importing
    'import/extensions': ['error', 'never', {
      js: 'never',
      vue: 'never'
    }],
    'max-len': ["error", { "code": 500 }],

    'no-console': 'off',
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': 0,
    "no-underscore-dangle": 0,
    "no-restricted-syntax": [0, "ForInStatement", "ForOfStatement"],
    "global-require": 0,
    "no-param-reassign": 0,
    "spaced-comment": 0,
    "no-tabs": 0,
    "func-names" : 0,
    "object-curly-newline": 0,
    'import/extensions': ['error', 'never', {
      js: 'never',
      vue: 'never'
    }],
    "import/no-unresolved": 0,
    "strict": 0,
    "no-undef": 0,
    "class-methods-use-this": 0,
    "camelcase": 0,
    "arrow-body-style": 0,
    "radix": 0,
    "prefer-destructuring": ["error", {"object": true, "array": false}],
    "no-await-in-loop": 0,
    "guard-for-in": 0
  }
}
