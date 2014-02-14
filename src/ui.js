/*jslint browser: true, unparam: true */
/*global jQuery */

/*
* jQuery Password Strength plugin for Twitter Bootstrap
*
* Copyright (c) 2008-2013 Tane Piper
* Copyright (c) 2013 Alejandro Blanco
* Dual licensed under the MIT and GPL licenses.
*/

var ui = {};

(function ($, ui) {
    "use strict";

    var barClasses = ["danger", "warning", "success"],
        statusClasses = ["error", "warning", "success"];

    ui.getContainer = function (options, $el) {
        var $container;

        $container = $(options.ui.container);
        if (!($container && $container.length === 1)) {
            $container = $el.parent();
        }
        return $container;
    };

    ui.findElement = function ($container, viewport, cssSelector) {
        if (viewport) {
            return $container.find(viewport).find(cssSelector);
        }
        return $container.find(cssSelector);
    };

    ui.getUIElements = function (options, $el) {
        var $container, result;

        if (options.instances.viewports) {
            return options.instances.viewports;
        }

        result = {};
        $container = ui.getContainer(options, $el);
        result.$progressbar = ui.findElement($container, options.ui.viewports.progress, "div.progress");
        if (!options.ui.showPopover) {
            if (options.ui.showVerdictsInsideProgressBar) {
                result.$verdict = result.$progressbar.find("span.password-verdict");
            } else {
                result.$verdict = ui.findElement($container, options.ui.viewports.verdict, "span.password-verdict");
            }
            result.$errors = ui.findElement($container, options.ui.viewports.errors, "ul.error-list");
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
        progressbar += "bar'>";
        if (options.ui.showVerdictsInsideProgressBar) {
            progressbar += "<span class='password-verdict'></span>";
        }
        progressbar += "</div></div>";

        if (options.ui.viewports.progress) {
            $container.find(options.ui.viewports.progress).append(progressbar);
        } else {
            $(progressbar).insertAfter($el);
        }
    };

    ui.initHelper = function (options, $el, html, viewport) {
        var $container = ui.getContainer(options, $el);
        if (viewport) {
            $container.find(viewport).append(html);
        } else {
            $(html).insertAfter($el);
        }
    };

    ui.initVerdict = function (options, $el) {
        ui.initHelper(options, $el, "<span class='password-verdict'></span>",
                        options.ui.viewports.verdict);
    };

    ui.initErrorList = function (options, $el) {
        ui.initHelper(options, $el, "<ul class='error-list'></ul>",
                        options.ui.viewports.errors);
    };

    ui.initPopover = function (options, $el, verdictText) {
        var placement = "auto top",
            html = "";

        if (options.ui.bootstrap2) { placement = "top"; }

        if (options.ui.showVerdicts && verdictText.length > 0) {
            html = "<h5><span class='password-verdict'>" + verdictText +
                "</span></h5>";
        }
        if (options.ui.showErrors) {
            html += "<div><ul class='error-list'>";
            $.each(options.instances.errors, function (idx, err) {
                html += "<li>" + err + "</li>";
            });
            html += "</ul></div>";
        }

        $el.popover("destroy");
        $el.popover({
            html: true,
            placement: placement,
            trigger: "manual",
            content: html
        });
        $el.popover("show");
    };

    ui.initUI = function (options, $el) {
        if (!options.ui.showPopover) {
            if (options.ui.showErrors) { ui.initErrorList(options, $el); }
            if (options.ui.showVerdicts && !options.ui.showVerdictsInsideProgressBar) {
                ui.initVerdict(options, $el);
            }
        }
        // The popover can't be initialized here, it requires to be destroyed
        // and recreated every time its content changes, because it calculates
        // its position based on the size of its content
        if (options.ui.showProgressBar) {
            ui.initProgressBar(options, $el);
        }
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
        $bar.addClass(cssPrefix + "bar-" + barClasses[cssClass]);
        $bar.css("width", percentage + '%');
    };

    ui.updateVerdict = function (options, $el, text) {
        var $verdict = ui.getUIElements(options, $el).$verdict;
        $verdict.text(text);
    };

    ui.updateErrors = function (options, $el) {
        var $errors = ui.getUIElements(options, $el).$errors,
            html = "";
        $.each(options.instances.errors, function (idx, err) {
            html += "<li>" + err + "</li>";
        });
        $errors.html(html);
    };

    ui.updateFieldStatus = function (options, $el, cssClass) {
        var targetClass = options.ui.bootstrap2 ? ".control-group" : ".form-group",
            $container = $el.parents(targetClass).first();

        $.each(statusClasses, function (idx, css) {
            if (!options.ui.bootstrap2) { css = "has-" + css; }
            $container.removeClass(css);
        });

        cssClass = statusClasses[cssClass];
        if (!options.ui.bootstrap2) { cssClass = "has-" + cssClass; }
        $container.addClass(cssClass);
    };

    ui.percentage = function (score, maximun) {
        var result = Math.floor(100 * score / maximun);
        result = result < 0 ? 0 : result;
        result = result > 100 ? 100 : result;
        return result;
    };

    ui.updateUI = function (options, $el, score) {
        var cssClass, barPercentage, verdictText;

        if (score <= 0) {
            cssClass = 0;
            verdictText = "";
        } else if (score < options.ui.scores[0]) {
            cssClass = 0;
            verdictText = options.ui.verdicts[0];
        } else if (score < options.ui.scores[1]) {
            cssClass = 0;
            verdictText = options.ui.verdicts[1];
        } else if (score < options.ui.scores[2]) {
            cssClass = 1;
            verdictText = options.ui.verdicts[2];
        } else if (score < options.ui.scores[3]) {
            cssClass = 1;
            verdictText = options.ui.verdicts[3];
        } else {
            cssClass = 2;
            verdictText = options.ui.verdicts[4];
        }

        if (options.ui.showProgressBar) {
            barPercentage = ui.percentage(score, options.ui.scores[3]);
            ui.updateProgressBar(options, $el, cssClass, barPercentage);
        }
        if (options.ui.showStatus) {
            ui.updateFieldStatus(options, $el, cssClass);
        }
        if (options.ui.showPopover) {
            // Popover can't be updated, it has to be recreated
            ui.initPopover(options, $el, verdictText);
        } else {
            if (options.ui.showVerdictsInsideProgressBar || options.ui.showVerdicts) {
                ui.updateVerdict(options, $el, verdictText);
            }
            if (options.ui.showErrors) {
                ui.updateErrors(options, $el);
            }
        }
    };
}(jQuery, ui));
