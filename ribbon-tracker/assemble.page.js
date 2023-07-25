const fs = require('fs'); 
const path = require('path');
const { JSDOM } = require('jsdom');
const { Ribbons } = require('./js/ribbons.data')

class Usecase {
    /**
     * General-purpose usecase for cloning a webpage after doing arbitrary DOM manipulation
     * @param {*} dir the directory to read from
     * @param {*} template the file to manipulate
     * @param {*} fileName output file name
     * @returns string of the manipulated DOM
     */
    log = console;
    async execute(dir, template, fileName){
        let readPath = "";
        let writePath = "";
        let output = "";
        try{
            readPath = path.join(dir, template);
            this.log.log(`doing output insertion for template at: [${readPath}]`);
            const buffer = fs.readFileSync(readPath);
            output = buffer.toString();
        }catch(e){
            this.log.error(`cannot read template file from path: [${readPath}] with error: ${e}`);
            return output;
        }
        let dom = new JSDOM(output);
        for(var ribbon of Ribbons.ribbons){
            const div = dom.window.document.createElement('div');
            div.innerHTML = ribbon.name;
            dom.window.document.getElementById('container').appendChild(div);

            this.log.log(ribbon.name);
        }
        dom.window.document.getElementById
        output = dom.serialize();
        try{
            writePath = path.join(dir, fileName)
            fs.writeFileSync(writePath, output);
        }catch(e){
            this.log.error(`cannot write new file to path: [${writePath}] with error: ${e}`);
            return output;
        }
        this.log.log(`content insertion successful, written to: [${writePath}]`)
        return output;
    }
}

module.exports.Usecase = Usecase;