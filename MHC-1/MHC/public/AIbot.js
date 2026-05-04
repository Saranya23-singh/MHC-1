const API_URL = "/api/chat"; // ✅ FIXED (use your Node server)

document.getElementById("user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const imageInput = document.getElementById("image-input");
  const chatBox = document.getElementById("chat-box");

  const message = userInput.value.trim();

  if (!message && imageInput.files.length === 0) return;

  // Add user message
  addMessageBubble("user", message, null);
  userInput.value = "";

  const typingId = showTypingIndicator();

  let imageData = null;
  if (imageInput.files.length > 0) {
    const file = imageInput.files[0];
    imageData = await readFileAsDataURL(file);
    addMessageBubble("user", "", imageData);
    imageInput.value = "";
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, image: imageData }),
    });

    removeTypingIndicator(typingId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ API RESPONSE:", data);

    // ✅ FIXED: use correct key
    const botReply = data.reply;

    const formattedReply = formatResponse(
      botReply || "I'm here for you 💚"
    );

    typeMessage("bot", formattedReply);

  } catch (error) {
    removeTypingIndicator(typingId);

    console.error("❌ Error:", error);

    // ❗ Only show error if API actually failed
    addMessageBubble("bot", "Something went wrong. Please try again.", null, true);
  }
}

function showTypingIndicator() {
  const chatBox = document.getElementById("chat-box");
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.id = "typing-" + Date.now();

  typingDiv.innerHTML = `
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  return typingDiv.id;
}

function removeTypingIndicator(typingId) {
  const typingElement = document.getElementById(typingId);
  if (typingElement) {
    typingElement.remove();
  }
}

function addMessageBubble(sender, text, imageSrc, isError = false) {
  const chatBox = document.getElementById("chat-box");

  let content = "";
  if (text) content = `<span>${text}</span>`;
  if (imageSrc) {
    content += `<img src="${imageSrc}" class="chat-image" />`;
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender} fade-in`;

  if (isError) messageDiv.classList.add("error");

  messageDiv.innerHTML = content;

  chatBox.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 100);
}

function typeMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender} fade-in`;

  const contentSpan = document.createElement("span");
  messageDiv.appendChild(contentSpan);

  chatBox.appendChild(messageDiv);

  let index = 0;
  const speed = 15;

  function typeChar() {
    if (index < text.length) {
      contentSpan.innerHTML = text.substring(0, index + 1);
      index++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(typeChar, speed);
    }
  }

  typeChar();
}

function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}