const API_URL = "http://localhost:3000/api/chat";

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

  // Add user message bubble
  addMessageBubble("user", message, null);
  userInput.value = "";
  
  // Show typing indicator
  const typingId = showTypingIndicator();
  
  // Check if an image file was selected
  let imageData = null;
  if (imageInput.files.length > 0) {
    const file = imageInput.files[0];
    imageData = await readFileAsDataURL(file);
    // Display the image in the chat
    addMessageBubble("user", "", imageData);
    imageInput.value = "";
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, image: imageData }),
    });

    // Remove typing indicator
    removeTypingIndicator(typingId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API Response:", data);

    // Format and display bot response with typing effect
    const formattedReply = formatResponse(data.reply || "I couldn't understand that.");
    typeMessage("bot", formattedReply);
    
  } catch (error) {
    // Remove typing indicator
    removeTypingIndicator(typingId);
    
    console.error("❌ Error communicating with AI:", error);
    
    // Show user-friendly error message with improved handling
    let errorMessage = "I'm having trouble responding right now. Please try again.";
    
    if (error.message.includes("API key")) {
      errorMessage = "I'm having trouble responding right now. Please try again.";
    } else if (error.message.includes("500") || error.message.includes("Failed") || error.message.includes("fetch")) {
      errorMessage = "I'm having trouble responding right now. Please try again.";
    }
    
    // Add error message with special styling
    addMessageBubble("bot", errorMessage, null, true);
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
  if (text) {
    content = `<span>${text}</span>`;
  }
  if (imageSrc) {
    content += `<img src="${imageSrc}" alt="uploaded image" class="chat-image" />`;
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender} fade-in`;
  if (isError) {
    messageDiv.classList.add("error");
  }
  messageDiv.innerHTML = content;

  chatBox.appendChild(messageDiv);
  
  // Smooth scroll to bottom
  setTimeout(() => {
    messageDiv.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 100);
}

// Typing effect for bot messages
function typeMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender} fade-in`;
  chatBox.appendChild(messageDiv);
  
  // Create content element
  const contentSpan = document.createElement("span");
  messageDiv.appendChild(contentSpan);
  
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Simple typing effect - show text immediately with animation
  let index = 0;
  const speed = 15; // ms per character
  
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
    .replace(/\* (.*?)\n/g, "<li>$1</li>")
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

