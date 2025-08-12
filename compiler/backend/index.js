const express = require('express');
const cors = require('cors');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executeC } = require('./executeC');
const { executePython } = require('./executePython');
const { executeJava } = require('./executeJava');
const { generateInputFile } = require('./generateInputFile');

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  const { language, code, input } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code" });
  }
  try {
    const filePath = generateFile(language, code);
    const inputFilePath = generateInputFile(input);

    let output;
    const execWithTimeout = async (fn) => {
      return await Promise.race([
        fn(filePath, inputFilePath),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Execution timed out (possible infinite loop)")), 3000)
        )
      ]);
    };

    switch (language) {
      case 'cpp':
        output = await execWithTimeout(executeCpp);
        break;
      case 'c':
        output = await execWithTimeout(executeC);
        break;
      case 'python':
        output = await execWithTimeout(executePython);
        break;
      case 'java':
        output = await execWithTimeout(executeJava);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    return res.json({ output });
  } catch (error) {
    return res.status(500).json({
      error: error.message === "Execution timed out (possible infinite loop)"
        ? error.message
        : "Compilation/Runtime error"
    });
  }
});


const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("🚀 Online Compiler API is running!");
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server:", error);
  } else {
    console.log(`✅ Server is running on port ${PORT}`);
  }
});
