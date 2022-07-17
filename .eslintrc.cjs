/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  env: {
    'vue/setup-compiler-macros': true
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        /*semi: false,
        trailingComma: 'none',*/
        endOfLine: 'auto'
      },
      'error',
      {
        allowEmptyCatch: true
      }
    ],
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: []
      }
    ]
    /*,
    'vue/no-multiple-template-root': 'off'*/
    /*"eslint.validate": [
      "javascript",
      "javascriptreact",
      "vue"
    ],*/
    /*"prettier/prettier": ["error", {"singleQuote": true, "parser": "flow"}]*/
  },
  lobals: {
    useVModel: true
  }
}
// module.exports = {
//   /* ... */
//   extends: [
//     // ...
//     './.eslintrc-auto-import.json',
//   ],
// }
