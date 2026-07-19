import Express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const router = Express.Router();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body; 

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ status: false, message: "Invalid messages format" });
    }

    const completion = await openai.chat.completions.create({
      model: "thinkingmachines/inkling",
      messages: messages,
      temperature: 1,
      top_p: 0.95,
      max_tokens: 8192,
      stream: false
    });

    res.json({ status: true, reply: completion.choices[0]?.message?.content });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ status: false, message: "Something went wrong with the AI" });
  }
});

export default router;
