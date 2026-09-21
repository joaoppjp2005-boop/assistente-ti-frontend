document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const messagesContainer = document.getElementById('messages');

  function enviarMensagem() {
    const texto = chatInput.value.trim();
    if (!texto) return;

    // Adiciona a mensagem do utilizador
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = texto;
    messagesContainer.appendChild(userMsg);

    chatInput.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simulação de resposta da IA
    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'message ai';
      aiMsg.textContent = "Mensagem recebida com sucesso! Sistema autónomo a funcionar.";
      messagesContainer.appendChild(aiMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 800);
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
