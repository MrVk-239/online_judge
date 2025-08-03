const { exec } = require('child_process');
const path = require('path');

const executeC = (filePath, inputFilePath) => {
  const jobId = path.basename(filePath).split('.')[0];
  const outputPath = path.join(__dirname, 'output', `${jobId}.out`);

  return new Promise((resolve, reject) => {
    const command = `gcc ${filePath} -o ${outputPath} && ${outputPath} < ${inputFilePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      return resolve(stdout);
    });
  });
};

module.exports = { executeC };
