# 🛡️ eslint-plugin-safe-jsx

`eslint-plugin-safe-jsx` is an ESLint plugin that enforces explicit boolean conversion before using the `&&` operator with JSX in React and React Native applications. This plugin ensures code reliability and helps prevent potential bugs that can break your app.

## 💡 Why Use eslint-plugin-safe-jsx?

Consider the following example:

```js
const myText = 0;
myText && <Text>{myText}</Text>;
```

In this scenario, the code breaks because 0 is rendered outside the text component. The issue becomes more critical when the variable value comes from a server or an external source. This ESLint rule helps prevent such scenarios from happening.

With eslint-plugin-safe-jsx, your code will alert you of such potential errors and can be auto-fixed by ESLint, like so:

```js
const myText = 0;
Boolean(myText) && <Text>{myText}</Text>;
```

For more examples, check out our [test cases](./src/rules/jsx-explicit-boolean.test.tsx).

## 🚀 Installation

You'll first need to install [ESLint](https://eslint.org/docs/latest/user-guide/getting-started):

```sh
# npm
npm install eslint --save-dev

# yarn
yarn add eslint --dev
```

Next, install `eslint-plugin-safe-jsx`:

```sh
# npm
npm install eslint-plugin-jsx-a11y --save-dev

# yarn
yarn add eslint-plugin-jsx-a11y --dev
```

**Note:** If you installed ESLint globally (using the `-g` flag in npm, or the `global` prefix in yarn) then you must also install `eslint-plugin-safe-jsx` globally.

## ⚙️ Usage

Add `safe-jsx` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["safe-jsx"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "safe-jsx/jsx-explicit-boolean": "error" // or "warn"
  }
}
```

## 📚 Supported Rules

- boolean-conversion: Enforces explicit boolean conversion before using the && operator with JSX.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change. Make sure to update tests as appropriate.

## 📃 License

[MIT](./LICENSE)
