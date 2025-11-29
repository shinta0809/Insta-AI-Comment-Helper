const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generateComments(caption, tone = 'friendly', length = 'short') {
    try {
        const prompt = `
      Instagram Post Caption: "${caption}"
      
      Task: Generate 3-5 natural, engaging comments for this post in Korean.
      Tone: ${tone}
      Length: ${length}
      
      Constraints:
      - Do not sound like a bot or spam.
      - Use emojis naturally.
      - Return the result as a JSON array of strings.
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" }, // Ensure JSON output
        });

        const content = completion.choices[0].message.content;
        const parsed = JSON.parse(content);

        // Expecting { "comments": [...] } or just an array
        if (parsed.comments && Array.isArray(parsed.comments)) {
            return parsed.comments;
        } else if (Array.isArray(parsed)) {
            return parsed;
        } else {
            // Fallback parsing if structure is different
            return ["와! 멋져요!", "좋은 하루 되세요!", "사진 잘 찍으셨네요!"];
        }

    } catch (error) {
        console.error('Error generating comments:', error);
        throw new Error('Failed to generate comments');
    }
}

module.exports = { generateComments };
