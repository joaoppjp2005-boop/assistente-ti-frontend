// URL do teu backend no Render
const BACKEND_URL = "https://assistente-ti-backendd.onrender.com/chat";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function appendMessage(sender, text, type) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.classList.add(type === "user" ? "user-message" : "assistant-message");
    
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const messageText = userInput.value.trim();
    if (!messageText) return;

    // Mostra a tua mensagem no ecrã
    appendMessage("Você", messageText, "user");
    userInput.value = "";

    // Criar o indicador de "A pensar..."
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
        console.error("Erro na comunicação com o backend:", error);
    }
}

// Evento ao clicar no botão Enviar
sendBtn.addEventListener("click", sendMessage);

// Evento ao pressionar Enter no teclado
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
