const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTest = [
    'gemini-flash-lite-latest',
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.5-flash'
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`SUCCESS: ${modelName} -> ${result.response.text()}`);
      return; // Stop on first success
    } catch (e) {
      console.log(`FAILED: ${modelName} -> ${e.message.substring(0, 100)}...`);
    }
  }
}
testModels();
