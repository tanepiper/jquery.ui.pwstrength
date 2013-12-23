# jQuery Password Strength Meter for Twitter Bootstrap

[![Code Climate](https://codeclimate.com/github/ablanco/jquery.pwstrength.bootstrap.png)](https://codeclimate.com/github/ablanco/jquery.pwstrength.bootstrap)

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

### User Interface



* __bootstrap3__:

  Default: `false` (Boolean)

  Sets if it supports Bootstrap 3 (true) or Bootstrap 2 (false), the progress
  bar html is different.

* __showPopover__:

  Default: `false` (Boolean)

  Displays the error messages in a Bootstrap popover, instead of below the
  input field. Bootstrap tooltip.js and popover.js need to be included.

* __verdicts__:

  Default: `["Weak", "Normal", "Medium", "Strong", "Very Strong"]` (Array)

  The display names for the verdicts related to the progressClass.

* __scores__:

  Default: `[17, 26, 40, 50]` (Array)

  The scores used to determine what progressClass and verdicts to display.

* __showVerdicts__:

  Default: `true` (Boolean)

  Determines if the verdicts are displayed on the progress bar or not.

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


* __raisePower__:

  Default: `1.4` (Double)

  The value used to modify the final score, allows you to tailor your results.



* __rules__:

  Default: (Object)

  ```
  {
      wordNotEmail: true,
      wordLength: true,
      wordSimilarToUsername: true,
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

  An object that sets wich validation rules are activated. Changing this object
  it is possible to deactivate some validations, or to activate them for
  extra security.

* __errorMessages__:

  Default: (Object)

  ```
  {
      password_too_short : "The Password is too short",
      same_as_username : "Your password cannot be the same as your username"
  }
  ```

  An object containing error messages.  These can be overwritten for language
  purposes, and can also be added to for your custom rules.


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
    var options = {
        onLoad: function () {
            $('#messages').text('Start typing password');
        },
        onKeyUp: function (evt) {
            $(evt.target).pwstrength("outputErrorList");
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
    var options = {
        rules: {
            wordTwoCharacterClasses: true,
            wordRepetitions: true
        }
    };
    $(':password').pwstrength(options);
});
```
