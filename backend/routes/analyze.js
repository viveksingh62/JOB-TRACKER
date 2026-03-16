import express from "express";
import multer from "multer";
import { analyzeResume } from "../services/groq.js";
import { extractTextfromPDF } from "../services/pdfParser.js";
import Application from "../models/Application.js";
import rateLimit from "express-rate-limit";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.fields([{ name: "resume", maxCount: 1 }]),
  async (req, res) => {
    // console.log("file:", req.file);
    // console.log("body:", req.body);
    // console.log("file:", req.file);
    // console.log("body:", req.body);
    // console.log("files:", req.files); // add this line
    if (!req.files || !req.files["resume"]) {
      return res
        .status(400)
        .json({ error: 'No file uploaded - check field name is "resume"' });
    }
    try {
      const { jobTitle, company, jobDescription } = req.body;
      
      if (!jobTitle || !jobTitle.trim()) {
        return res.status(400).json({ error: "Job title is required" });
      }
      if (!jobDescription || !jobDescription.trim()) {
        return res.status(400).json({ error: "Job description is required" });
      }
      if (jobDescription.trim().length < 50) {
        return res
          .status(400)
          .json({ error: "Job description is too short, paste the full JD" });
      }
      // const resumeText = await extractTextfromPDF(
      //   req.files["resume"][0].buffer,
      // );
    const cacheKey = `${req.files['resume'][0].originalname}-${req.files['resume'][0].size}`;
    let resumeText;
    const cached = await Application.findOne({cacheKey}).select('resumeText');
    if(cached &&  cached.resumeText){
       console.log('Using cached resume text');
      resumeText = cached.resumeText;
    }else{
      console.log('Parsing PDF fresh');
      resumeText  = await extractTextfromPDF(req.files['resume'][0].buffer);
    }

      const analysis = await analyzeResume(resumeText, jobDescription);
      const application = await Application.create({
        jobTitle,
        company,
        jobDescription,
        cacheKey,
        resumeText,
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

// export const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   message: { error: "Too many requests, try again later" }
// });
// export const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { error: "Server busy, try later" }
// });

export default router;
