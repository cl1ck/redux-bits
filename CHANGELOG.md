# Changelog

## [Unreleased]

## [2.1.5] - 2018-04-16

### Added

- In addition to the function as a child container, `redux-bits` provides a `render prop Component` container.

## [2.0.5] - 2018-04-13

### Fixed

- Bits no longer must export a reducer for each action (makes sense in combination with several middlewares).

## [2.0.4] - 2018-04-10

### Fixed

- Action creators were not created correctly.
- Reducers were ignoring actions without payload.

## [1.0.2] - 2018-04-09

### Removed

- ES module export.

## [1.0.1] - 2018-04-06

### Changed

- Named selectors are now creating a prop based on the selector's name instead of directly exposing the selector's result.
