document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const message = userInput.value.trim();
        if (!message) return;

        // Exibe a mensagem do usuário na tela
        appendMessage("Você", message, "user");
        userInput.value = "";

        // Cria elemento de carregamento
        const loadingDiv = document.createElement("div");
        loadingDiv.className = "mensagem ia";
        loadingDiv.innerHTML = "<strong>Assistente:</strong> Digitando...";
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch("https://assistente-ti-backendd.onrender.com/chat", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
});

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();
            
            // Remove a mensagem de "Digitando..."
            chatBox.removeChild(loadingDiv);

            // Obtém o texto da resposta independente da chave retornada
            const botReply = data.response || data.reply || data.resposta || data.message;

            if (botReply) {
                appendMessage("Chronical", botReply, "ia");
            } else {
                appendMessage("Chronical", "Não foi possível obter uma resposta válida.", "ia");
            }

        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            if (chatBox.contains(loadingDiv)) {
                chatBox.removeChild(loadingDiv);
            }
            appendMessage("Assistente", "Erro ao obter resposta do servidor.", "ia");
        }
    });

    function appendMessage(sender, text, type) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `mensagem ${type}`;
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
