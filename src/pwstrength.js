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
    options.ui.showErrors = true;
    options.ui.usernameField = "#username";
    options.ui.container = undefined;
    options.ui.viewports = {
        progress: undefined,
        verdict: undefined,
        errors: undefined
    };
    options.ui.scores = [17, 26, 40, 50];

    // USER INTERFACE
    // ==============

    ui.getContainer = function (options, $el) {
        var $container;

        $container = $(options.ui.container);
        if (!($container && $container.length === 1)) {
            $container = $el.parent();
        }
        return $container;
    };

    ui.getUIElements = function (options, $el) {
        var $container, $verdict, $progressbar, $errors, result;

        if (options.instances.viewports) {
            return options.instances.viewports;
        }

        result = {};

        $container = ui.getContainer(options, $el);

        if (options.ui.viewports.progress) {
            $progressbar = $container.find(options.ui.viewports.progress).find("div.progress");
        } else {
            $progressbar = $container.find("div.progress");
        }
        result.$progressbar = $progressbar;

        if (options.ui.showPopover) {
            result.$verdict = $container.find(".popover span.password-verdict");
            result.$errors = $container.find(".popover ul.error-list");
        } else {
            if (options.ui.viewports.verdict) {
                $verdict = $container.find(options.ui.viewports.verdict).find("span.password-verdict");
            } else {
                $verdict = $container.find("span.password-verdict");
            }
            result.$verdict = $verdict;

            if (options.ui.viewports.errors) {
                $errors = $container.find(options.ui.viewports.errors).find("ul.error-list");
            } else {
                $errors = $container.find("ul.error-list");
            }
            result.$errors = $errors;
        }

        options.instances.viewports = result;
        return result;
    };

    ui.initProgressBar = function (options, $el) {
        var $container = ui.getContainer(options, $el),
            progressbar = "<div class='progress'><div class='";

        if (!options.ui.bootstrap2) {
            progressbar += "progress-";
        }
        progressbar += "bar'></div></div>";

        if (options.ui.viewports.progress) {
            $container.find(options.ui.viewports.progress).append(progressbar);
        } else {
            $(progressbar).insertAfter($el);
        }
    };

    ui.initVerdict = function (options, $el) {
        var $container = ui.getContainer(options, $el),
            verdict = "<span class='password-verdict'></span>";

        if (options.ui.viewports.verdict) {
            $container.find(options.ui.viewports.verdict).append(verdict);
        } else {
            $(verdict).insertAfter($el);
        }
    };

    ui.initErrorList = function (options, $el) {
        var $container = ui.getContainer(options, $el),
            errorList = "<ul class='error-list'></ul>";

        if (options.ui.viewports.errors) {
            $container.find(options.ui.viewports.errors).append(errorList);
        } else {
            $(errorList).insertAfter($el);
        }
    };

    ui.initPopover = function (options, $el) {
        var placement = "auto top",
            html;

        if (options.ui.bootstrap2) { placement = "top"; }

        html = "<h5><span class='password-verdict'></span></h5>" +
            "<div><ul class='error-list'></ul></div>";

        $el.popover("destroy");
        $el.popover({
            html: true,
            placement: placement,
            trigger: "manual",
            content: html
        });
    };

    ui.initUI = function (options, $el) {
        if (options.ui.showPopover) {
            ui.initPopover();
        } else {
            ui.initErrorList();
            ui.initVerdict();
        }
        ui.initProgressBar();
    };

    ui.possibleProgressBarClasses = ["danger", "warning", "success"];

    ui.updateProgressBar = function (options, $el, cssClass, percentage) {
        var $progressbar = ui.getUIElements(options, $el).$progressbar,
            $bar = $progressbar.find(".progress-bar"),
            cssPrefix = "progress-";

        if (options.ui.bootstrap2) {
            $bar = $progressbar.find(".bar");
            cssPrefix = "";
        }

        $.each(ui.possibleProgressBarClasses, function (idx, value) {
            $bar.removeClass(cssPrefix + "bar-" + value);
        });
        $bar.addClass(cssPrefix + "bar-" + cssClass);
        $bar.css("width", percentage + '%');
    };

    ui.updateVerdict = function (options, $el, text) {
        var $verdict = ui.getUIElements(options, $el).$verdict;
        $verdict.text(text);
    };

    ui.updateErrors = function (options, $el, errors) {
        // TODO
    };

    ui.updateUI = function (options, $el, score, errors) {
        var barCss, barPercentage, verdictText;

        if (score === 0) {
            barCss = "danger";
            barPercentage = 0;
            verdictText = "";
        } else if (score < options.ui.scores[0]) {
            barCss = "danger";
            barPercentage = 5;
            verdictText = options.ui.verdicts[0];
        } else if (score >= options.ui.scores[0] && score < options.ui.scores[1]) {
            barCss = "danger";
            barPercentage = 25;
            verdictText = options.ui.verdicts[1];
        } else if (score >= options.ui.scores[1] && score < options.ui.scores[2]) {
            barCss = "warning";
            barPercentage = 50;
            verdictText = options.ui.verdicts[2];
        } else if (score >= options.ui.scores[2] && score < options.ui.scores[3]) {
            barCss = "warning";
            barPercentage = 75;
            verdictText = options.ui.verdicts[3];
        } else if (score >= options.ui.scores[3]) {
            barCss = "success";
            barPercentage = 100;
            verdictText = options.ui.verdicts[4];
        }

        ui.updateProgressBar(options, $el, barCss, barPercentage);
        if (options.ui.showPopover || options.ui.showVerdicts) {
            ui.updateVerdict(options, $el, verdictText);
        }
        if (options.ui.showPopover || options.ui.showErrors) {
            ui.updateErrors(options, $el, errors);
        }
    };
























    var methodsOld = {
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
