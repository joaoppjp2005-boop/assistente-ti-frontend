// 1. Importa os serviços do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_r5EcyShSoypck4A1fPxlhod6-HDgIPk",
  authDomain: "chronical-81382.firebaseapp.com",
  projectId: "chronical-81382",
  storageBucket: "chronical-81382.firebasestorage.app",
  messagingSenderId: "657212411165",
  appId: "1:657212411165:web:760b7380c4a3dd903f25f4",
  measurementId: "G-5ZYH88PHEE"
};

// 3. Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 4. Função de Login
export function fazerLoginComGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Login com sucesso:", result.user);
      alert(`Bem-vindo(a), ${result.user.displayName}!`);
    })
    .catch((error) => {
      console.error("Erro no login:", error);
      alert("Falha no login: " + error.message);
    });
}

// 5. Associa ao botão
document.addEventListener("DOMContentLoaded", () => {
  const btnGoogle = document.getElementById("btn-google");
  if (btnGoogle) {
    btnGoogle.addEventListener("click", fazerLoginComGoogle);
  }
});
