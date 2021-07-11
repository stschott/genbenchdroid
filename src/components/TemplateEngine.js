const hb = require('handlebars');
const formatJS = require('js-beautify').js;
const formatXML = require('xml-formatter');
const ConfigHandler = require('./ConfigHandler');

class TemplateEngine {
    templateString;
    manifestTemplateString;
    layoutTemplateString;
    classes = [];
    
    constructor(template) {
        this.templateString = template.template;
        this.layoutTemplateString = template.layout;
        const manifestTemplate = template.manifest;
        
        const manifestTemplateScript = hb.compile(manifestTemplate, { noEscape: true });

        const projectName = new ConfigHandler().get('projectName');
        const initialModule = {
            project: `"${projectName}"`,
            permissions: '{{ permissions }}',
            components: '{{ components }}'
        };
        this.manifestTemplateString = manifestTemplateScript(initialModule);
    }

    insertModule(module) {
        const templateOptions = { noEscape: true };
        const templateScript = hb.compile(this.templateString, templateOptions);
        this.templateString = templateScript(module);

        const manifestTemplateScript = hb.compile(this.manifestTemplateString, templateOptions);
        this.manifestTemplateString = manifestTemplateScript(module);

        const layoutTemplateScript = hb.compile(this.layoutTemplateString, templateOptions);
        this.layoutTemplateString = layoutTemplateScript(module);
    }

    finishSourceGeneration() {
        this._cleanTemplate();
        this._beautifyTemplate();
        this._splitClasses();
    }

    getSourceContents() {
        return {
            manifest: this.manifestTemplateString,
            layout: this.layoutTemplateString,
            classes: this.classes
        };
    }

    createLinenumberLookup() {
        const linenumberLookup = {};
        const statementIdRegex = new RegExp('statementId: ', 'gm');
        
        this.classes.forEach(singleClass => {
            const indexes = [];
            while (statementIdRegex.exec(singleClass.classContent)) {
                indexes.push(statementIdRegex.lastIndex);
            }

            indexes.forEach(index => {
                const stringStart = singleClass.classContent.substring(0, index);
                const stringEnd = singleClass.classContent.substring(index);
                const statementId = stringEnd.substring(0, stringEnd.indexOf('\n'));
                const lineCount = stringStart.split('\n').length;

                linenumberLookup[statementId] = lineCount;
            });
        });

        return linenumberLookup;
    };

    _cleanTemplate() {
        const placeholderRegex = /{{.*}}/g;
        this.templateString = this.templateString.replace(placeholderRegex, '');
        this.manifestTemplateString = this.manifestTemplateString.replace(placeholderRegex, '');
        this.layoutTemplateString = this.layoutTemplateString.replace(placeholderRegex, '');
    }

    _beautifyTemplate() {
        this.templateString = formatJS(this.templateString, { 
            indent_size: 2, 
            space_in_empty_paren: true, 
            max_preserve_newlines: 2 
        });
        this.manifestTemplateString = formatXML(this.manifestTemplateString);
        this.layoutemplateString = formatXML(this.layoutTemplateString);
    }

    _splitClasses() {
        const classRegex = /((public|private|protected)\s+)*(abstract\s+)*class\s+(\w+)\s+((extends\s+\w+)|(implements\s+\w+( ,\w+)*))?\s*.*\{/g;
        const projectName = new ConfigHandler().get('projectName');
        let classes = [];
        const matches = [...this.templateString.matchAll(classRegex)];
        const imports = this.templateString.substring(0, matches[0].index -2);
            
        matches.forEach((match, idx) => {
            if (matches[idx+1]) {
                classes.push({ className: match[4], classContent: this.templateString.substring(match.index, matches[idx+1].index -1) });
            } else {
                classes.push({ className: match[4], classContent: this.templateString.substring(match.index, this.templateString.length) });
            }
        });

        classes.forEach(element => {
            this.classes.push({
                className: element.className,
                classContent: `package ${projectName};\n\n${imports}\n\n${element.classContent}`
            });
        });
    }

    log() {
        console.log('\x1b[33m%s\x1b[0m', '--------- SOURCE CODE --------');
        console.log(this.templateString);
        console.log('\x1b[33m%s\x1b[0m', '--------- ANDROID MANIFEST --------');
        console.log(this.manifestTemplateString);
        console.log('\x1b[33m%s\x1b[0m', '--------- LAYOUT --------');
        console.log(this.layoutTemplateString);
    }
}

module.exports = TemplateEngine;