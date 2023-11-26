/**
 * Converts a relative file path to an absolute file path
 * @param {string} relative - The relative file path
 * @returns {URL} - The absolute file path
 */
function relativeToAbsolutePath(relative) {
    return new URL(relative, window.location.href).href;
}

/**
 * Ash Ketchum -> Ash K.
 * @param {string} name 
 * @returns The abbreviated name.
 */
function abbreviateName(name){
    return name.substring(0, name.indexOf(' ')+2)+'.' 
}

function abridgeWord(word) {
    if (word.length > 25) {
      return word.substr(0, 11) + '...' + word.substr(word.length-11, word.length);
    }
    return word;
  }

/**
 * Loads a File from the File API.
 * @param {File} file - The file to load.
 * @returns {Promise<string>}
 */
function loadFile(file){
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');
    // here we tell the reader what to do when it's done reading...
    const promise = new Promise((resolve, reject) =>
    reader.onload = readerEvent => {
        try{
            const content = readerEvent.target.result;
            resolve(content);
        }catch(e){
            reject(e);
        }
    });
    return promise;
}

/**
 * Watches a file from the FileSystemAPI, and executes a callback when that file changes.
 * @param {FileSystemFileHandle} fileHandle - The file to watch.
 * @param {function(File)} onChange - The function to execute on the file when it changes.
 * @param {number} [interval=2000] - The frequency to chekc for updates, in milliseconds. 
 */
function watchFile(fileHandle, onChange, interval = 2000){
    let oldFile = undefined;
    const timer = window.setInterval(async () => {
        const file = await fileHandle.getFile();
        if(oldFile !== file){
            await onChange(file);
        }
        oldFile = file;
    }, interval);
    return timer;
}
