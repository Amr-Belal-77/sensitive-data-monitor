/**
 * Stores all previous chats.
 * Each item contains a title and an array of messages.
 */
let chatHistory = [];

/**
 * Stores the currently active chat session messages.
 */
let currentChat = [];

/**
 * Counter to number each new chat session.
 */
let chatCounter = 1;

/**
 * Handle sending a message when the "Send" button is clicked.
 */
document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (!message) return;

  // Display the user's message in the chat box
  appendMessage("You", message, "user");
  input.value = "";

  // Show temporary "typing..." message from bot
  const loadingMsg = appendMessage("", "Chat Monitoring is typing", "bot");

  let dotCount = 0;
  const maxDots = 3;

  // Create animated dots effect for "typing..." indicator
  const typingInterval = setInterval(() => {
    dotCount = (dotCount + 1) % (maxDots + 1);
    const dots = ".".repeat(dotCount);
    loadingMsg.innerHTML = `Chat Monitoring is typing ${dots}`;
  }, 500);

  try {
    // Send the message to the backend
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Stop typing animation and display bot reply
    clearInterval(typingInterval);
    updateMessage(loadingMsg, `<strong>Chat:</strong> ${data.reply}`);

    // ✅ Save bot reply to current chat
    currentChat.push({ sender: "Chat", message: data.reply, senderClass: "bot" });

  } catch (err) {
    clearInterval(typingInterval);
    updateMessage(loadingMsg, `<strong>Error:</strong> Failed to contact backend.`);
    console.error(err);
  }
});

/**
 * Appends a message to the chat box and optionally stores it in the current chat.
 * 
 * @param {string} sender - Name of the sender (e.g., "You" or "Chat").
 * @param {string} message - The message content.
 * @param {string} senderClass - CSS class to style the message ("user" or "bot").
 * @returns {HTMLElement} The message DOM element.
 */
function appendMessage(sender, message, senderClass) {
  const chatBox = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.classList.add("message", senderClass);
  msg.innerHTML = sender ? `<strong>${sender}:</strong> ${message}` : message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // ✅ Don't store temporary messages like "is typing"
  if (sender) {
    currentChat.push({ sender, message, senderClass });
  }

  return msg;
}

/**
 * Updates the content of a message already displayed in the chat.
 * 
 * @param {HTMLElement} msgElement - The DOM element to update.
 * @param {string} newContent - The new HTML content for the message.
 */
function updateMessage(msgElement, newContent) {
  msgElement.innerHTML = newContent;
}

/**
 * Handles starting a new chat when the "Start New Chat" button is clicked.
 * It saves the current chat to the history and clears the chat window.
 */
document.getElementById("newChatBtn").addEventListener("click", () => {
  if (currentChat.length > 0) {
    chatHistory.push({
      title: `Chat #${chatCounter++}`,
      messages: [...currentChat],
    });
    updateHistoryList();
    currentChat = [];
  }

  document.getElementById("chatBox").innerHTML = "";
});

/**
 * Updates the chat history panel with clickable chat titles.
 * Called when a new chat is saved to history.
 */
function updateHistoryList() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  chatHistory.forEach((chat, index) => {
    const item = document.createElement("li");
    item.textContent = chat.title;
    item.addEventListener("click", () => loadChat(index));
    list.appendChild(item);
  });
}

/**
 * Loads a selected chat session from history and displays it in the chat box.
 * 
 * @param {number} index - The index of the chat in chatHistory.
 */
function loadChat(index) {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";
  const chat = chatHistory[index];
  chat.messages.forEach(msg => {
    appendMessage(msg.sender, msg.message, msg.senderClass);
  });
}

/**
 * Toggles visibility of the chat history panel when the history button is clicked.
 */
document.getElementById("toggleHistoryBtn").addEventListener("click", () => {
  const panel = document.getElementById("historyPanel");
  panel.classList.toggle("hidden");
});
