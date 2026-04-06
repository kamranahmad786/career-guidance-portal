const dotenv = require('dotenv');
const path = require('path');
// No SDK needed, just raw HTTPS
const https = require('https');

dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
const model = "gemini-1.5-flash"; // Let's try the newest one
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const data = JSON.stringify({
  contents: [{ parts: [{ text: "Hello" }] }]
});

console.log("-----------------------------------------");
console.log("DEEP DEBUG: RAW REST API TEST");
console.log("URL:", url.replace(apiKey, "HIDDEN_KEY"));
console.log("-----------------------------------------");

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(url, options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log("HTTP STATUS:", res.statusCode);
    try {
        const json = JSON.parse(body);
        console.log("FULL RESPONSE:", JSON.stringify(json, null, 2));
        
        if (res.statusCode === 404) {
            console.log("\n[DIAGNOSIS]: MODEL NOT FOUND.");
            console.log("1. Check if 'Generative Language API' is enabled in Google Cloud Console.");
            console.log("2. Ensure your API Key is from 'aistudio.google.com' (easiest for testing).");
        }
    } catch (e) {
        console.log("RAW BODY:", body);
    }
  });
});

req.on('error', (e) => {
  console.error("NETWORK ERROR:", e.message);
});

req.write(data);
req.end();
