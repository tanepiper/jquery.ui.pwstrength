/*jslint browser: true, regexp: true, unparam: true */
/*global jQuery */

/*
* jQuery Password Strength plugin for Twitter Bootstrap
*
* Copyright (c) 2008-2013 Tane Piper
* Copyright (c) 2013 Alejandro Blanco
* Dual licensed under the MIT and GPL licenses.
*/

(function ($) {
    "use strict";

    var rulesEngine = {},
        validation = {},
        options = {},
        ui = {},
        methods = {};

    // RULES ENGINE
    // ============

    rulesEngine.forbiddenSequences = [
        "0123456789", "9876543210", "abcdefghijklmnopqrstuvxywz",
        "qwertyuiopasdfghjklzxcvbnm"
    ];

    validation.wordNotEmail = function (options, word, score) {
        if (word.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i)) {
            options.errors.push(options.errorMessages.email_as_password);
            return score;
        }
    };

    validation.wordLength = function (options, word, score) {
        var wordlen = word.length,
            lenScore = Math.pow(wordlen, options.raisePower);
        if (wordlen < options.minChar) {
            lenScore = (lenScore + score);
            options.errors.push(options.errorMessages.password_too_short);
        }
        return lenScore;
    };

    validation.wordSimilarToUsername = function (options, word, score) {
        var username = $(options.usernameField).val();
        if (username && word.toLowerCase().match(username.toLowerCase())) {
            options.errors.push(options.errorMessages.same_as_username);
            return score;
        }
        return false;
    };

    validation.wordTwoCharacterClasses = function (options, word, score) {
        if (word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) ||
                (word.match(/([a-zA-Z])/) && word.match(/([0-9])/)) ||
                (word.match(/(.[!,@,#,$,%,\^,&,*,?,_,~])/) && word.match(/[a-zA-Z0-9_]/))) {
            return score;
        }
        options.errors.push(options.errorMessages.two_character_classes);
        return false;
    };

    validation.wordRepetitions = function (options, word, score) {
        if (word.match(/(.)\1\1/)) {
            options.errors.push(options.errorMessages.repeated_character);
            return score;
        }
        return false;
    };

    validation.wordSequences = function (options, word, score) {
        var j;
        if (word.length > 2) {
            $.each(rulesEngine.forbiddenSequences, function (idx, sequence) {
                for (j = 0; j < (word.length - 3); j += 1) { //iterate the word trough a sliding window of size 3:
                    if (sequence.indexOf(word.toLowerCase().substring(j, j + 3)) > -1) {
                        options.errors.push(options.errorMessages.sequence_found);
                        return score;
                    }
                }
            });
        }
        return false;
    };

    validation.wordLowercase = function (options, word, score) {
        return word.match(/[a-z]/) && score;
    };

    validation.wordUppercase = function (options, word, score) {
        return word.match(/[A-Z]/) && score;
    };

    validation.wordOneNumber = function (options, word, score) {
        return word.match(/\d+/) && score;
    };

    validation.wordThreeNumbers = function (options, word, score) {
        return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
    };

    validation.wordOneSpecialChar = function (options, word, score) {
        return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
    };

    validation.wordTwoSpecialChar = function (options, word, score) {
        return word.match(/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/) && score;
    };

    validation.wordUpperLowerCombo = function (options, word, score) {
        return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
    };

    validation.wordLetterNumberCombo = function (options, word, score) {
        return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
    };

    validation.wordLetterNumberCharCombo = function (options, word, score) {
        return word.match(/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/) && score;
    };

    rulesEngine.validation = validation;

    rulesEngine.executeRules = function (options, word) {
        var totalScore = 0;

        $.each(options.rules.activated, function (rule, active) {
            if (active) {
                var score = options.rules.scores[rule],
                    funct = rulesEngine.validation[rule],
                    result;

                if (funct) {
                    result = funct(options, word, score);
                    if (result) {
                        totalScore += result;
                    }
                }
            }
        });

        return totalScore;
    };

    // OPTIONS
    // =======

    options.rules = {};
    options.rules.scores = {
        wordNotEmail: -100,
        wordLength: -100,
        wordSimilarToUsername: -100,
        wordSequences: -100,
        wordTwoCharacterClasses: 2,
        wordRepetitions: -30,
        wordLowercase: 1,
        wordUppercase: 3,
        wordOneNumber: 3,
        wordThreeNumbers: 5,
        wordOneSpecialChar: 3,
        wordTwoSpecialChar: 5,
        wordUpperLowerCombo: 2,
        wordLetterNumberCombo: 2,
        wordLetterNumberCharCombo: 2
    };
    options.rules.activated = {
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
    };
    options.rules.scores = [17, 26, 40, 50];
    options.rules.raisePower = 1.4;

    options.common = {};
    options.common.minChar = 8;
    options.common.onLoad = undefined;
    options.common.onKeyUp = undefined;

    options.ui = {};
    options.ui.bootstrap2 = false;
    options.ui.showPopover = false;
    options.ui.spanError = function (text) {
        return '<span style="color: #d52929">' + text + '</span>';
    };
    options.ui.errorMessages = {
        password_too_short: options.ui.spanError("The Password is too short"),
        email_as_password: options.ui.spanError("Do not use your email as your password"),
        same_as_username: options.ui.spanError("Your password cannot contain your username"),
        two_character_classes: options.ui.spanError("Use different character classes"),
        repeated_character: options.ui.spanError("Too many repetitions"),
        sequence_found: options.ui.spanError("Your password contains sequences")
    };
    options.ui.verdicts = ["Weak", "Normal", "Medium", "Strong", "Very Strong"];
    options.ui.showVerdicts = true;
    options.ui.usernameField = "#username";
    options.ui.container = undefined;
    options.ui.viewports = {
        progress: undefined,
        verdict: undefined,
        errors: undefined
    };





























    var getContainer = function (container, $el) {
            var $container = $(container);

            if (!($container && $container.length === 1)) {
                $container = $el.parent();
            }

            return $container;
        },

        initPopover = function (options, $el) {
            var $container = getContainer(options.container, $el),
                placement = "top",
                $verdict;

            if (options.bootstrap3) {
                placement = "auto " + placement;
            }

            if (options.viewports.verdict) {
                $verdict = $container.find(options.viewports.verdict).find(".password-verdict");
            } else {
                $verdict = $container.find(".password-verdict");
            }

            $el.popover('destroy');
            $el.popover({
                html: true,
                placement: placement,
                trigger: "manual",
                content: function () {
                    var output = '<h5>' + $verdict.text() + '</h5>';
                    $.each(options.errors, function (key, value) {
                        output += '<p>' + value + '</p>';
                    });
                    return output;
                }
            });

            if ($el.val().length > 0) { $el.popover('show'); }
            $container.find('ul.error-list').hide();
            $verdict.hide();
        },

        progressWidget = function (localOptions) {
            var html = '<div class="progress"><div class="';

            if (localOptions.bootstrap3) {
                html += 'progress-';
            }

            return html + 'bar"></div></div>';
        },

        initProgressBar = function (options, $el) {
            var $progressbar = $(progressWidget(options)),
                $container = getContainer(options.container, $el);

            if (options.viewports.progress) {
                $container.find(options.viewports.progress).append($progressbar);
            } else {
                $progressbar.insertAfter($el);
            }

            if (options.bootstrap3) {
                $progressbar.find(".progress-bar").css("width", "0%");
            } else {
                $progressbar.find(".bar").css("width", "0%");
            }

            $el.data("pwstrength").progressbar = $progressbar;
        },

        initVerdict = function (localOptions, $el, initial) {
            var $container = getContainer(localOptions.container, $el),
                $verdict;

            if (localOptions.viewports.verdict) {
                $verdict = $container.find(localOptions.viewports.verdict).find(".password-verdict");
            } else {
                $verdict = $container.find(".password-verdict");
            }

            if ($verdict.length === 0) {
                $verdict = $('<span class="password-verdict">' + initial + '</span>');
                if (localOptions.viewports.verdict) {
                    $container.find(localOptions.viewports.verdict).append($verdict);
                } else {
                    $verdict.insertAfter($el);
                }
            }

            if (localOptions.showPopover || $el.val().length === 0) {
                $verdict.hide();
            } else {
                $verdict.show();
            }

            return $verdict;
        },

        possibleProgressBarClasses = ["danger", "warning", "success"],

        updateProgressBarHTML = function ($bar, cssPrefix, cssClass, percentage) {
            var aux, i;

            $bar.addClass(cssPrefix + "bar-" + cssClass);
            for (i = 0; i < possibleProgressBarClasses.length; i += 1) {
                aux = possibleProgressBarClasses[i];
                if (aux !== cssClass) {
                    $bar.removeClass(cssPrefix + "bar-" + aux);
                }
            }
            $bar.css("width", percentage);
        },

        setProgressBar = function ($el, score) {
            var localOptions = $el.data("pwstrength"),
                $progressbar = localOptions.progressbar,
                cssPrefix = "",
                $bar = $progressbar.find(".bar"),
                $verdict,
                verdictText;

            if (localOptions.bootstrap3) {
                $bar = $progressbar.find(".progress-bar");
                cssPrefix = "progress-";
            }
            if (localOptions.showVerdicts) {
                $verdict = initVerdict(localOptions, $el, "");
            }

            if ($el.val().length === 0) {
                updateProgressBarHTML($bar, cssPrefix, "danger", "0%");
                verdictText = "";
            } else if (score < localOptions.scores[0]) {
                updateProgressBarHTML($bar, cssPrefix, "danger", "5%");
                verdictText = localOptions.verdicts[0];
            } else if (score >= localOptions.scores[0] && score < localOptions.scores[1]) {
                updateProgressBarHTML($bar, cssPrefix, "danger", "25%");
                verdictText = localOptions.verdicts[1];
            } else if (score >= localOptions.scores[1] && score < localOptions.scores[2]) {
                updateProgressBarHTML($bar, cssPrefix, "warning", "50%");
                verdictText = localOptions.verdicts[2];
            } else if (score >= localOptions.scores[2] && score < localOptions.scores[3]) {
                updateProgressBarHTML($bar, cssPrefix, "warning", "75%");
                verdictText = localOptions.verdicts[3];
            } else if (score >= localOptions.scores[3]) {
                updateProgressBarHTML($bar, cssPrefix, "success", "100%");
                verdictText = localOptions.verdicts[4];
            }

            if (localOptions.showVerdicts) { $verdict.text(verdictText); }
        },

        methodsOld = {
            init: function (settings) {
//                 var self = this,
                var allOptions;

                // Make it deep extend (first param) so it extends too the
                // rules and other inside objects
                allOptions = $.extend(true, options, settings);

                this.each(function (idx, el) {
                    var $el = $(el);

                    $el.data("pwstrength", allOptions);

                    $el.on("keyup", function (event) {
                        var localOptions = $el.data("pwstrength");
                        localOptions.errors = [];
//                         calculateScore.call(self, $el);
                        if ($.isFunction(localOptions.onKeyUp)) {
                            localOptions.onKeyUp(event);
                        }
                    });

                    initProgressBar(allOptions, $el);
                    initVerdict(allOptions, $el, allOptions.verdicts[0]);

                    if ($.isFunction(allOptions.onLoad)) {
                        allOptions.onLoad();
                    }
                });

                return this;
            },

            destroy: function () {
                this.each(function (idx, el) {
                    var $el = $(el),
                        localOptions = $el.data("pwstrength"),
                        $container = getContainer(localOptions.container, $el);

                    $container.find("span.password-verdict").remove();
                    $container.find("div.progress").remove();
                    $container.find("ul.error-list").remove();
                    $el.removeData("pwstrength");
                });
            },

            forceUpdate: function () {
//                 var self = this;

                this.each(function (idx, el) {
                    var $el = $(el),
                        localOptions = $el.data("pwstrength");

                    localOptions.errors = [];
//                     calculateScore.call(self, $el);
                });
            },

            outputErrorList: function () {
                this.each(function (idx, el) {
                    var output = '<ul class="error-list">',
                        $el = $(el),
                        localOptions = $el.data("pwstrength"),
                        $container = getContainer(localOptions.container, $el),
                        $verdict;

                    $container.find("ul.error-list").remove();
                    if ($el.val().length > 0 && localOptions.errors.length > 0) {
                        $.each(localOptions.errors, function (i, item) {
                            output += '<li>' + item + '</li>';
                        });
                        output += '</ul>';
                        if (localOptions.viewports.errors) {
                            $container.find(localOptions.viewports.errors).html(output);
                        } else {
                            output = $(output);
                            $verdict = $container.find("span.password-verdict");
                            if ($verdict.length > 0) {
                                el = $verdict;
                            }
                            output.insertAfter(el);
                        }
                    }

                    if (localOptions.showPopover) {
                        initPopover(localOptions, $el);
                    }
                });
            },

            addRule: function (name, method, score, active) {
                this.each(function (idx, el) {
                    var localOptions = $(el).data("pwstrength");

                    localOptions.rules[name] = active;
                    localOptions.ruleScores[name] = score;
                    localOptions.validationRules[name] = method;
                });
            },

            changeScore: function (rule, score) {
                this.each(function (idx, el) {
                    $(el).data("pwstrength").ruleScores[rule] = score;
                });
            },

            ruleActive: function (rule, active) {
                this.each(function (idx, el) {
                    $(el).data("pwstrength").rules[rule] = active;
                });
            }
        };

    $.fn.pwstrength = function (method) {
        var result;

        if (methodsOld[method]) {
            result = methodsOld[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            result = methods.init.apply(this, arguments);
        } else {
            $.error("Method " +  method + " does not exist on jQuery.pwstrength");
        }

        return result;
    };
}(jQuery));
