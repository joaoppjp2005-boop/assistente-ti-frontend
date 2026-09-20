// ATENÇÃO: Substitua o URL abaixo pelo link real do seu backend no Render
const BACKEND_URL = "https://assistente-ti-frontend.vercel.app/";

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

    // Adiciona a mensagem do utilizador no chat
    appendMessage("Você", messageText, "user");
    userInput.value = "";

    // Adiciona o indicador de carregamento
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
        console.error(error);
    }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
