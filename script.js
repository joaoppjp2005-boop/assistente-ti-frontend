// --- IMPORTAÇÃO DOS MÓDULOS DO FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- CONFIGURAÇÃO DO FIREBASE (Autenticação) ---
const firebaseConfig = {
  apiKey: "AIzaSyAq1MaAD_jph9cVDDuYbCq1QxwKqLv64RE",
  authDomain: "chronical-624a2.firebaseapp.com",
  projectId: "chronical-624a2",
  storageBucket: "chronical-624a2.firebasestorage.app",
  messagingSenderId: "919413941674",
  appId: "1:919413941674:web:a2e56297e56f666b44f7d3",
  measurementId: "G-KP1PZPM94N"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// --- LÓGICA DE INTERFACE E AUTENTICAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
  const btnGoogle = document.getElementById("btn-google");
  const authContainer = document.getElementById("auth-container");
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.querySelector(".btn-green");
  const messagesContainer = document.getElementById("messages");

  // 1. Gerir o Estado de Autenticação do Utilizador
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Utilizador autenticado: esconde a tela de login
      if (authContainer) {
        authContainer.classList.add("hidden");
      }
      console.log("Utilizador ligado:", user.displayName);
    } else {
      // Utilizador não autenticado: mostra a tela de login
      if (authContainer) {
        authContainer.classList.remove("hidden");
      }
    }
  });

  // 2. Ação do Botão de Login com o Google
  if (btnGoogle) {
    btnGoogle.addEventListener("click", () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("Login efetuado com sucesso!", result.user);
        })
        .catch((error) => {
          console.error("Erro no login com o Google:", error);
          alert("Erro ao autenticar: " + error.message);
        });
    });
  }

  // 3. Função para Enviar Mensagens no Chat
  function enviarMensagem() {
    if (!chatInput) return;
    const texto = chatInput.value.trim();
    if (texto === "") return;

    // Adiciona a mensagem do utilizador ao chat
    const msgUser = document.createElement("div");
    msgUser.style.margin = "10px 0";
    msgUser.style.textAlign = "right";
    msgUser.innerHTML = `<span style="background: #22c55e; color: #000; padding: 8px 12px; border-radius: 8px; display: inline-block;">${texto}</span>`;
    messagesContainer.appendChild(msgUser);

    chatInput.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simulação de resposta da I.A (Conectada à chave de processamento configurada na Vercel/Ambiente)
    setTimeout(() => {
      const msgIA = document.createElement("div");
      msgIA.style.margin = "10px 0";
      msgIA.style.textAlign = "left";
      msgIA.innerHTML = `<span style="background: #1f2937; color: #fff; padding: 8px 12px; border-radius: 8px; display: inline-block;">Olá! Estou a processar a sua solicitação no Chronical I.A.</span>`;
      messagesContainer.appendChild(msgIA);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  }

  // Eventos de envio por clique ou tecla Enter
  if (sendButton) {
    sendButton.addEventListener("click", enviarMensagem);
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        enviarMensagem();
      }
    });
  }
});
