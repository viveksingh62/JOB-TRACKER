import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();
const groq = new Groq({apiKey:process.env.GROQ_API_KEY })

export async function analyzeResume(resumeText, jobDescription) {
  const prompt = `You are a resume expert. Analyze this resume against the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY a valid JSON object. No extra text, no markdown, no explanation:
{
  "score": 75,
  "matchedKeywords": ["React", "Node.js"],
  "missingKeywords": ["Docker", "AWS"],
  "suggestions": [
    "Add Docker experience to your resume",
    "Mention any cloud platform experience"
  ],
  "summary": "One sentence overall assessment"
}`;

  const response = await groq.chat.completions.create({
model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  const text = response.choices[0].message.content;
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}