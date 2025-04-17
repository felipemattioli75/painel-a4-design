import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiuFQriY5F8t-uI7DBfOqjLXwCummLn20",
  authDomain: "painel-a4-design.firebaseapp.com",
  projectId: "painel-a4-design",
  storageBucket: "painel-a4-design.appspot.com",
  messagingSenderId: "24296551886",
  appId: "1:24296551886:web:ea75027d8c0fcdcf13a79f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.showSection = function(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
};

window.mostrarToast = function(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 3000);
};

window.filtrarTabela = function (idTabela, termo) {
  const linhas = document.querySelectorAll(`#${idTabela} tr:not(:first-child)`);
  termo = termo.toLowerCase();
  linhas.forEach(linha => {
    const texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(termo) ? "" : "none";
  });
};

window.addCliente = async function () {
  const nome = document.getElementById("nomeCliente").value;
  const telefone = document.getElementById("telCliente").value;
  if (!nome || !telefone) return alert("Preencha todos os campos!");
  await addDoc(collection(db, "clientes"), { nome, telefone });
  document.getElementById("nomeCliente").value = "";
  document.getElementById("telCliente").value = "";
  await carregarClientes();
  await carregarClientesSelect("clienteFinanceiro");
  await carregarClientesSelect("clienteProjeto");
  mostrarToast("Cliente adicionado com sucesso!");
};

window.addTarefa = async function () {
  const titulo = document.getElementById("tituloTarefa").value;
  const data = document.getElementById("dataTarefa").value;
  const status = document.getElementById("statusTarefa").value;
  if (!titulo || !data || !status) return alert("Preencha todos os campos da tarefa!");
  await addDoc(collection(db, "tarefas"), { titulo, data, status });
  document.getElementById("tituloTarefa").value = "";
  document.getElementById("dataTarefa").value = "";
  document.getElementById("statusTarefa").value = "pendente";
  await carregarTarefas();
  mostrarToast("Tarefa adicionada com sucesso!");
};

window.addProjeto
