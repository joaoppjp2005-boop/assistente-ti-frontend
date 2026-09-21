// 1. Importa os serviços necessários do SDK do Firebase (Web CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Configuração do Firebase do seu projeto (Chronical)
const firebaseConfig = {
  apiKey: "COLE_AQUI_A_SUA_NOVA_CHAVE_DE_API", // <-- Cole aqui a nova chave de API gerada no Google Cloud
  authDomain: "chronical-624a2.firebaseapp.com",
  projectId: "chronical-624a2",
  storageBucket: "chronical-624a2.firebasestorage.app",
  messagingSenderId: "919413941674",
  appId: "1:919413941674:web:a2e56297e56f666b44f7d3",
  measurementId: "G-KP1PZPM94N"
};

// 3. Inicializa o Firebase e a Autenticação
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 4. Função principal de Login com o Google
export function fazerLoginComGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // Login efetuado com sucesso!
      const user = result.user;
      console.log("Usuário conectado:", user);
      alert(`Bem-vindo(a), ${user.displayName}!`);
    })
    .catch((error) => {
      // Captura erros de autenticação
      console.error("Erro no login:", error.code, error.message);
      alert("Falha no login com o Google: " + error.message);
    });
}

// 5. Opcional: Adiciona o listener no botão assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
  const btnGoogle = document.getElementById("btn-google");
  if (btnGoogle) {
    btnGoogle.addEventListener("click", fazerLoginComGoogle);
  }
});
