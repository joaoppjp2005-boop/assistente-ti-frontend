document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const messagesContainer = document.getElementById("messages");

    async function enviarMensagem() {
        const texto = chatInput.value.trim();
        if (!texto) return;

        const userMsg = document.createElement("div");
        userMsg.className = "message user";
        userMsg.textContent = texto;
        messagesContainer.appendChild(userMsg);

        chatInput.value = "";
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        const aiMsg = document.createElement("div");
        aiMsg.className = "message ai";
        aiMsg.textContent = "A contactar o Gemini...";
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const resposta = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: texto })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.error || 'Erro desconhecido');
            }

            aiMsg.textContent = dados.reply;

        } catch (erro) {
            console.error("Erro na requisição:", erro);
            aiMsg.textContent = "Erro: " + erro.message;
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    if (sendBtn) {
        sendBtn.addEventListener("click", enviarMensagem);
    }

    if (chatInput) {
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                enviarMensagem();
            }
        });
    }
});
