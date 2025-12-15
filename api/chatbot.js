import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages } = req.body;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: messages,
    });

    const output =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "I'm here to help.";

    res.status(200).json({ output_text: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI server error" });
  }
}
