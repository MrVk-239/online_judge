const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'output');
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath,inputFilePath) => {
    const jobID = path.basename(filePath).split('.')[0];
    const outPath = path.join(outputPath, `${jobID}.exe`);

    return new Promise((resolve, reject) => {
        const command = inputFilePath
  ? `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputFilePath}"`
  : `g++ "${filePath}" -o "${outPath}" && "${outPath}"`;


        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject({ error, stderr });
            }
            if (stderr) {
                console.error(stderr); 
            }
            resolve(stdout);
        });
    });
};

// Usage example (safe, absolute path)
const filePath = path.join(__dirname, 'codes', 'b946cd60-61e1-4c0a-bf62-e75fad426597.cpp');
executeCpp(filePath)
    .then(output => console.log("Program Output:\n", output))
    .catch(err => console.error("Compilation/Execution error:\n", err));

module.exports = { executeCpp };
