module.exports = {
  rules: {
    'jsx-explicit-boolean': require('./rules/jsx-explicit-boolean'),
  },

  configs: {
    recommended: {
      plugins: ['@gstj'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        '@gstj/jsx-explicit-boolean': 'error',
      },
    },

    strict: {
      plugins: ['@gstj'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        '@gstj/jsx-explicit-boolean': 'error',
      },
    },
  },
};
