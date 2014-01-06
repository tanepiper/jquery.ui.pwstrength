# CHANGELOG

## 1.0.2

- Bugfix in UI initialization.
- Fix typo in readme.

## 1.0.1

- Separate source file in several smaller files.
- Add Grunt support for creating a bundle and a minified version.
- Add tests for the rules engine, and continuos integration with Travis.

## 1.0.0

- Complete refactor of the code. This is a cleaner version, easier to extend
  and mantain.
- Broke backwards compatibility. Bootstrap 3 is the default option now, other
  options default values have changed. Options structure has changed too.
- Old tests have been renamed to examples, which is what they really are. Leave
  room for real tests.

## 0.7.0

- New rule to check for sequences in the password. It penalizes finding
  sequences of consecutive numbers, consecutive characters in the alphabet or
  in the qwerty layout. Active by default.

## 0.6.0

- New feature: support showing the verdicts and errors in a Bootstrap popover.
- Hide the verdicts and errors when the input is empty.
- Remove _showVerdictsInitially_ option, is not needed anymore.

## 0.5.0

- Support to activate/deactivate rules using the _rules_ object inside the
  _options_ object.
- Two new rules added, deactivated by default. Check for too many character
  repetitions, and check for number of character classes used.

## 0.4.5

- Fix error message when the password contains the username.
- Check if the password is an email, and mark as weak.
- Add a _container_ option, it will be used to look for the viewports.

## 0.4.4

- Bad version in plugin manifest.

## 0.4.3

- Change jQuery plugin name to avoid conflict with an existing one.

## 0.4.2

- New option to choose if the verdicts should be displayed before the user
  introduces a letter. New default behaviour: don't show them.
- Bugfix with progress bar color and Bootstrap 2.
- Improve code quality.

## 0.4.1

- jQuery plugins registry support.

## 0.4.0

- Bootstrap 3.0.0 support.
