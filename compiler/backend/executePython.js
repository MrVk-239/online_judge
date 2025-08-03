const { exec } = require('child_process');

const executePython = (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    const command = `python ${filePath} < ${inputFilePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      return resolve(stdout);
    });
  });
};

module.exports = { executePython };
