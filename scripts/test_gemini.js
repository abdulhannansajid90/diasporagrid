const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testKey(apiKey) {
  try {
    console.log(`Testing key: ${apiKey.substring(0, 10)}...`);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Say hello");
    console.log(`SUCCESS: ${result.response.text()}`);
  } catch (err) {
    console.error(`ERROR for ${apiKey.substring(0, 10)}...:`, err.message);
  }
}

async function run() {
  await testKey(process.env.GEMINI_API_KEY || '');
}

run();
