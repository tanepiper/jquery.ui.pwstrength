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

  $.widget('ui.pwstrength', {

    options: {
      displayMinChar : true,
      minChar : 8,
      minCharText : 'You must enter a minimum of %d characters',
      colors : ["#f00", "#c06", "#f60", "#3c0", "#3f0"],
      scores : [20, 30, 43, 50],
      verdicts : ['Weak', 'Normal', 'Medium', 'Strong', 'Very Strong'],
      raisePower : 1.4,
      debug : false,
      usernameField :'#username'
    },

    _create: function() {
      var self = this,
      doc = this.element[ 0 ].ownerDocument;
      
      var id = ((new Date()).getTime() + Math.random());

      this.element
      .addClass("ui-password ui-widget ui-widget-content")
      .attr({
        'role': 'password'
      })
      .bind("keyup.pwstrength", function( event ){
        self._calculateScore(self.element.val());
      });

      $.extend(this, {
        identifier: id,
        wordToShort: true
      });

      $(this._progressWidget()).insertAfter(this.element);
      $('.ui-password-meter').progressbar({
        value: 0
      });

      //this.element.keyup(function(){
      //  this.calculateScore($(this).val());
      //});
    },

    _calculateScore : function(word){
      var self = this;
      var options = this.options;

      var totalScore = 0;
      var barLength = 0;

      jQuery.each($.ui.pwstrength.rules, function(type, value){
        if (value === true) {
          var score = $.ui.pwstrength.ruleScores[type];
          var result = $.ui.pwstrength.validationRules[type](self, word, score);
          if (result) {
            totalScore += result;
          }
        }
      });
      this._getBarSettings(totalScore);
      return totalScore;
    },

    _getBarSettings : function( score ) {
      var self = this;
      var options = this.options;

      var progress_width = 0;

      if (score < options.scores[0]) {
        progress_width = 0;
      } else if (score >= options.scores[0] && score < options.scores[1]) {
        progress_width = 25
      } else if (score >= options.scores[1] && score < options.scores[2]) {
        progress_width = 50;
      } else if (score >= options.scores[2] && score < options.scores[3]) {
        progress_width = 75;
      } else if (score >= options.scores[3]) {
        progress_width = 100;
      }
      console.log(progress_width);
      $('.ui-password-meter').progressbar('value', progress_width);
    },

    _progressWidget : function() {
      return '<div class="ui-password-message"></div><div class="ui-password-meter></div>';
    },

    addRule : function ( name, method, score, active ) {
      this.options.rules[name] = active;
      this.options.ruleScores[name] = score;
      this.options.validationRules[name] = method;
    },
    changeScore : function( rule, score ) {
      this.options.ruleScores[rule] = score;
    },
    ruleActive : function (rule, active) {
      this.options.rules[rule] = active;
    }
  });

  //$.ui.password.getter = "calculateScore";

  $.extend( $.ui.pwstrength, {
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
          jQuery('.ui-password-message').text('Password to short');
        } else {
          jQuery('.ui-password-message').text('');
        }
        return lenScore;
      },
      wordSimilarToUsername : function( ui, word, score ) {
        var options = ui.options;
        var username = jQuery(options.usernameField).val();
        if (username && word.toLowerCase().match(username.toLowerCase())) {
          return -100;
          jQuery('.ui-password-message').text('Password to similar to username');
        } else {
          jQuery('.ui-password-message').text('');
        }

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