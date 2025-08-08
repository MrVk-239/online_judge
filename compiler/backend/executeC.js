const { exec } = require('child_process');
const path = require('path');

const executeC = (filePath, inputFilePath) => {
  const jobId = path.basename(filePath).split('.')[0];
  const outputPath = path.join(__dirname, 'output', `${jobId}.out`);

  return new Promise((resolve, reject) => {
    const command = `gcc ${filePath} -o ${outputPath} && ${outputPath} < ${inputFilePath}`;

    exec(command, { timeout: 3000 }, (error, stdout, stderr) => { // 3 seconds limit
      if (error) {
        if (error.killed) {
          return reject("Error: Execution timed out (possible infinite loop).");
        }
        return reject(stderr || error.message);
      }
      return resolve(stdout);
    });
  });
};

module.exports = { executeC };
