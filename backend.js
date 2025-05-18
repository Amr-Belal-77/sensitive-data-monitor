import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

// Load environment variables from the .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Define __dirname in ES Modules environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Create HTTPS agent with keep-alive enabled
const httpsAgent = new https.Agent({ keepAlive: true });

// Endpoint to handle chat requests
app.post("/chat", async (req, res) => {
  let userMessage = req.body.message;

  // Check if the message starts with "Allow,"
  const isAllowed = userMessage.startsWith("Allow,");

  // If not allowed and contains the word "password"
  if (!isAllowed && userMessage.toLowerCase().includes("password")) {
    return res.json({
      reply: "⚠️ This message was blocked because it contains a prohibited word like 'password'.",
    });
  }

  // If allowed, remove "Allow,"
  if (isAllowed) {
    userMessage = userMessage.replace(/^Allow,/, "").trim();
  }

  try {
    const start = Date.now();

    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 200 // Optional: Reduce token count for faster response
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        httpsAgent,
      }
    );

    const end = Date.now();
    console.log(`⏱️ DeepSeek Response Time: ${end - start} ms`);

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Error connecting to DeepSeek API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get a response from the DeepSeek API." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
