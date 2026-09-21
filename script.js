document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const messagesContainer = document.getElementById('messages');

  const API_KEY = "AQ.Ab8RN6JKq5NGLonsW3GT6GcB_EX4aSuy64YGtWDl-_uD47z7gA";

  async function enviarMensagem() {
    const texto = chatInput.value.trim();
    if (!texto) return;

    // 1. Mostra a mensagem do utilizador
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = texto;
    messagesContainer.appendChild(userMsg);

    chatInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 2. Balão de "A pensar..."
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message ai';
    aiMsg.textContent = "A contactar o Gemini...";
    messagesContainer.appendChild(aiMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: texto }]
            }
          ]
        })
      });

      const dados = await resposta.json();

      if (dados.candidates && dados.candidates[0].content.parts[0].text) {
        aiMsg.textContent = dados.candidates[0].content.parts[0].text;
      } else if (dados.error) {
        aiMsg.textContent = "Erro da API: " + dados.error.message;
      } else {
        aiMsg.textContent = "Resposta vazia recebida da IA.";
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      aiMsg.textContent = "Erro de conexão ao tentar falar com a IA.";
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
