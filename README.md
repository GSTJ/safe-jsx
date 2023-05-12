# 🛡️ eslint-plugin-safe-jsx

`eslint-plugin-safe-jsx` is an ESLint plugin that enforces explicit boolean conversion before using the && operator with JSX in React and React Native applications. This plugin improves the reliability of your code by helping prevent certain types of bugs that can break your app.

## 💡 Why Use eslint-plugin-safe-jsx?

In JavaScript, certain "falsy" values such as `0`, `''`, and `null` can lead to unexpected behavior when used in a logical expression. This can be particularly problematic in React JSX code, where you might be expecting a boolean value.

Consider the following example:

```jsx
const myText = 0;
myText && <Text>{myText}</Text>;
```

In this scenario, the code tries to render `0` outside the Text component, leading to a failure. The issue is even more critical when the variable value comes from a server or an external source. This ESLint rule helps prevent such scenarios from occurring.

With `eslint-plugin-safe-jsx`, ESLint will alert you to these potential errors and can even auto-fix them, like so:

```jsx
const myText = 0;
Boolean(myText) && <Text>{myText}</Text>;
```

Now, `myText` is explicitly converted to a boolean before being used in the logical expression, preventing the `0` from being rendered.

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
npm install eslint-plugin-safe-jsx --save-dev

# yarn
yarn add eslint-plugin-safe-jsx --dev
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

- `jsx-explicit-boolean`: Enforces explicit boolean conversion before using the && operator with JSX.

## 🤝 Contributing

We welcome your contributions! For major changes, please open an issue first to discuss what you would like to change. Don't forget to update tests as appropriate.

## 📃 License

[MIT](./LICENSE)
