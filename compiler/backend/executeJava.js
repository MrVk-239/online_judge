const { exec } = require('child_process');

const executeJava = (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    const command = `java ${filePath} < ${inputFilePath}`;
    exec(command, { timeout: 2000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) {
          return reject('Error: Execution timed out (possible infinite loop)');
        }
        return reject(stderr || error.message);
      }
      return resolve(stdout);
    });
  });
};

module.exports = { executeJava };