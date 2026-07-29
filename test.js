const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: "Hello",
    });

    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}

main();