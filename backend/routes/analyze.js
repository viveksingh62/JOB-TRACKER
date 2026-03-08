import express from "express";
import multer from "multer";
import { analyzeResume } from "../services/groq.js";
import { extractTextfromPDF } from "../services/pdfParser.js";
import Application from "../models/Application.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.fields([{ name: "resume", maxCount: 1 }]),
  async (req, res) => {
    console.log("file:", req.file);
    console.log("body:", req.body);
    console.log("file:", req.file);
console.log("body:", req.body);
console.log("files:", req.files);  // add this line
    if (!req.files || !req.files["resume"]) {
      return res
        .status(400)
        .json({ error: 'No file uploaded - check field name is "resume"' });
    }
    try {
      const { jobTitle, company, jobDescription } = req.body;
      const resumeText = await extractTextfromPDF(
        req.files["resume"][0].buffer,
      );

      const analysis = await analyzeResume(resumeText, jobDescription);
      const application = await Application.create({
        jobTitle,
        company,
        jobDescription,
        score: analysis.score,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        suggestions: analysis.suggestions,
        summary: analysis.summary,
      });
      res.json({ success: true, data: application });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
