# react-components

Botify ReactJS Components.

## Commands

The gulp cli can be accessed via `npm run gulp` or simply `gulp` if you have installed gulp globally (`npm install -g gulp`). For instance, `gulp release` is equivalent to `npm run gulp -- release`.

* `release [options]`: builds optimized bundle, bumps the version and releases to github. Options:
  * `--type <major|minor|patch|prerelease>` (defaults to `patch`)
  * `--version <v>`
  * see [stevelacy/gulp-bump](https://github.com/stevelacy/gulp-bump) for more

* `deps-tree`: builds bundle and prints dependency tree

* `stats`: builds bundle and writes webpack stats to `stats.json`

* `lint`: lints source files and tests (`lint-sources`, `lint-tests`)

## Scripts

* `bootstrap`: installs dependencies required to build and test the project.

* `check`: lints the source with ESLint.

* `build`: compiles the library into a single file

* `test [options]`: runs tests. Options:
  * `--watch` watches test files and rebuilds + rerun tests on change
  * `--chrome` runs tests in Chrome, default browser is PhantomJS
  * `--extension <path>` loads the Chromium extension at the given path (with `--chrome`)

* `release [type]`: builds optimized bundle, bumps the version and releases to github. Type can be one of `major, minor, patch, prerelease`, defaults to `patch`.

