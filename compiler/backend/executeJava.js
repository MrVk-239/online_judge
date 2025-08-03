const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const executeJava = (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    const className = path.basename(filePath, '.java');

    const runCommand = `java ${filePath} < ${inputFilePath}`;

    exec(`${runCommand}`, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      return resolve(stdout);
    });
  });
};

module.exports = { executeJava };
