const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

exports.readData = async function(filePath) {
    let fileContent = await readFile(filePath, "utf8");
    return fileContent.toString();
}

exports.writeData = async function(filePath, data) {
  try {
    await writeFile(filePath, data);
    
  } catch (err) {
    console.error(err);
  }
}

exports.appendData = async function(filePath, data) {
  try {
    await appendFile(filePath, data);
    
  } catch (err) {
    console.error(err);
  }
}
