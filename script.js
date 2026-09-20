const BACKEND_URL = "https://assistente-ti-backendd.onrender.com/chat";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Função para formatar o texto do Gemini (Markdown simples para HTML)
function formatMarkdown(text) {
    return text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        .replace(/\n/g, '<br>');
}

function appendMessage(sender, text, type) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.classList.add(type === "user" ? "user-message" : "assistant-message");
    
    if (type === "ia") {
        msgDiv.innerHTML = `<strong>${sender}:</strong><div class="ia-text">${formatMarkdown(text)}</div>`;
    } else {
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const messageText = userInput.value.trim();
    if (!messageText) return;

    appendMessage("Você", messageText, "user");
    userInput.value = "";

    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "assistant-message");
    loadingDiv.innerHTML = "<strong>Chronical:</strong> A pensar...";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: messageText })
        });

        const data = await response.json();
        chatBox.removeChild(loadingDiv);

        if (data && data.response) {
            appendMessage("Chronical", data.response, "ia");
        } else {
            appendMessage("Chronical", "Não foi possível obter uma resposta.", "ia");
        }
    } catch (error) {
        if (chatBox.contains(loadingDiv)) {
            chatBox.removeChild(loadingDiv);
        }
        appendMessage("Chronical", "Erro ao ligar ao servidor. Tente novamente em instantes.", "ia");
    }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
