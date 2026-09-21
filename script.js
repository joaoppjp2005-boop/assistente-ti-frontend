// 1. Importa os serviços do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Configuração das credenciais
const firebaseConfig = {
  apiKey: "AIzaSyAq1MaAD_jph9cVDDuYbCq1QxwKqLv64RE",
  authDomain: "chronical-624a2.firebaseapp.com",
  projectId: "chronical-624a2",
  storageBucket: "chronical-624a2.firebasestorage.app",
  messagingSenderId: "919413941674",
  appId: "1:919413941674:web:a2e56297e56f666b44f7d3",
  measurementId: "G-KP1PZPM94N"
};

// 3. Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 4. Função de Login
export function fazerLoginComGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Login realizado com sucesso:", result.user);
      alert(`Bem-vindo(a), ${result.user.displayName}!`);
    })
    .catch((error) => {
      console.error("Erro no login:", error);
      alert("Falha no login: " + error.message);
    });
}

// 5. Conecta ao botão quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  const btnGoogle = document.getElementById("btn-google");
  if (btnGoogle) {
    btnGoogle.addEventListener("click", fazerLoginComGoogle);
  }
});
