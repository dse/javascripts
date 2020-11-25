/*jshint esversion: 6 */
/*global CSSStyleSheet, CSSRule, console, document */
class StylesheetIterator {
    constructor(doc) {
        this.document = doc;
    }
    toString(indent) {
        let result = '';
        Array.from(this.document.styleSheets /* StyleSheetList */).forEach((styleSheet, index) => {
            result += this.styleSheetToString(styleSheet, `document.styleSheets[${index}]`);
        });
        return result;
    }
    styleSheetToString(styleSheet, path) {
        let result = '';
        if (styleSheet.disabled) {
            result += '/* === DISABLED === */\n';
        }
        if (styleSheet.media) {
            let string = this.mediaListToString(styleSheet.media, path + '.media');
            if (string !== '@media' && string !== '@media ') {
                result += '/* === media list: ' + string + ' */\n';
            }
        }
        if (styleSheet.title) {
            result += '/* === title: ' + styleSheet.title + ' */\n';
        }
        if (styleSheet.type && styleSheet.type !== 'text/css') {
            result += '/* === type: ' + styleSheet.type + ' */\n';
        }
        if (styleSheet instanceof CSSStyleSheet) {
            try {
                if (styleSheet.cssRules) {
                    result += this.cssRuleListToString(styleSheet.cssRules, path + '.cssRules');
                }
            } catch (e) {
                result += `/* === ERROR: ${e.name}: ${e.message} === */\n`;
                result += `/*            at ${path} */\n`;
                if (styleSheet.href) {
                    result += `/*            href ${styleSheet.href} */\n`;
                } else {
                    result += `/*            no href */\n`;
                }
            }
        }
        return result;
    }
    mediaListToString(mediaList, path) {
        return '@media ' + mediaList.mediaText;
    }
    ownerRuleToString(ownerRule, path) {
        return '@import ' + ownerRule.href;
    }
    cssRuleListToString(rules, path) {
        let result = '';
        Array.from(rules).forEach((rule, index) => {
            result += this.cssRuleToString(rule, path + `[${index}]`);
        });
        return result;
    }
    cssRuleToString(rule, path) {
        switch (rule.type) {
        case CSSRule.STYLE_RULE:
            return this.cssStyleRuleToString(rule, path);
        case CSSRule.IMPORT_RULE:
            return this.cssImportRuleToString(rule, path);
        case CSSRule.MEDIA_RULE:
            return this.cssMediaRuleToString(rule, path);
        case CSSRule.FONT_FACE_RULE:
            return this.cssFontFaceRuleToString(rule, path);
        case CSSRule.PAGE_RULE:
            return this.cssPageRuleToString(rule, path);
        case CSSRule.KEYFRAMES_RULE:
            return this.cssKeyFramesRuleToString(rule, path);
        case CSSRule.KEYFRAME_RULE:
            return this.cssKeyFrameRuleToString(rule, path);
        case CSSRule.NAMESPACE_RULE:
            return this.cssNamespaceRuleToString(rule, path);
        case CSSRule.COUNTER_STYLE_RULE:
            return this.cssCounterStyleRuleToString(rule, path);
        case CSSRule.SUPPORTS_RULE:
            return this.cssSupportsRuleToString(rule, path);
        case CSSRule.DOCUMENT_RULE:
            return this.cssDocumentRuleToString(rule, path);
        case CSSRule.FONT_FEATURE_VALUES_RULE:
            return this.cssFontFeatureValuesRuleToString(rule, path);
        case CSSRule.VIEWPORT_RULE:
            return this.cssViewportRuleToString(rule, path);
        case CSSRule.REGION_STYLE_RULE:
            return this.cssRegionStyleRuleRuleToString(rule, path);
        case CSSRule.UNKNOWN_RULE:
            return this.cssUnknownRuleToString(rule, path);
        case CSSRule.CHARSET_RULE:
            return this.cssCharsetRuleToString(rule, path);
        }
        return `/* unknown CSS rule type ${rule.type} */\n`;
    }
    cssStyleRuleToString(rule, path) {
        const selectorText = rule.selectorText.replace(/, /g, ',\n');
        // return `${selectorText} {\n    ${rule.style.cssText}\n}\n`;

        let result = ``;
        result += `${selectorText} {\n`;

        let style = rule.style;
        for (let i = 0; i < style.length; i += 1) {
            let name = style[i];
            let value = style.getPropertyValue(name);
            let priority = style.getPropertyPriority(name);
            if (priority !== '') {
                priority = ' !' + priority;
            }
            result += `    ${name}: ${value}${priority};\n`;
        }

        result += `}\n`;
        return result;
    }
    cssImportRuleToString(rule, path) {
        let result = ``;
        result += `/* ${rule.cssText} */\n`;
        result += this.indent(this.styleSheetToString(rule.styleSheet, path + '.styleSheet'));
        result += `/* end @import */\n`;
        return result;
    }
    cssMediaRuleToString(rule, path) {
        let result = '';
        result += `@media ${rule.media.mediaText} {\n`;
        result += this.indent(this.cssRuleListToString(rule.cssRules, path + '.cssRules'));
        result += `}\n`;
        return result;
    }
    cssFontFaceRuleToString(rule, path) {
        let result = '';
        let cssText = this.multiLine(rule.cssText);
        result += cssText + `\n`;
        return result;
    }
    cssPageRuleToString(rule, path) {
        let result = '';
        let cssText = this.multiLine(rule.cssText);
        result += cssText + `\n`;
        return result;
    }
    cssKeyFramesRuleToString(rule, path) {
        let result = '';
        let cssText = this.multiLine(rule.cssText);
        result += cssText + `\n`;
        return result;
    }
    cssKeyFrameRuleToString(rule, path) {
        return `/* CSSRule.KEYFRAME_RULE at ${path} */\n`;
    }
    cssNamespaceRuleToString(rule, path) {
        return `/* CSSRule.NAMESPACE_RULE at ${path} */\n`;
    }
    cssCounterStyleRuleToString(rule, path) {
        return `/* CSSRule.COUNTER_STYLE_RULE at ${path} */\n`;
    }
    cssSupportsRuleToString(rule, path) {
        let result = '';
        result += `@supports ${'???'} {\n`;
        result += this.indent(this.cssRuleListToString(rule.cssRules, path + '.cssRules'));
        result += '}\n';
        return result;
    }
    cssDocumentRuleToString(rule, path) {
        return `/* CSSRule.DOCUMENT_RULE at ${path} */\n`;
    }
    cssFontFeatureValuesRuleToString(rule, path) {
        return `/* CSSRule.FONT_FEATURE_VALUES_RULE at ${path} */\n`;
    }
    cssViewportRuleToString(rule, path) {
        return `/* CSSRule.VIEWPORT_RULE at ${path} */\n`;
    }
    cssRegionStyleRuleRuleToString(rule, path) {
        return `/* CSSRule.REGION_STYLE_RULE at ${path} */\n`;
    }
    cssUnknownRuleToString(rule, path) {
        return `/* CSSRule.UNKNOWN_RULE at ${path} */\n`;
    }
    cssCharsetRuleToString(rule, path) {
        return `/* CSSRule.CHARSET_RULE at ${path} */\n`;
    }
    indent(text) {
        return text.replace(/^/gm, '    ').replace(/[\s\r\n]+$/, '') + "\n";
    }
    multiLine(text) {
        return text
            .replace(/^\s*/gm, '    ')
            .replace(/^    /, '')
            .replace(/\s+\{\s+/, ' {\n    ')
            .replace(/\s+\}\s*$/, '\n}');
    }
}

console.log(new StylesheetIterator(document).toString());
