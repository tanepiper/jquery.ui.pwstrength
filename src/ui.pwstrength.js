/*
 * jQuery UI Progressbar @VERSION
 *
 * Copyright (c) 2008 Tane Piper
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.progressbar.js
 */
(function( $ ) {

  $.widget("ui.pwstrength", {

    options: {
      displayMinChar : true,
      minChar : 8,
      minCharText : "You must enter a minimum of %d characters",
      progressClass : ['zero', 'twenty-five', 'fifty', 'seventy-five', 'one-hundred'],
      colors : ["#f00", "#c06", "#f60", "#3c0", "#3f0"],
      scores : [20, 30, 43, 50],
      verdicts : ["Weak", "Normal", "Medium", "Strong", "Very Strong"],
      raisePower : 1.4,
      debug : false,
      usernameField :"#username"
    },

    _create: function() {
      var self = this,
      doc = this.element[ 0 ].ownerDocument;
      
      var id = ((new Date()).getTime() + Math.random());

      this.element
      .addClass("ui-password")
      .attr({
        "role": "password"
      })
      .bind("keyup.pwstrength", function( event ){
        self._calculateScore(self.element.val());
      });

      $.extend(this, {
        identifier: id,
        wordToShort: true
      });

      $(this._progressWidget()).insertAfter(this.element);
      $(".ui-password-meter").progressbar({
        value: 0
      });

      //this.element.keyup(function(){
      //  this.calculateScore($(this).val());
      //});
    },
    destroy : function() {

      this.element
        .removeClass( ".ui-password" )
        .removeAttr( "role" )
      $.Widget.prototype.destroy.call( this );

    },
    _calculateScore : function(word){
      var self = this;
      var options = this.options;

      var totalScore = 0;
      var barLength = 0;

      jQuery.each($.ui.pwstrength.rules, function(rule, active){
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
        $(".ui-password-meter").progressbar("value", progress_width).children().html('<span class="password-verdict">' + options.verdicts[0] + '</span>');
      } else if (score >= options.scores[0] && score < options.scores[1]) {
        progress_width = 25
        $(".ui-password-meter").progressbar("value", progress_width).children().html('<span class="password-verdict">' + options.verdicts[1] + '</span>');
      } else if (score >= options.scores[1] && score < options.scores[2]) {
        progress_width = 50;
        $(".ui-password-meter").progressbar("value", progress_width).children().html('<span class="password-verdict">' + options.verdicts[2] + '</span>');
      } else if (score >= options.scores[2] && score < options.scores[3]) {
        progress_width = 75;
        $(".ui-password-meter").progressbar("value", progress_width).children().html('<span class="password-verdict">' + options.verdicts[3] + '</span>');
      } else if (score >= options.scores[3]) {
        progress_width = 100;
        $(".ui-password-meter").progressbar("value", progress_width).children().html('<span class="password-verdict">' + options.verdicts[4] + '</span>');
      }
      //$(".ui-password-meter").progressbar("value", progress_width);
    },

    _progressWidget : function() {
      return '<div class="ui-password-message"></div><div class="ui-password-meter></div>';
    }
  });

  //$.ui.password.getter = "calculateScore";

  $.extend( $.ui.pwstrength, {
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
      wordLength : 0,
      wordSimilarToUsername : 0,
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
      wordLength : function( ui, word, score ) {
        var options = ui.options;
        var wordlen = word.length;
        var lenScore = Math.pow(wordlen, options.raisePower);
        ui.wordToShort = false;

        if (wordlen < options.minChar) {
          lenScore = (lenScore - 100);
          ui.wordToShort = true;
          $(".ui-password-message").text("Password to short");
        } else {
          $(".ui-password-message").text("");
        }
        return lenScore;
      },
      wordSimilarToUsername : function( ui, word, score ) {
        var options = ui.options;
        var username = jQuery(options.usernameField).val();
        if (username && word.toLowerCase().match(username.toLowerCase())) {
          return -100;
          $(".ui-password-message").text("Password to similar to username");
        } else {
          $(".ui-password-message").text("");
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