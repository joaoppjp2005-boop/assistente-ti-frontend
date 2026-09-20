// Credenciais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCAbWdM9bvpVH8od0Ls0nipAcjMmrKDP8M",
    authDomain: "chronical-624a2.firebaseapp.com",
    projectId: "chronical-624a2",
    storageBucket: "chronical-624a2.firebasestorage.app",
    messagingSenderId: "919413941674",
    appId: "1:919413941674:web:a2e56297e56f666b44f7d3",
    measurementId: "G-KP1PZPM94N"
};

// Inicialização segura
try {
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
} catch (e) {
    console.error("Erro Firebase:", e);
}

const BACKEND_URL = "https://assistente-ti-backendd.onrender.com/chat";
let isGuestMode = false;

// Função direta para entrar como visitante
function entrarComoVisitante() {
    isGuestMode = true;
    const authContainer = document.getElementById("auth-container");
    const chatContainer = document.getElementById("chat-container");
    const userDisplayName = document.getElementById("user-display-name");

    if (authContainer) authContainer.classList.add("hidden");
    if (chatContainer) chatContainer.classList.remove("hidden");
    if (userDisplayName) userDisplayName.textContent = "Visitante";
}

document.addEventListener("DOMContentLoaded", () => {
    const authContainer = document.getElementById("auth-container");
    const chatContainer = document.getElementById("chat-container");
    const authEmail = document.getElementById("auth-email");
    const authPassword = document.getElementById("auth-password");
    const authError = document.getElementById("auth-error");
    const userDisplayName = document.getElementById("user-display-name");

    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const googleLoginBtn = document.getElementById("google-login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Firebase Auth Observer
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
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
    }

    // Handlers de Login
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const email = authEmail.value.trim();
            const password = authPassword.value.trim();
            if (!email || !password) {
                authError.textContent = "Preencha e-mail e senha.";
                return;
            }
            firebase.auth().signInWithEmailAndPassword(email, password)
                .catch(err => authError.textContent = "Erro: " + err.message);
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            const email = authEmail.value.trim();
            const password = authPassword.value.trim();
            if (!email || !password) {
                authError.textContent = "Preencha e-mail e senha para cadastrar.";
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => alert("Conta criada com sucesso!"))
                .catch(err => authError.textContent = "Erro: " + err.message);
        });
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .catch(err => authError.textContent = "Erro Google: " + err.message);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            isGuestMode = false;
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().signOut();
            }
            authContainer.classList.remove("hidden");
            chatContainer.classList.add("hidden");
        });
    }

    // Mensagens do Chat
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
                appendMessage("Chronical", "Não foi possível obter resposta.", "ia");
            }
        } catch (error) {
            if (chatBox.contains(loadingDiv)) chatBox.removeChild(loadingDiv);
            appendMessage("Chronical", "Erro ao conectar ao servidor.", "ia");
        }
    }

    if (sendBtn) sendBtn.addEventListener("click", sendMessage);
    if (userInput) {
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    }
});
