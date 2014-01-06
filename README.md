# jQuery Password Strength Meter for Twitter Bootstrap

[![Build Status](https://travis-ci.org/ablanco/jquery.pwstrength.bootstrap.png?branch=master)](https://travis-ci.org/ablanco/jquery.pwstrength.bootstrap) [![Code Climate](https://codeclimate.com/github/ablanco/jquery.pwstrength.bootstrap.png)](https://codeclimate.com/github/ablanco/jquery.pwstrength.bootstrap)

The jQuery Password Strength Meter is a plugin for Twitter Bootstrap that
provides rulesets for visualy displaying the quality of a users typed in
password.

Dual licensed under the MIT and GPL licenses.

[jQuery plugins registry entry](http://plugins.jquery.com/pwstrength-bootstrap/)


## Requirements

* jQuery 1.7 or higher
* Bootstrap 2 or 3


## Options

The plugin expect the options to follow this structure:

```javascript
options = {
    common: {},
    rules: {},
    ui: {}
};
```

Let's see the options of each section.

### Common

* __minChar__:

  Default: `6` (Integer)

  Sets the minimum required of characters for a password to not be considered
  too weak.

* __usernameField__:

  Default: `"#username"` (String)

  The username field to match a password to, to ensure the user does not use
  the same value for their password.

* __onLoad__:

  Default: `undefined` (Function)

  A callback function, fired on load of the widget. No arguments will be
  passed.

* __onKeyUp__:

  Default: `undefined` (Function)

  A callback function, fired on key up when the user is typing. The `keyup`
  event will be passed as an argument.

### Rules

* __extra__:

  Default: `{}` (Object)

  Empty object where custom rules functions will be stored.

* __scores__:

  Default: (Object)

  ```
  {
    wordNotEmail: -100,
    wordLength: -50,
    wordSimilarToUsername: -100,
    wordSequences: -50,
    wordTwoCharacterClasses: 2,
    wordRepetitions: -25,
    wordLowercase: 1,
    wordUppercase: 3,
    wordOneNumber: 3,
    wordThreeNumbers: 5,
    wordOneSpecialChar: 3,
    wordTwoSpecialChar: 5,
    wordUpperLowerCombo: 2,
    wordLetterNumberCombo: 2,
    wordLetterNumberCharCombo: 2
  }
  ```

  Scores returned by the rules when they match. Negative values are for
  penalizations.

* __activated__:

  Default: (Object)

  ```
  {
    wordNotEmail: true,
    wordLength: true,
    wordSimilarToUsername: true,
    wordSequences: true,
    wordTwoCharacterClasses: false,
    wordRepetitions: false,
    wordLowercase: true,
    wordUppercase: true,
    wordOneNumber: true,
    wordThreeNumbers: true,
    wordOneSpecialChar: true,
    wordTwoSpecialChar: true,
    wordUpperLowerCombo: true,
    wordLetterNumberCombo: true,
    wordLetterNumberCharCombo: true
  }
  ```
  An object that sets wich validation rules are activated. By changing this
  object is possible to deactivate some validations, or to activate them for
  extra security.

* __raisePower__:

  Default: `1.4` (Double)

  The value used to modify the final score, based on the password length,
  allows you to tailor your results.

### User Interface

* __bootstrap2__:

  Default: `false` (Boolean)

  Sets if it supports legacy Bootstrap 2 (true) or the current Bootstrap 3
  (false), the progress bar html is different.

* __showPopover__:

  Default: `false` (Boolean)

  Displays the error messages in a Bootstrap popover, instead of below the
  input field. Bootstrap tooltip.js and popover.js must to be included.

* __spanError__:

  Default: (Function)

  ```javascript
  function (options, key) {
    var text = options.ui.errorMessages[key];
    return '<span style="color: #d52929">' + text + '</span>';
  };
  ```

  Function to generate a span with the style property set to red font color,
  used in the errors messages. Overwrite for custom styling.

* __errorMessages__:

  Default: (Object)

  ```
  {
    password_too_short: "The Password is too short",
    email_as_password: "Do not use your email as your password",
    same_as_username: "Your password cannot contain your username",
    two_character_classes: "Use different character classes",
    repeated_character: "Too many repetitions",
    sequence_found: "Your password contains sequences"
  }
  ```

  An object containing error messages. These can be overwritten for language
  purposes, and extra messages can also be added for your custom rules.

* __verdicts__:

  Default: `["Weak", "Normal", "Medium", "Strong", "Very Strong"]` (Array)

  The display names for the verdicts related to the progressClass.

* __showVerdicts__:

  Default: `true` (Boolean)

  Determines if the verdicts are displayed with the progress bar or not.

* __showErrors__:

  Default: `false` (Boolean)

  Determines if the error list is displayed with the progress bar or not.

* __container__:

  Default: `undefined` (CSS selector, or DOM node)

  If defined, it will be used to locate the viewports, if undefined, the parent
  of the input password will be used instead. The viewports must be children of
  this node.

* __viewports__:

  Default: (Object)

  ```
  {
    progress: undefined,
    verdict: undefined,
    errors: undefined
  }
  ```

  An object containing the viewports to use to show the elements of the
  strength meter. Each one can be a CSS selector (`"#progressbar"`) or a DOM
  node reference.

* __scores__:

  Default: `[17, 26, 40, 50]` (Array)

  The scores used to determine what progressClass and verdicts to display.

#### Example of an options object

```javascript
var options = {};
options.common = {
    minChar: 8;
};
options.rules = {
    activated: {
        wordTwoCharacterClasses: true,
        wordRepetitions: true
    }
};
options.ui = {
    showErrors: true
};
```


## Adding Custom Rules

The plugin comes with the functionality to easily define your own custom rules.
The format is as follows:

```javascript
$("#passwdfield").pwstrength("addRule", "ruleName", function (options, word, score) {}, rule_score, rule_enabled);
```

Example:

```javascript
$("#passwdfield").pwstrength("addRule", "testRule", function (options, word, score) {
    return word.match(/[a-z].[0-9]/) && score;
}, 10, true);
```


## Callback Functions

The plugin provides two callback functions, onLoad and onKeyUp.  You can use
them like this:

```javascript
$(document).ready(function () {
    var options = {};
    options.common = {
        onLoad: function () {
            $('#messages').text('Start typing password');
        },
        onKeyUp: function (evt) {
            $("#length-help-text").text("Current length: " + $(evt.target).val().length);
        }
    };
    $(':password').pwstrength(options);
});
```


## Extra security

The plugin comes with two validation rules deactivated by default. One checks
for too many character repetitions, and the other checks the number of
character classes used. An easy way to increase the security of the passwords
is to activate this two rules:

```javascript
$(document).ready(function () {
    var options = {};
    options.rules = {
        activated: {
            wordTwoCharacterClasses: true,
            wordRepetitions: true
        }
    };
    $(':password').pwstrength(options);
});
```


## Examples

There are some examples in the `examples` directory. Just serve them with any
webserver and check them in your browser. Make sure you serve the `examples`
directory as the site root. For example:

```bash
cd examples
python -m SimpleHTTPServer
```

And go to [localhost:8000](http://localhost:8000).


## Build and Test

The build and testing processes rely on [Grunt](http://gruntjs.com/). To use
them you need to have [node.js](http://nodejs.org/) and grunt-cli installed on
your system. Assuming you have node.js in your Linux system, you'll need to do
something like this:

```bash
sudo npm install -g grunt-cli
```

Now you have the grunt command line utility installed globally.


### Bundle and minified

To generate the bundle and the minified file you only need to execute this in
the project directory:

```bash
npm install -d
grunt
```

It will check the source files, and build a minified version with its
corresponding source map. The generated files will be available in the `dist`
directory.


### Testing

To run the tests the only thing you need to do is execute this in the project
directory:

```bash
npm install -d
grunt test
```

It will check all the source files with [JSLint](http://jslint.com) and run the
tests, which are written with [Jasmine](http://jasmine.github.io/). You'll find
the tests source code in the `spec` directory.

[Travis](https://travis-ci.org/ablanco/jquery.pwstrength.bootstrap) is being
used for continuos integration. You can check there if the tests are passing.
