# Contributing to @gstj/safe-jsx

🎉 First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to @gstj/safe-jsx. These are just guidelines, not rules, use your best judgment and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [gstj@github.com](mailto:gstj@github.com).

## How Can I Contribute?

### Reporting Bugs

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/gstj/safe-jsx/issues).

- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/gstj/safe-jsx/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

If you find yourself wishing for a feature that doesn't exist in @gstj/safe-jsx, you are probably not alone. There are bound to be others out there with similar needs. Many of the features that @gstj/safe-jsx has today have been added because our users saw the need.

Open an issue on our issues list on GitHub which describes the feature you would like to see, why you need it, and how it should work.

### Pull Requests

- Fork the repo and create your branch from `master`.
- If you've added code that should be tested, add tests.
- Ensure the test suite passes.
- Make sure your code lints.

## Commit Message Guidelines

We have very precise rules over how our Git commit messages must be formatted. This format leads to **easier to read commit history**.

- Wrap message lines to about 72 characters or so.
- Each commit message consists of a **header**, a **body**, and a **footer**.
- The header is mandatory and must conform to the [Commit Message Header](#commit-message-header) format.
- The body is mandatory for all commits except for those of type "docs". When the body is required it must be at least 20 characters long.
- The footer is optional.

`<type>(<scope>): <short summary>`

### Commit Message Header

The commit message header is a single line that summarizing the change. It should be no longer than 50 characters to make sure it's shown in GitHub.

`<type>(<scope>): <short summary>`

#### `<type>`

This describes the kind of change that this commit is providing.

- **feat** (new feature for the user, not a new feature for build script)
- **fix** (bug fix for the user, not a fix to a build script)
- **docs** (changes to the documentation)
- **style** (formatting, missing semi colons, etc; no production code change)
- **refactor** (refactoring production code, eg. renaming a variable)
- **test** (adding missing tests, refactoring tests; no production code change)
- **chore** (updating grunt tasks etc; no production code change)

#### `<scope>`

The scope could be anything specifying the place of the commit change.

For example `$location`, `$browser`, `$compile`,`<config>`, `*` etc.

The `<scope>` can be empty (e.g. `revert: fix:  'alert()'`) when the change is global or does not relate to a single component.

#### `<short summary>`

The `<short summary>` is very important as it is the title of the commit message. As the name suggests, it should be a short summary about the improvements made in the commit. 

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Commit Message Body

Just as in the `<short summary>`, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

### Commit Message Footer

The footer is the place to reference any issues or pull requests related to this commit.

For example:

`Closes #204`

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of other developer, or if you do not have permission to do that, you may request the reviewer to merge it for you.

Thank you for considering contributing to @gstj/safe-jsx!
