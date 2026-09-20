const BACKEND_URL = "https://assistente-ti-backendd.onrender.com/chat";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function appendMessage(sender, text, type) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.classList.add(type === "user" ? "user-message" : "assistant-message");
    
    if (type === "ia" && typeof marked !== "undefined") {
        msgDiv.innerHTML = `<strong>${sender}:</strong> <div class="markdown-content">${marked.parse(text)}</div>`;
    } else {
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

async function sendMessage() {
    const messageText = userInput.value.trim();
    if (!messageText) return;

    appendMessage("Você", messageText, "user");
    userInput.value = "";

    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "assistant-message");
    loadingDiv.innerHTML = "<strong>Chronical:</strong> Digitando...";
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
        if (chatBox.contains(loadingDiv)) {
            chatBox.removeChild(loadingDiv);
        }

        if (data && data.response) {
            appendMessage("Chronical", data.response, "ia");
        } else {
            appendMessage("Chronical", "Não foi possível obter uma resposta.", "ia");
        }
    } catch (error) {
        if (chatBox.contains(loadingDiv)) {
            chatBox.removeChild(loadingDiv);
        }
        appendMessage("Chronical", "Erro ao conectar com o servidor.", "ia");
    }
}

if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

if (userInput) {
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
}
