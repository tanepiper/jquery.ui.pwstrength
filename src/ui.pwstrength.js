/*jslint vars: false, browser: true, nomen: true, regexp: true */
/*global jQuery */

/*
* jQuery Password Strength plugin for Twitter Bootstrap
*
* Copyright (c) 2008-2013 Tane Piper
* Copyright (c) 2013 Alejandro Blanco
* Dual licensed under the MIT and GPL licenses.
*
*/

(function ($) {

    "use strict";

    $.widget("ui.pwstrength", {
        options: {
            minChar : 8,
            errorMessages : {
                password_to_short : "The Password is too short",
                same_as_username : "Your password cannot be the same as your username"
            },
            progressClass : ['zero', 'twenty-five', 'fifty', 'seventy-five', 'one-hundred'],
            scores : [17, 26, 40, 50],
            verdicts : ["Weak", "Normal", "Medium", "Strong", "Very Strong"],
            showVerdicts: true,
            raisePower : 1.4,
            usernameField : "#username",
            onLoad: undefined,
            onKeyUp: undefined
        },

        _create: function () {
            var self = this,
                options = this.options,
                id = ((new Date()).getTime() + Math.random());

            this.element
                .addClass("ui-password")
                .attr({
                    role: "password"
                })
                .bind("keyup.pwstrength", function (event) {
                    $.ui.pwstrength.errors = [];
                    self._calculateScore(self.element.val());
                    if ($.isFunction(options.onKeyUp)) { options.onKeyUp(); }
                });

            $.extend(this, {
                identifier: id,
                wordToShort: true
            });

            $(this._progressWidget()).insertAfter(this.element);
            $(".ui-password-meter").progressbar({
                value: 0
            });
            if (options.showVerdicts) {
                $(".ui-password-meter").children().html('<span class="password-verdict">' + options.verdicts[0] + '</span>');
            }
            if ($.isFunction(options.onLoad)) { options.onLoad(); }
        },

        destroy : function () {
            this.element
                .removeClass(".ui-password")
                .removeAttr("role");
            $.Widget.prototype.destroy.call(this);
        },

        _calculateScore : function (word) {
            var self = this,
                totalScore = 0;

            $.each($.ui.pwstrength.rules, function (rule, active) {
                if (active === true) {
                    var score = $.ui.pwstrength.ruleScores[rule],
                        result = $.ui.pwstrength.validationRules[rule](self, word, score);
                    if (result) {
                        totalScore += result;
                    }
                }
            });
            this._setProgressBar(totalScore);
            return totalScore;
        },

        _setProgressBar : function (score) {
            var self = this,
                options = this.options,
                progress_width = 0;

            $(".ui-progressbar-value", ".ui-password-meter")[score >= options.scores[0] && score < options.scores[1] ? "addClass" : "removeClass"]("password-" + options.progressClass[1]);
            $(".ui-progressbar-value", ".ui-password-meter")[score >= options.scores[1] && score < options.scores[2] ? "addClass" : "removeClass"]("password-" + options.progressClass[2]);
            $(".ui-progressbar-value", ".ui-password-meter")[score >= options.scores[2] && score < options.scores[3] ? "addClass" : "removeClass"]("password-" + options.progressClass[3]);
            $(".ui-progressbar-value", ".ui-password-meter")[score >= options.scores[3] ? "addClass" : "removeClass"]("password-" + options.progressClass[4]);

            if (score < options.scores[0]) {
                progress_width = 0;
                $(".ui-password-meter").progressbar("value", progress_width);
                if (options.showVerdicts) {
                    $(".ui-password-meter").children().html('<span class="password-verdict">' + options.verdicts[0] + '</span>');
                }
            } else if (score >= options.scores[0] && score < options.scores[1]) {
                progress_width = 25;
                $(".ui-password-meter").progressbar("value", progress_width);
                if (options.showVerdicts) {
                    $(".ui-password-meter").children().html('<span class="password-verdict">' + options.verdicts[1] + '</span>');
                }
            } else if (score >= options.scores[1] && score < options.scores[2]) {
                progress_width = 50;
                $(".ui-password-meter").progressbar("value", progress_width);
                if (options.showVerdicts) {
                    $(".ui-password-meter").children().html('<span class="password-verdict">' + options.verdicts[2] + '</span>');
                }
            } else if (score >= options.scores[2] && score < options.scores[3]) {
                progress_width = 75;
                $(".ui-password-meter").progressbar("value", progress_width);
                if (options.showVerdicts) {
                    $(".ui-password-meter").children().html('<span class="password-verdict">' + options.verdicts[3] + '</span>');
                }
            } else if (score >= options.scores[3]) {
                progress_width = 100;
                $(".ui-password-meter").progressbar("value", progress_width);
                if (options.showVerdicts) {
                    $(".ui-password-meter").children().html('<span class="password-verdict">' + options.verdicts[4] + '</span>');
                }
            }
            //$(".ui-password-meter").progressbar("value", progress_width);
        },

        _progressWidget : function () {
            return '<div class="ui-password-meter></div>';
        }
    });

    //$.ui.password.getter = "calculateScore";

    $.extend($.ui.pwstrength, {
        errors: [],
        outputErrorList: function () {
            var output = '<ul>';
            $.each($.ui.pwstrength.errors, function (i, item) {
                output += '<li>' + item + '</li>';
            });
            output += '</ul>';
            return output;
        },
        addRule: function (name, method, score, active) {
            $.ui.pwstrength.rules[name] = active;
            $.ui.pwstrength.ruleScores[name] = score;
            $.ui.pwstrength.validationRules[name] = method;
        },
        changeScore: function (rule, score) {
            $.ui.pwstrength.ruleScores[rule] = score;
        },
        ruleActive: function (rule, active) {
            $.ui.pwstrength.rules[rule] = active;
        },
        ruleScores: {
            wordNotEmail: -100,
            wordLength: -100,
            wordSimilarToUsername: -100,
            wordLowercase: 1,
            wordUppercase: 3,
            wordOneNumber: 3,
            wordThreeNumbers: 5,
            wordOneSpecialChar: 3,
            wordTwoSpecialChar: 5,
            wordUpperLowerCombo: 2,
            wordLetterNumberCombo: 2,
            wordLetterNumberCharCombo: 2
        },
        rules: {
            wordNotEmail: true,
            wordLength: true,
            wordSimilarToUsername: true,
            wordLowercase: true,
            wordUppercase: true,
            wordOneNumber: true,
            wordThreeNumbers: true,
            wordOneSpecialChar: true,
            wordTwoSpecialChar: true,
            wordUpperLowerCombo: true,
            wordLetterNumberCombo: true,
            wordLetterNumberCharCombo: true
        },
        validationRules: {
            wordNotEmail: function (ui, word, score) {
                return word.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i) && score;
            },
            wordLength: function (ui, word, score) {
                var options = ui.options,
                    wordlen = word.length,
                    lenScore = Math.pow(wordlen, options.raisePower);
                ui.wordToShort = false;
                if (wordlen < options.minChar) {
                    lenScore = (lenScore + score);
                    ui.wordToShort = true;
                    $.ui.pwstrength.errors.push(options.errorMessages.password_to_short);
                }
                return lenScore;
            },
            wordSimilarToUsername: function (ui, word, score) {
                var options = ui.options,
                    username = $(options.usernameField).val();
                if (username && word.toLowerCase().match(username.toLowerCase())) {
                    $.ui.pwstrength.errors.push(options.errorMessages.same_as_username);
                    return score;
                }
                return true;
            },
            wordLowercase: function (ui, word, score) {
                return word.match(/[a-z]/) && score;
            },
            wordUppercase: function (ui, word, score) {
                return word.match(/[A-Z]/) && score;
            },
            wordOneNumber : function (ui, word, score) {
                return word.match(/\d+/) && score;
            },
            wordThreeNumbers : function (ui, word, score) {
                return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
            },
            wordOneSpecialChar : function (ui, word, score) {
                return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
            },
            wordTwoSpecialChar : function (ui, word, score) {
                return word.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
            },
            wordUpperLowerCombo : function (ui, word, score) {
                return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
            },
            wordLetterNumberCombo : function (ui, word, score) {
                return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
            },
            wordLetterNumberCharCombo : function (ui, word, score) {
                return word.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
            }
        }
    });
}(jQuery));
