module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'max-len': 0,
    camelcase: 0, // 变量可以用下划线
    'no-plusplus': 0, // 禁止使用++，--
    'guard-for-in': 0,
    'no-extra-semi': 0, // 和prettier冲突
    'import/extensions': 0, // import不需要写文件扩展名
    'import/no-unresolved': 0,
    'no-underscore-dangle': 0, // 无下划线
    'no-restricted-syntax': 0,
    'consistent-return': 'off',
    semi: ['error', 'never'],
    'no-prototype-builtins': 'off',
    'class-methods-use-this': 'off',
    'template-curly-spacing': 'off',
    'linebreak-style': [0, 'error', 'windows'],
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'only-multiline'],
    'no-param-reassign': ['error', { props: false }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['script/**/*.js'] }],
    "no-trailing-spaces": 0, // 忽略语句后面出现的空格
    'space-before-function-paren': 0, // 忽略空格
    "vue/multi-word-component-names": ["error", {
      "ignores": ['login', 'home', 'user']
    }],
    indent: [
      'off',
      {
        ignoredNodes: ['TemplateLiteral'],
        SwitchCase: 1,
      }
    ],
    'object-curly-newline': [
      'error',
      {
        ImportDeclaration: 'never',
      }
    ]
  }
}
