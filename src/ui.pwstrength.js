/*
 * jQuery UI Password Strength @VERSION
 *
 * Copyright (c) 2008 Tane Piper
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.progressbar.js
 */
(function( $ ) {

  $.widget("ui.pwstrength", {

    options: {
      minchar : 8,
      errorMessages : {
        password_to_short : "The Password is too short",
        same_as_username : "Your password cannot be the same as your username"
      },
      progressClass : ['zero', 'twenty-five', 'fifty', 'seventy-five', 'one-hundred'],
      scores : [17, 26, 33, 37],
      verdicts : ["Weak", "Normal", "Medium", "Strong", "Very Strong"],
      showverdicts: true,
      raisepower : 1.4,
      usernamefield : "#username",
      onLoad: undefined,
      onKeyUp: undefined
    },

    _create: function() {
      var self = this;
      this.options = $.extend(this.options, this.element.data());
      
      var id = ((new Date()).getTime() + Math.random());

      this.element
      .addClass("ui-password")
      .attr({
        role: "password"
      })
      .bind("keyup.pwstrength", function( event ){
        $.ui.pwstrength.errors = [];
        self._calculateScore(self.element.val());
        if ($.isFunction(self.options.onKeyUp)) self.options.onKeyUp.call(self);
      });

      $.extend(this, {
        identifier: id,
        wordToShort: true
      });

      $(this._progressWidget()).insertAfter(this.element);
      $(".ui-password-meter").progressbar({
        value: 0
      });
      if(this.options.showverdicts) $(".ui-password-meter").children().html('<span class="password-verdict">' + this.options.verdicts[0] + '</span>');
      if ($.isFunction(this.options.onLoad)) this.options.onLoad.call(self);
    },
    destroy : function() {
      this.element
        .removeClass( ".ui-password" )
        .removeAttr( "role" )
      $.Widget.prototype.destroy.call( this );
    },
    _calculateScore : function(word){
      var self = this;

      var totalScore = 0;

      $.each($.ui.pwstrength.rules, function(rule, active){
        if (active === true) {
          var score = $.ui.pwstrength.ruleScores[rule];
          var result = $.ui.pwstrength.validationRules[rule](self, word, score);
          if (result) {
            totalScore += result;
          }
        }
      });
      this._setProgressBar(totalScore);
      return totalScore;
    },

    _setProgressBar : function( score ) {
      var self = this;
      var options = this.options;

      var progress_width = 0;

      $(".ui-progressbar-value", ".ui-password-meter")[score >= options.scores[0] && score < options.scores[1] ? "addClass" : "removeClass"]("password-" + options.progressClass[1]);
      $(".ui-progressbar-value", ".ui-password-meter")[score >= options.scores[1] && score < options.scores[2] ? "addClass" : "removeClass"]("password-" + options.progressClass[2]);
      $(".ui-progressbar-value", ".ui-password-meter")[score >= options.scores[2] && score < options.scores[3] ? "addClass" : "removeClass"]("password-" + options.progressClass[3]);
      $(".ui-progressbar-value", ".ui-password-meter")[score >= options.scores[3] ? "addClass" : "removeClass"]("password-" + options.progressClass[4]);

      if (score < options.scores[0]) {
        progress_width = 0;
        $(".ui-password-meter").progressbar("value", progress_width);
        if(options.showverdicts) $(".ui-password-meter").children().html('<span style="position:relative; z-index:9999;" class="password-verdict">' + options.verdicts[0] + '</span>');
      } else if (score >= options.scores[0] && score < options.scores[1]) {
        progress_width = 25
        $(".ui-password-meter").progressbar("value", progress_width);
        if(options.showverdicts) $(".ui-password-meter").children().html('<span style="position:relative; z-index:9999;" class="password-verdict">' + options.verdicts[1] + '</span>');
      } else if (score >= options.scores[1] && score < options.scores[2]) {
        progress_width = 50;
        $(".ui-password-meter").progressbar("value", progress_width);
        if(options.showverdicts) $(".ui-password-meter").children().html('<span style="position:relative; z-index:9999;" class="password-verdict">' + options.verdicts[2] + '</span>');
      } else if (score >= options.scores[2] && score < options.scores[3]) {
        progress_width = 75;
        $(".ui-password-meter").progressbar("value", progress_width);
        if(options.showverdicts) $(".ui-password-meter").children().html('<span style="position:relative; z-index:9999;" class="password-verdict">' + options.verdicts[3] + '</span>');
      } else if (score >= options.scores[3]) {
        progress_width = 100;
        $(".ui-password-meter").progressbar("value", progress_width);
        if(options.showverdicts) $(".ui-password-meter").children().html('<span style="position:relative; z-index:9999;" class="password-verdict">' + options.verdicts[4] + '</span>');
      }
      //$(".ui-password-meter").progressbar("value", progress_width);
    },

    _progressWidget : function() {
      return '<div class="ui-password-meter"></div>';
    }
  });

  //$.ui.password.getter = "calculateScore";

  $.extend( $.ui.pwstrength, {
    errors : [],
    outputErrorList : function() {
      var output = '<ul>';
      $.each($.ui.pwstrength.errors, function(i, item) {
        output += '<li>' + item + '</li>';
      });
      output += '</ul>';
      return output;
    },
    addRule : function ( name, method, score, active ) {

      $.ui.pwstrength.rules[name] = active;
      $.ui.pwstrength.ruleScores[name] = score;
      $.ui.pwstrength.validationRules[name] = method;
    },
    changeScore : function( rule, score ) {
      $.ui.pwstrength.ruleScores[rule] = score;
    },
    ruleActive : function (rule, active) {
      $.ui.pwstrength.rules[rule] = active;
    },
    ruleScores : {
      wordNotEmail: -100,
      wordLength : -100,
      wordSimilarToUsername : -100,
      wordLowercase : 1,
      wordUppercase : 3,
      wordOneNumber : 3,
      wordThreeNumbers : 5,
      wordOneSpecialChar : 3,
      wordTwoSpecialChar : 5,
      wordUpperLowerCombo : 2,
      wordLetterNumberCombo : 2,
      wordLetterNumberCharCombo : 2
    },
    rules : {
      wordNotEmail: true,
      wordLength : true,
      wordSimilarToUsername :true,
      wordLowercase : true,
      wordUppercase : true,
      wordOneNumber : true,
      wordThreeNumbers : true,
      wordOneSpecialChar : true,
      wordTwoSpecialChar : true,
      wordUpperLowerCombo : true,
      wordLetterNumberCombo : true,
      wordLetterNumberCharCombo : true
    },
    validationRules : {
      wordNotEmail : function ( ui, word, score ) {
        return word.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i) && score;
      },
      wordLength : function( ui, word, score ) {
        var options = ui.options;
        var wordlen = word.length;
        var lenScore = Math.pow(wordlen, options.raisepower);
        ui.wordToShort = false;

        if (wordlen < options.minchar) {
          lenScore = (lenScore + score);
          ui.wordToShort = true;
          $.ui.pwstrength.errors.push(options.errorMessages.password_to_short);
        }
        return lenScore;
      },
      wordSimilarToUsername : function( ui, word, score ) {
        var options = ui.options;
        var username = $(options.usernamefield).val();
        if (username && word.toLowerCase().match(username.toLowerCase())) {
          $.ui.pwstrength.errors.push(options.errorMessages.same_as_username);
          return score;
        }
        return true;
      },
      wordLowercase : function( ui, word, score ) {
        return word.match(/[a-z]/) && score;
      },
      wordUppercase : function( ui, word, score ) {
        return word.match(/[A-Z]/) && score;
      },
      wordOneNumber : function( ui, word, score ) {
        return word.match(/\d+/) && score;
      },
      wordThreeNumbers : function( ui, word, score ) {
        return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
      },
      wordOneSpecialChar : function( ui, word, score ) {
        return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
      },
      wordTwoSpecialChar : function( ui, word, score ) {
        return word.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
      },
      wordUpperLowerCombo : function( ui, word, score ) {
        return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
      },
      wordLetterNumberCombo : function( ui, word, score ) {
        return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
      },
      wordLetterNumberCharCombo : function( ui, word, score ) {
        return word.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
      }
    }
  });
}(jQuery));
