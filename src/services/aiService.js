export const generateAIAnswer = async (question, language = "English") => {
  const API_TOKEN = 'YOUR_HF_TOKEN';
  const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: JSON.stringify({ inputs: `Explain ${question} in ${language}:` }),
  });
  const data = await response.json();
  return data[0]?.generated_text || 'Error generating answer';
};