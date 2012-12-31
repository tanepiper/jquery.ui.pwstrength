================================
jQueryUI Password Strength Meter
================================

The jQuery UI Password Strength Meter is a widget for jQueryUI that provides
rulesets for visualy displaying the quality of a users typed in password.

The widget requires jQueryUI 1.8 core and progress meter.


Options
=======

* minChar:
  Default: 8 (Integer)
  Sets the minimum required of characters for a password to not be considered
  too weak

* progressClass:
  Default: ['zero', 'twenty-five', 'fifty', 'seventy-five', 'one-hundred'] (Array)
  The names of the classes that are added to the visual display bar, used to
  provide CSS overide for display

* verdicts:
  Default: ["Weak", "Normal", "Medium", "Strong", "Very Strong"] (Array)
  The display names for the verdicts related to the progressClass

* scores:
  Default: [17, 26, 40, 50] (Array)
  The scores used to determine what progressClass and verdicts to display

* showVerdicts:
  Default: true (Boolean)
  Determines if the verdicts are display on the progress bar or not

* usernameField:
  Default: "#username" (String)
  The username field to match a password to, to ensure the user does not use
  the same value for their password

* raisePower:
  Default: 1.4 (Double)
  The value used to modify the final score, allows you to tailor your results

* onLoad:
  Default: undefined (Function)
  A callback function, fired on load of the widget

* onKeyUp:
  Default: undefined (Function)
  A callback function, fired on key up when the user is typing

* errorMessages:
  Default: {
        password_to_short : "The Password is too short",
        same_as_username : "Your password cannot be the same as your username"
  } (Object)
  An object containing error messages.  These can be overwritten for language
  purposes, and can also be added to for your custom rules.


Adding Custom Rules
===================

The widget comes with the functionality to easily define your own custom rules.
The format is as follows:

    $.ui.pwstrength.addRule("ruleName", function (ui, word, score) {}, rule_score, rule_enabled);

Example:

    $.ui.pwstrength.addRule("testRule", function (ui, word, score) {
        return word.match(/[a-z].[0-9]/) && score;
    }, 10, true);


Callback Functions
==================

The widget provides two callback functions, onLoad and onKeyUp.  You can use them like this:

    $(document).ready(function () {
        var options = {
            onLoad: function () {
                $('#messages').text('Start typing password');
            },
            onKeyUp: function () {
                $('#messages').html($.ui.pwstrength.outputErrorList());
            }
        };
        $(':password').pwstrength(options);
    });
