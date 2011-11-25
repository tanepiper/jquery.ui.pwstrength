jQueryUI Password Strength Meter
================================

This widget provides a jQueryUI elements for handling password fields and monitoring the contents to provide feedback on the strength of the password.

The widget uses the jQuery 1.8 progress meter to provide visual feedback, which attaches to a password field.

The widget is set up with various rules with scores that control the display of the progress meter.  Within the functionality of the widget you can provide your own rules easily (see below).

Requirements
------------

* jQuery >= 1.6
* jQueryUI >= 1.8 + progress meter

Options
-------

    minchar:
      Default: 8 (Integer)
      Sets the minimum required of characters for a password to not be considered too weak

    progressClass:
      Default: ['zero', 'twenty-five', 'fifty', 'seventy-five', 'one-hundred'] (Array)
      The names of the classes that are added to the visual display bar, used to provide CSS overide for display

    verdicts:
      Default: ["Weak", "Normal", "Medium", "Strong", "Very Strong"] (Array)
      The display names for the verdicts related to the progressClass

    scores:
      Default: [17, 26, 40, 50] (Array)
      The scores used to determine what progressClass and verdicts to display

    showverdicts:
      Default: true (Boolean)
      Determines if the verdicts are display on the progress bar or not

    usernamefield:
      Default: "#username" (String)
      The username field to match a password to, to ensure the user does not use the same value for their password

    raisepower:
      Default: 1.4 (Double)
      The value used to modify the final score, allows you to tailor your results

    onLoad:
      Default: undefined (Function)
      A callback function, fired on load of the widget

    onKeyUp:
      Default: undefined (Function)
      A callback function, fired on key up when the user is typing

    errorMessages:
      Default: {
            password_to_short : "The Password is too short",
            same_as_username : "Your password cannot be the same as your username"
      } (Object)
      An object containing error messages.  These can be overwritten for language purposes, and can also be added to for your custom rules.


Adding Custom Rules
-------------------

The widget comes with the functionality to easily define your own custom rules.

The format is as follows:

    $.ui.pwstrength.addRule("ruleName", function(ui, word, score) {}, rule_score, rule_enabled);

Example:

    $.ui.pwstrength.addRule("testRule", function(ui, word, score) {
      // Return is a guard so if true the score will be returned
      return word.match(/[a-z].[0-9]/) && score;
    }, 10, true);


Callback Functions
------------------

The widget provides two callback functions, onLoad and onKeyUp.  You can use them like this:

    $(document).ready(function(){
      var options = {
        onLoad: function() {
          $('#messages').text('Start typing password');
        },
        onKeyUp: function() {
          $('#messages').html($.ui.pwstrength.outputErrorList());
        }
      }
      $(':password').pwstrength(options);
    });


Future Improvements
-------------------
* Provide standard `data-` attributes that will override settings in the module (for example `data-minchar` to set the minimum number of characters required).
* Move password strength logic out to separate code component so it is jQueryUI agnostic (other client side libs, nodejs, etc) and use addRule function to attach them to the UI element
