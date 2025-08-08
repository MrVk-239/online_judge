const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'output');
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath, inputFilePath) => {
    const jobID = path.basename(filePath).split('.')[0];
    const outPath = path.join(outputPath, `${jobID}.exe`);

    return new Promise((resolve, reject) => {
        const command = inputFilePath
            ? `g++ "${filePath}" -o "${outPath}" && timeout 2 "${outPath}" < "${inputFilePath}"`
            : `g++ "${filePath}" -o "${outPath}" && timeout 2 "${outPath}"`;

        exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed || error.signal === 'SIGTERM') {
                    return reject({ type: 'timeout', message: 'Time Limit Exceeded' });
                }
                return reject({ type: 'compilation', message: stderr || error.message });
            }
            if (stderr) {
                return reject({ type: 'runtime', message: stderr });
            }
            resolve(stdout);
        });
    });
};

module.exports = { executeCpp };
