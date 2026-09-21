document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const messagesContainer = document.getElementById('messages');

  // A sua chave de API integrada
  const API_KEY = "AQ.Ab8RN6JKq5NGLonsW3GT6GcB_EX4aSuy64YGtWDl-_uD47z7gA";

  console.log("Chronical I.A inicializado com sucesso!");

  async function enviarMensagem() {
    const texto = chatInput.value.trim();
    if (!texto) return;

    // 1. Mostra a mensagem do utilizador no chat
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = texto;
    messagesContainer.appendChild(userMsg);

    chatInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 2. Balão de carregamento da IA
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai';
    aiMsg.textContent = "A consultar o Gemini...";
    messagesContainer.appendChild(aiMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      // 3. Chamada direta para a API do Google Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: texto }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        aiMsg.textContent = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        aiMsg.textContent = "Erro da API: " + (data.error.message || "Chave inválida ou erro no pedido.");
      } else {
        aiMsg.textContent = "A IA não retornou nenhuma resposta.";
      }
    } catch (error) {
      console.error("Erro:", error);
      aiMsg.textContent = "Ocorreu um erro de ligação com a API.";
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', enviarMensagem);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        enviarMensagem();
      }
    });
  }
});
