document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const messagesContainer = document.getElementById("messages");

    async function enviarMensagem() {
        const texto = chatInput.value.trim();
        if (!texto) return;

        // Adiciona a mensagem do utilizador ao ecrã
        const userMsg = document.createElement("div");
        userMsg.className = "message user";
        userMsg.textContent = texto;
        messagesContainer.appendChild(userMsg);

        chatInput.value = "";
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Balão de loading
        const aiMsg = document.createElement("div");
        aiMsg.className = "message ai";
        aiMsg.textContent = "A pensar...";
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const resposta = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: texto })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.error || 'Erro no servidor');
            }

            aiMsg.textContent = dados.reply;

        } catch (erro) {
            aiMsg.textContent = "Erro: " + erro.message;
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    if (sendBtn) sendBtn.addEventListener("click", enviarMensagem);
    if (chatInput) {
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                enviarMensagem();
            }
        });
    }
});
