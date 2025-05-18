# <img src="./icon.png" alt="icon" width="100"/> Sensitive Data Chat Monitor


A lightweight web-based chat monitor built to **prevent employees from accidentally leaking sensitive data** such as passwords in internal chat tools. This app acts as a safeguard, blocking risky messages unless explicitly overridden by the user.

## 🚀 Features

- ✅ **Automatic Blocking** of messages containing sensitive words like `"password"` unless prefixed with `Allow,`.
- 💬 **Interactive Chat UI** with bot response simulation and typing indicators.
- 📂 **Chat History Panel** to review previous sessions.
- 🧠 **LLM Integration** via DeepSeek API for generating intelligent responses.
- 📊 **Response Time Logging** for performance monitoring.

## 🧑‍💻 Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript  
- **Backend:** Node.js, Express  
- **API:** DeepSeek Chat API  
- **Styling:** Custom CSS, responsive layout with animations  

## 📦 Folder Structure

```
.
├── backend.js        # Express backend with validation logic
├── frontend.js       # Handles frontend interactivity
├── index.html        # Main chat UI
├── icon.png          # App icon/logo
└── .env              # API key and environment config (DO NOT COMMIT)
```

## 🛡️ Message Protection Logic

- Any message containing `"password"` is blocked unless it starts with `Allow,`
- If prefixed with `Allow,`, the message is cleaned and forwarded to the API safely

### 🧪 Example:

```text
User: my password is 12345
→ ❌ Blocked: Contains restricted keyword

User: Allow, my password is 12345
→ ✅ Allowed: Message sent after validation
```

## 📁 Environment Variables

You **must** create a `.env` file in the root directory with:

```env
DEEPSEEK_API_KEY=your_api_key_here
PORT=3000
```

> ⚠️ **Never commit your `.env` file to GitHub.**

## 🧪 How to Run Locally

1. Clone the repository  
2. Run `npm install`  
3. Create `.env` file with your API key  
4. Start backend with `node backend.js`  
5. Open `index.html` in your browser

## 🧩 Future Enhancements

- Regex support for emails, SSNs, or other sensitive patterns  
- Auth system with access roles  
- Smarter AI moderation integration

## 📄 License

MIT License – use freely, improve responsibly.
