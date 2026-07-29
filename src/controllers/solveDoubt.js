const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
    try {
        const {
            messages,
            title,
            description,
            testCases,
            startCode
        } = req.body;

        // Check API Key
        if (!process.env.GEMINI_KEY) {
            return res.status(500).json({
                message: "Gemini API key is missing."
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",

            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `
## Problem Title
${title}

## Problem Description
${description}

## Sample Test Cases
${JSON.stringify(testCases, null, 2)}

## Starter Code
${JSON.stringify(startCode, null, 2)}

## User Question
${
    typeof messages === "string"
        ? messages
        : JSON.stringify(messages, null, 2)
}
`
                        }
                    ]
                }
            ],

            config: {
                systemInstruction: `
You are an expert Data Structures and Algorithms (DSA) tutor.

Your job is to help the user ONLY with the current coding problem.

==========================
YOUR RESPONSIBILITIES
==========================

1. Give hints without immediately revealing the solution.
2. Review and debug submitted code.
3. Explain algorithms and data structures.
4. Compare different approaches.
5. Analyze time and space complexity.
6. Generate additional edge test cases.
7. Explain why an approach works.

==========================
WHEN USER ASKS FOR HINTS
==========================

- Give small hints progressively.
- Do not reveal the entire algorithm immediately.
- Ask guiding questions.
- Help build intuition.

==========================
WHEN USER SHARES CODE
==========================

- Find logical errors.
- Find syntax errors.
- Explain every mistake.
- Suggest optimizations.
- If necessary, provide corrected code with explanation.

==========================
WHEN USER ASKS FOR SOLUTION
==========================

Provide:

1. Approach
2. Intuition
3. Algorithm
4. Clean code
5. Dry run
6. Time Complexity
7. Space Complexity

==========================
RESPONSE STYLE
==========================

- Be concise.
- Use markdown.
- Use bullet points.
- Format code properly.
- Explain using examples whenever possible.

==========================
STRICT RULES
==========================

Only answer questions related to the current DSA problem.

If the user asks anything unrelated (Web Development, DBMS, OS, Networking, AI, etc.), reply ONLY:

"I can only help with the current DSA problem. Please ask something related to this problem."

Never answer unrelated questions.

Always encourage understanding instead of memorization.
`
            }
        });

        return res.status(200).json({
            success: true,
            message: response.text
        });

    } catch (err) {
        console.error("Gemini Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

module.exports = solveDoubt;