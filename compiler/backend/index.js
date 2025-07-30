const express = require('express');
const cors = require('cors');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCPP');
const { generateInputFile } = require('./generateInputFile');

const app=express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
    origin: FRONTEND_URL, 
    methods: ['GET', 'POST'],
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run",async(req,res)=>{
    const {language='cpp',code,input}=req.body;
    if(code===undefined){
        return res.status(404).json({success:false,error:"empty code"});
    }
    try {
        const filePath=generateFile(language,code);
        const inputFilePath=generateInputFile(input);
        const output=await executeCpp(filePath, inputFilePath);
        return res.json({filePath, inputFilePath, output});
    }
    catch(error){
        res.status(500).json({error:error});
    }
});

const PORT=process.env.PORT || 8000;
app.listen(PORT,(error)=>{
    if(error){
        console.error("Error starting server:", error);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});