# Changelog

Generated from conventional commit messages. Breaking changes are collected
under their own heading, from either a `!` after the type or a
`BREAKING CHANGE:` footer.

## [1.3.1](https://github.com/GSTJ/safe-jsx/compare/v1.3.0...v1.3.1) (2026-07-28)

### Bug Fixes

* **release:** stop running oxfmt over the generated CHANGELOG ([0abd1fe](https://github.com/GSTJ/safe-jsx/commit/0abd1fe55f6e883e09a8474dc5eb99d37e086c84))

## [1.3.0](https://github.com/GSTJ/safe-jsx/compare/v1.2.0...v1.3.0) (2026-07-27)

### Bug Fixes

* **changelog:** generate from conventional commits and backfill the history ([#37](https://github.com/GSTJ/safe-jsx/issues/37)) ([7d15caf](https://github.com/GSTJ/safe-jsx/commit/7d15cafc495d0867820a3c0a6548b0016c868b06))
* **jsx-explicit-boolean:** five soundness bugs in the boolean check ([#36](https://github.com/GSTJ/safe-jsx/issues/36)) ([7f0ba25](https://github.com/GSTJ/safe-jsx/commit/7f0ba25a535d2c74f2ef8331cdd1511df2c0647c))

## [1.2.0](https://github.com/GSTJ/safe-jsx/compare/v1.1.0...v1.2.0) (2026-07-25)

## [1.1.0](https://github.com/GSTJ/safe-jsx/compare/v1.0.5...v1.1.0) (2023-05-13)

### Features

* don't give false positives when dealing with BinaryExpressions on an && operator ([a19fe02](https://github.com/GSTJ/safe-jsx/commit/a19fe027ae81e4e78c1fd8fa644490261a85c91b))
* make it faster, more reliable and mantainable by refactoring and removing code duplication ([3f4eefd](https://github.com/GSTJ/safe-jsx/commit/3f4eefdb56cb2e2faf7674aa096e51e6e124f678))
* purge false-positives ([104d3ab](https://github.com/GSTJ/safe-jsx/commit/104d3ab1a98a320009944f4d5adf634e65908f74))
* purge more tiny edge-cases and add tests to ensure they don't break ([d091787](https://github.com/GSTJ/safe-jsx/commit/d091787937ab2a4f1ee60ce3eda5d6e010654bfd))

### Bug Fixes

* add recursiviness to checkBooleanValidity to account for more than two variables ([d35a9a9](https://github.com/GSTJ/safe-jsx/commit/d35a9a93f5f0ab6326f173260386d73733810b59))
* understand single negation ! boolean conversion ([c991668](https://github.com/GSTJ/safe-jsx/commit/c991668fe8a20fa7aeade4563bc9a8df11ea17de))
* use module.exports to fix eslint plugin usage ([0d879e9](https://github.com/GSTJ/safe-jsx/commit/0d879e9827391b124b4ce4d221aa37abf6b323e8))

## [1.0.5](https://github.com/GSTJ/safe-jsx/compare/v1.0.3...v1.0.5) (2023-05-12)

### Features

* support new boolean constructor, support !! operator as a valid boolean conversion ([06dfa64](https://github.com/GSTJ/safe-jsx/commit/06dfa649cdf8d44118ea5cde1d0f83d6faed253e))

## [1.0.3](https://github.com/GSTJ/safe-jsx/compare/v1.0.1...v1.0.3) (2023-05-12)

### Features

* make it faster with early returns ⚡️ ([d86a810](https://github.com/GSTJ/safe-jsx/commit/d86a81054d8974970358b29113658a577a7d5725))

## [1.0.1](https://github.com/GSTJ/safe-jsx/compare/b63886caa8a02664177a6c0e71181e1300f6c5be...v1.0.1) (2023-05-12)

### Bug Fixes

* make it usable ([b63886c](https://github.com/GSTJ/safe-jsx/commit/b63886caa8a02664177a6c0e71181e1300f6c5be))
