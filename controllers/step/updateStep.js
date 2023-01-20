const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

exports.readData = async function(filePath) {
    let fileContent = await readFile(filePath, "utf8");
    return fileContent.toString();
}

exports.writeData = async function(filePath, data) {
  try {
    await writeFile(filePath, data);
    
    // Debug for if function is running
    //console.log(`Data written to ${filePath}`);
  } catch (err) {
    console.error(err);
  }
}
