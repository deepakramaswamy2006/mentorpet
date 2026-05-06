const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

exports.getChatCompletion = async (messages, model = 'llama-3.3-70b-versatile') => {
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 1,
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.error('Groq API Error:', err);
    throw new Error('AI Service Error');
  }
};
