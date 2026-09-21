import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Credenciais fixas do Firebase para o Login funcionar
const firebaseConfig = {
  apiKey: "AIzaSyAq1MaAD_jph9cVDDuYbCq1QxwKqLv64RE",
  authDomain: "chronical-624a2.firebaseapp.com",
  projectId: "chronical-624a2",
  storageBucket: "chronical-624a2.firebasestorage.app",
  messagingSenderId: "919413941674",
  appId: "1:919413941674:web:a2e56297e56f666b44f7d3",
  measurementId: "G-KP1PZPM94N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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

document.addEventListener("DOMContentLoaded", () => {
  const btnGoogle = document.getElementById("btn-google");
  if (btnGoogle) {
    btnGoogle.addEventListener("click", fazerLoginComGoogle);
  }
});
