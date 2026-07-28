// conventionalcommits preset, retuned so the changelog lists what actually
// ships.
//
// The stock preset renders feat, fix, perf and reverts, and hides everything
// else. That is wrong for this package. 1.3.1 shipped a rebuilt `lib/` and a
// smaller tarball off `build:` and `refactor:` commits, and the stock preset
// reduced the whole release to one `fix(release):` line about the changelog
// script — the one change in it a consumer could not observe.
//
// So the split here is by whether a type can change the published artifact:
//
//   renders   feat fix perf revert   the stock set
//             build                  tsconfig, the files field, the emitted lib/
//             refactor               rewrites the emitted lib/
//             chore                  dependency and config moves land in lib/
//             docs                   README.md is inside the tarball
//
//   hidden    ci                     .github/ is outside the files field
//             style                  formatting source cannot move tsc's output
//             test                   src/**/*.test.* is excluded from the build
//
// `effect: "changelog"` is the important part: it renders the type without
// letting it drive the version bump, so a pile of `build:` commits still adds
// up to a patch. Only the `bump` types can raise that, exactly as before.
//
// Breaking changes are not configurable here and do not need to be. The preset's
// writer sets `discard = false` the moment a commit carries a note, so a
// `BREAKING CHANGE:` footer or a `!` renders its own section whatever type it
// hangs off, including the hidden ones. tools/changelog-check.mjs is the
// positive control for that.
import createPreset from "conventional-changelog-conventionalcommits";

/** @type {import("conventional-changelog-conventionalcommits").CommitType[]} */
export const TYPES = [
  { type: "feat", section: "Features", effect: "bump" },
  { type: "feature", section: "Features", effect: "bump" },
  { type: "fix", section: "Bug Fixes", effect: "bump" },
  { type: "perf", section: "Performance Improvements", effect: "bump" },
  { type: "revert", section: "Reverts", effect: "bump" },
  { type: "build", section: "Build System", effect: "changelog" },
  { type: "refactor", section: "Code Refactoring", effect: "changelog" },
  { type: "chore", section: "Chores", effect: "changelog" },
  { type: "docs", section: "Documentation", effect: "changelog" },
  { type: "ci", section: "Continuous Integration", effect: "hidden" },
  { type: "style", section: "Styles", effect: "hidden" },
  { type: "test", section: "Tests", effect: "hidden" },
];

export default createPreset({ types: TYPES });
