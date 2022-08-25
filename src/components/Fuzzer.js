const { Parser, Grammar } = require('nearley');
const Unparse = require('nearley/lib/unparse');
const ConfigError = require('./Errors/ConfigError');

class Fuzzer {
    forbidden = [];
    parser = null;
    grammarRaw = null;
    grammar = null;

    constructor(pathToGrammar, forbidden) {
        this.grammarRaw = require(pathToGrammar);
        this.grammar = Grammar.fromCompiled(this.grammarRaw);
        this.parser = new Parser(this.grammar);
        this.forbidden = forbidden;
    }

    verify(string) {
        try {
            this.parser.feed(string);
            return this.parser.results.length > 0;
        } catch (err) {
            return false;    
        }
    }

    fuzz({ maxLength = 25, minLength = 0, taintflow = false, contains = [], ignore = [], priorities = [] } = {}) {
        // Get rules that should be prioritized
        const prioRules = this._findPrioritizedRules(this.grammar, priorities);
        for (let i = 0; i < 5000; i++) {
            let fuzzString = this._customUnparse(this.grammar, 'start', maxLength, minLength, prioRules);
            // get right parenthesis format
            fuzzString = fuzzString
                .replace(/\(/g, ' ( ')
                .replace(/\)/g, ' ) ')
                .replace(/\s\s+/g, ' ')
                .trim();
            const config = fuzzString.split(' ');

            // contains check
            let configContainsAllStrings = true;
            contains.forEach(containString => {
                if (!config.find(elem => elem.toLowerCase().includes(containString.toLowerCase()))){
                    configContainsAllStrings = false;
                }
            });

            if (!configContainsAllStrings) {
                continue;
            }

            // ignore check
            let configContainsNoUndesiredString = true;
            ignore.forEach(ignoreString => {
                if (config.find(elem => elem.toLowerCase().includes(ignoreString.toLowerCase()))){
                    configContainsNoUndesiredString = false;
                }
            });

            if (!configContainsNoUndesiredString) {
                continue;
            }

            if(this._isForbidden(config)) {
                continue;
            }

            if (taintflow && this._checkFlow(config)) {
                return fuzzString;
            } else if (!taintflow) {
                return fuzzString;
            }
            
        }
        return false;
    }

    _findPrioritizedRules(grammar, priorities) {
        const prioList = [];
        priorities.forEach((module, idx) => {
            if (idx % 2 === 0) {
                const prioSymbolRules = grammar.rules
                    .filter(rule => rule.symbols
                        .map(symbol => symbol.literal)
                        .join('')
                        .toLowerCase()
                        .includes(module.toLowerCase())
                    );
                prioSymbolRules.forEach(rule => {
                    prioList.push({ name: rule.name, value: priorities[idx+1] });
                });
            }
        });
        return prioList;
    }

    _customUnparse(grammar, start, maxLength, minLength, priorities) {
        if (maxLength < minLength) {
            throw new ConfigError("The provided maximum length is smaller than the minimum length");
        }

        let output = "";
        let currentLength = 0;
        const stack = [start];

        while (stack.length > 0) {
            const currentname = stack.pop();
            if (typeof currentname === 'string') {

                const goodrules = [];

                grammar.rules.forEach(rule => {
                    // if not applicable rule return
                    if (rule.name !== currentname) return;

                    // check priorities
                    priorities.forEach(priority => {
                        
                        if (!rule.symbols.includes(priority.name)) return;

                        // if rule with priority add n-1 times to stack, since will be added once at end of loop
                        for (let i = 1; i < priority.value; i++) {
                            goodrules.push(rule);
                        }

                        return;  
                    });

                    // if rule applicable add to stack
                    goodrules.push(rule);
                    
                });

                if (goodrules.length <= 0) {
                    throw new Error("Nothing matches rule: "+currentname+"!");
                }

                let acceptableRule = false;
                let chosen = null;
                while (!acceptableRule) {
                    acceptableRule = false;
                    chosen = goodrules[Math.floor(Math.random() * goodrules.length)];

                    // check if we still need to continue producing modules
                    if (currentLength < minLength) {
                        
                        // if we have a 'start', 'linear' or 'innerModule' symbol (can contain either another module or empty word)
                        // make sure that only the version that contains a module is accepted
                        if (chosen.name === 'start' || chosen.name === 'linear' || chosen.name === 'innerModule') {
                            acceptableRule = chosen.symbols.includes('module');
                        } else {
                            // if it is another symbol simply accept
                            acceptableRule = true;
                        } 
                    } else if (currentLength < maxLength) {
                        // if we still have not reached the maximum length accept 
                        acceptableRule = true;
                    }

                    // if maxium length is reached do not choose symbols that produce more modules
                    if (currentLength >= maxLength) {
                        acceptableRule = !chosen.symbols.includes('module');
                    } 

                    // if we add a module increment the counter
                    if (chosen.symbols.includes('module')) {
                        currentLength++;
                    }
                }
                
                for (let i=chosen.symbols.length-1; i>=0; i--) {
                    stack.push(chosen.symbols[i]);
                }
                
            } else if (currentname.literal) {
                output += currentname.literal;
                continue;
            }
        }
        return output;
    }

    _checkFlow(config) {
        let parenCount = 0;
        let containsGlobalSource = false;
        let localSource = [];
        let containsFlow = false;

        config.forEach(module => {
            const lowerCaseModule = module.toLowerCase();
            if (module === '(') {
                parenCount++;
            } else if (module === ')') {
                parenCount--;
                if (parenCount < localSource[localSource.length-1]) {
                    localSource.pop();
                }
            } else if (lowerCaseModule.includes('source') && parenCount === 0) {
                containsGlobalSource = true;
            } else if (lowerCaseModule.includes('source') && parenCount > 0) {
                localSource.push(parenCount);
            } else if (lowerCaseModule.includes('sink') && (containsGlobalSource || localSource.length > 0)) {
                containsFlow = true;
            } 
        });
        return containsFlow;
    }

    // Check module combinations that are forbidden in the config
    _isForbidden(config) {
        const forbiddenLookup = {}; 
        
        // Create a lookup of forbidden pairings
        this.forbidden.forEach(rule => forbiddenLookup[rule.from.toLowerCase()] = rule.to.toLowerCase());

        for (let i = 0; i < config.length; i++) {
            const lowerCaseModule1 = config[i].toLowerCase();

            if (!forbiddenLookup[lowerCaseModule1]) continue;

            const config2 = config.slice(i + 1, config.length);
            let parenCount = 0;
            for (let j = 0; j < config2.length; j++) {
                const lowerCaseModule2 = config2[j].toLowerCase();
                if (lowerCaseModule2 === forbiddenLookup[lowerCaseModule1]) {
                    return true;
                } else if (lowerCaseModule2 === '(') {
                    parenCount++;
                } else if (lowerCaseModule2 === ')') {
                    parenCount--;
                    if (parenCount < 0) break;
                }
            }


        }
        return false;
    }
}

module.exports = Fuzzer;