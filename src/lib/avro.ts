import data from './pattern';

interface RuleMatch {
    type: 'prefix' | 'suffix';
    scope: string;
    value?: string;
    negative?: boolean;
}
interface Rule {
    matches: RuleMatch[];
    replace: string;
}
interface Pattern {
    find: string;
    replace: string;
    rules?: Rule[];
}
interface AvroPhoneticData {
    patterns: Pattern[];
    vowel: string;
    consonant: string;
    casesensitive: string;
}

const AvroPhonetic = {
    parse(input: string): string {
        const fixed = this.fixString(input);
        let output = "";
        for (let cur = 0; cur < fixed.length; ++cur) {
            const start = cur;
            let end = cur + 1, prev = start - 1;
            let matched = false;

            for (let i = 0; i < this.data.patterns.length; ++i) {
                const pattern = this.data.patterns[i];
                end = cur + pattern.find.length;
                if (end <= fixed.length && fixed.substring(start, end) === pattern.find) {
                    prev = start - 1;
                    if (pattern.rules) {
                        for (let j = 0; j < pattern.rules.length; ++j) {
                            const rule = pattern.rules[j];
                            let replace = true;

                            let chk = 0;
                            for (let k = 0; k < rule.matches.length; ++k) {
                                // Clone match to avoid mutating pattern data
                                const match = { ...rule.matches[k] };

                                if (match.type === "suffix") {
                                    chk = end;
                                } else {
                                    chk = prev;
                                }

                                // Handle Negative
                                if (typeof match.negative === 'undefined') {
                                    match.negative = false;
                                    if (match.scope.charAt(0) === '!') {
                                        match.negative = true;
                                        match.scope = match.scope.substring(1);
                                    }
                                }

                                // Handle empty value
                                if (typeof match.value === 'undefined') match.value = '';

                                // Beginning
                                if (match.scope === "punctuation") {
                                    if (!((((chk < 0) && (match.type === "prefix")) ||
                                        ((chk >= fixed.length) && (match.type === "suffix")) ||
                                        this.isPunctuation(fixed.charAt(chk))) !== !!match.negative)) {
                                        replace = false;
                                        break;
                                    }
                                }
                                // Vowel
                                else if (match.scope === "vowel") {
                                    if (!((((chk >= 0 && (match.type === "prefix")) ||
                                        (chk < fixed.length && (match.type === "suffix"))) &&
                                        this.isVowel(fixed.charAt(chk))) !== !!match.negative)) {
                                        replace = false;
                                        break;
                                    }
                                }
                                // Consonant
                                else if (match.scope === "consonant") {
                                    if (!((((chk >= 0 && (match.type === "prefix")) ||
                                        (chk < fixed.length && (match.type === "suffix"))) &&
                                        this.isConsonant(fixed.charAt(chk))) !== !!match.negative)) {
                                        replace = false;
                                        break;
                                    }
                                }
                                // Exact
                                else if (match.scope === "exact") {
                                    let s, e;
                                    if (match.type === "suffix") {
                                        s = end;
                                        e = end + match.value.length;
                                    } else {
                                        s = start - match.value.length;
                                        e = start;
                                    }
                                    if (!this.isExact(match.value, fixed, s, e, !!match.negative)) {
                                        replace = false;
                                        break;
                                    }
                                }
                            }

                            if (replace) {
                                output += rule.replace;
                                cur = end - 1;
                                matched = true;
                                break;
                            }
                        }
                    }
                    if (matched) break;

                    // Default
                    output += pattern.replace;
                    cur = end - 1;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                output += fixed.charAt(cur);
            }
        }
        return output;
    },
    fixString(input: string): string {
        let fixed = '';
        for(let i=0; i < input.length; ++i) {
            const cChar = input.charAt(i);
            if(this.isCaseSensitive(cChar)) {
                fixed += cChar;
            } else {
                fixed += cChar.toLowerCase();
            }
        }
        return fixed;
    },
    isVowel(c: string): boolean {
        return (this.data.vowel.indexOf(c.toLowerCase()) >= 0);
    },
    isConsonant(c: string): boolean {
        return (this.data.consonant.indexOf(c.toLowerCase()) >= 0);
    },
    isPunctuation(c: string): boolean {
        return (!(this.isVowel(c) || this.isConsonant(c)));
    },
    isExact(needle: string, heystack: string, start: number, end: number, not: boolean): boolean {
        // Fix: Use bitwise XOR with 1 for boolean, and ensure correct boolean return
        return Boolean((start >= 0 && end <= heystack.length && (heystack.substring(start, end) === needle)) !== not);
    },
    isCaseSensitive(c: string): boolean {
        return (this.data.casesensitive.indexOf(c.toLowerCase()) >= 0);
    },
    data: data as AvroPhoneticData
};

export default AvroPhonetic;
