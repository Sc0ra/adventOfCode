module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    curly: ['error', 'all'],
    eqeqeq: ['error', 'smart'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-shadow': [
      'error',
      {
        hoist: 'all',
      },
    ],
    'prefer-const': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],
    complexity: ['error', 8],
    'max-lines': ['error', 200],
    'max-depth': ['error', 3],
    'max-params': ['error', 3],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@canopia/backend-advisor-service*',
              '@canopia/backend-client-service*',
              '@canopia/backend-search-service*',
              '@canopia/backend-user-service*',
              '@canopia/backend-core-service*',
              '@canopia/backend-realtime-service*',
              '@canopia/backend-signature-service*',
              '@canopia/backend-contract-service*',
              '@canopia/backend-suravenir-service*',
              '@canopia/backend-fp-finance-service*',
              '@canopia/frontend-cloudfront*',
              '@canopia/frontend-cloudfront-certificate*',
            ],
            message: 'This is a service which must not be imported. Use its SDK instead',
          },
          {
            group: ['src/*'],
            message: 'VSCode injected it so you have to make a relative import instead',
          },
          {
            group: ['./index', '../index', '../../index'],
            message:
              "Don't import from index it creates circular dependencies. Import directly from the file that declare and export the variable",
          },
        ],
        paths: [
          {
            name: 'lodash',
            message: 'Please use lodash/{module} import instead',
          },
          {
            name: 'aws-sdk',
            message: 'Please use aws-sdk/{module} import instead',
          },
        ],
      },
    ],
  },
  root: true,
  plugins: ['import'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: { ecmaVersion: 2021 },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
      },
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/no-unnecessary-type-arguments': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_$', varsIgnorePattern: '^_$' },
        ],
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': 'allow-with-description',
            minimumDescriptionLength: 10,
          },
        ],
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              FC: 'Use `const MyComponent = (props: Props): JSX.Element` instead',
              SFC: 'Use `const MyComponent = (props: Props): JSX.Element` instead',
              FunctionComponent: 'Use `const MyComponent = (props: Props): JSX.Element` instead',
              'React.FC': 'Use `const MyComponent = (props: Props): JSX.Element` instead',
              'React.SFC': 'Use `const MyComponent = (props: Props): JSX.Element` instead',
              'React.FunctionComponent':
                'Use `const MyComponent = (props: Props): JSX.Element` instead',
            },
            extendDefaults: true,
          },
        ],
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: false,
          },
        ],
      },
    },
    {
      files: ['**/*.test.ts?(x)', '**/*.spec.ts?(x)'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
      },
    },
  ],
};
