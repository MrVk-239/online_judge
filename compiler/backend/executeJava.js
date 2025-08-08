const { exec } = require('child_process');
const path = require('path');

const executeJava = (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    const className = path.basename(filePath, '.java');

    // Compile first
    exec(`javac ${filePath}`, { cwd: dir }, (compileErr, compileStdout, compileStderr) => {
      if (compileErr) {
        return reject(compileStderr || compileErr.message);
      }

      // Run with timeout (e.g., 3 seconds)
      const runCommand = `java ${className} < ${inputFilePath}`;
      exec(runCommand, { cwd: dir, timeout: 3000 }, (error, stdout, stderr) => {
        if (error) {
          if (error.killed) {
            return reject('Error: Program timed out (possible infinite loop)');
          }
          return reject(stderr || error.message);
        }
        resolve(stdout);
      });
    });
  });
};

module.exports = { executeJava };
