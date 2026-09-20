// Credenciais do Firebase do Projeto Chronical
const firebaseConfig = {
    apiKey: "AIzaSyCAbWdM9bvpVH8od0Ls0nipAcjMmrKDP8M",
    authDomain: "chronical-624a2.firebaseapp.com",
    projectId: "chronical-624a2",
    storageBucket: "chronical-624a2.firebasestorage.app",
    messagingSenderId: "919413941674",
    appId: "1:919413941674:web:a2e56297e56f666b44f7d3",
    measurementId: "G-KP1PZPM94N"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const BACKEND_URL = "https://assistente-ti-backendd.onrender.com/chat";

// Elementos da Interface
const authContainer = document.getElementById("auth-container");
const chatContainer = document.getElementById("chat-container");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authError = document.getElementById("auth-error");
const userDisplayName = document.getElementById("user-display-name");

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const googleLoginBtn = document.getElementById("google-login-btn");
const guestBtn = document.getElementById("guest-btn");
const logoutBtn = document.getElementById("logout-btn");

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let isGuestMode = false;

// Monitorizar se o Utilizador está Logado ou Deslogado
auth.onAuthStateChanged((user) => {
    if (user) {
        isGuestMode = false;
        authContainer.classList.add("hidden");
        chatContainer.classList.remove("hidden");
        userDisplayName.textContent = user.displayName || user.email;
    } else if (!isGuestMode) {
        authContainer.classList.remove("hidden");
        chatContainer.classList.add("hidden");
    }
});

// Continuar como Visitante (Sem Login)
guestBtn.addEventListener("click", () => {
    isGuestMode = true;
    authContainer.classList.add("hidden");
    chatContainer.classList.remove("hidden");
    userDisplayName.textContent = "Visitante";
});

// Login com E-mail e Senha
loginBtn.addEventListener("click", () => {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    if (!email || !password) {
        authError.textContent = "Por favor, preencha o e-mail e a senha.";
        return;
    }
    auth.signInWithEmailAndPassword(email, password)
        .catch(err => authError.textContent = "Erro no login: " + err.message);
});

// Registo com E-mail e Senha
registerBtn.addEventListener("click", () => {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    if (!email || !password) {
        authError.textContent = "Por favor, insira um e-mail e senha para se cadastrar.";
        return;
    }
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("Conta criada com sucesso!"))
        .catch(err => authError.textContent = "Erro no cadastro: " + err.message);
});

// Login com o Google
googleLoginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch(err => authError.textContent = "Erro no Google Login: " + err.message);
});

// Sair da Conta (Logout)
logoutBtn.addEventListener("click", () => {
    isGuestMode = false;
    auth.signOut();
    authContainer.classList.remove("hidden");
    chatContainer.classList.add("hidden");
});

// Função para exibir as mensagens na tela
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

// Enviar mensagem para a API na Render
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: messageText })
        });

        const data = await response.json();
        if (chatBox.contains(loadingDiv)) chatBox.removeChild(loadingDiv);

        if (data && data.response) {
            appendMessage("Chronical", data.response, "ia");
        } else {
            appendMessage("Chronical", "Não foi possível obter uma resposta.", "ia");
        }
    } catch (error) {
        if (chatBox.contains(loadingDiv)) chatBox.removeChild(loadingDiv);
        appendMessage("Chronical", "Erro ao conectar com o servidor.", "ia");
    }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
    userInput.value = "";

    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("message", "assistant-message");
    loadingDiv.innerHTML = "<strong>Chronical:</strong> Digitando...";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: messageText })
        });

        const data = await response.json();
        if (chatBox.contains(loadingDiv)) chatBox.removeChild(loadingDiv);

        if (data && data.response) {
            appendMessage("Chronical", data.response, "ia");
        } else {
            appendMessage("Chronical", "Não foi possível obter uma resposta.", "ia");
        }
    } catch (error) {
        if (chatBox.contains(loadingDiv)) chatBox.removeChild(loadingDiv);
        appendMessage("Chronical", "Erro ao conectar com o servidor.", "ia");
    }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
