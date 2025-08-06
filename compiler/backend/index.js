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
  methods: ['GET', 'POST'],
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  const { language , code, input } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code" });
  }

  try {
    const filePath = generateFile(language, code);
    const inputFilePath = generateInputFile(input);

    let output;
    switch (language) {
      case 'cpp':
        output = await executeCpp(filePath, inputFilePath);
        break;
      case 'c':
        output = await executeC(filePath, inputFilePath);
        break;
      case 'python':
        output = await executePython(filePath, inputFilePath);
        break;
      case 'java':
        output = await executeJava(filePath, inputFilePath);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    return res.json({ output });
  } catch (error) {
    res.status(500).json({ error: 'compilation error' });
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
