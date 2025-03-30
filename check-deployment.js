const fs = require('fs');
console.log("Current working directory: ", process.cwd());
console.log("Contents of project directory:");
console.log(fs.readdirSync('.'));  // list contents of the current directory
console.log("Contents of 'src' directory:");
console.log(fs.readdirSync('./src'));  // list contents of the 'src' directory
