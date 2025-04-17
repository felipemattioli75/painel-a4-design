// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCiuFQriY5F8t-uI7DBfOqjLXwCummLn20",
  authDomain: "painel-a4-design.firebaseapp.com",
  projectId: "painel-a4-design",
  storageBucket: "painel-a4-design.appspot.com",
  messagingSenderId: "24296551886",
  appId: "1:24296551886:web:ea75027d8c0fcdcf13a79f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Alternar seções
window.showSection = function(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
};

// Mostrar toast
window.mostrarToast = function(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 3000);
};

// Filtrar tabelas
window.filtrarTabela = function (idTabela, termo) {
  const linhas = document.querySelectorAll(`#${idTabela} tr:not(:first-child)`);
  termo = termo.toLowerCase();
  linhas.forEach(linha => {
    const texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(termo) ? "" : "none";
  });
};

// Adicionar cliente
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

// Carregar clientes na tabela
async function carregarClientes() {
  const querySnapshot = await getDocs(collection(db, "clientes"));
  const tabela = document.getElementById("tabela-clientes");
  tabela.innerHTML = "<tr><th>Nome</th><th>Telefone</th><th>Ações</th></tr>";
  querySnapshot.forEach(docSnap => {
    const cliente = docSnap.data();
    const row = tabela.insertRow();
    row.innerHTML = `
      <td>${cliente.nome}</td>
      <td>${cliente.telefone}</td>
      <td><button class="btn-delete" onclick="deletarCliente('${docSnap.id}')">Excluir</button></td>
    `;
  });
}

// Deletar cliente
window.deletarCliente = async function(id) {
  await deleteDoc(doc(db, "clientes", id));
  await carregarClientes();
  await carregarClientesSelect("clienteFinanceiro");
  await carregarClientesSelect("clienteProjeto");
  mostrarToast("Cliente removido!");
}

// Preencher selects com clientes
async function carregarClientesSelect(idSelect) {
  const select = document.getElementById(idSelect);
  select.innerHTML = `<option value="">Selecione o cliente</option>`;
  const querySnapshot = await getDocs(collection(db, "clientes"));
  querySnapshot.forEach(docSnap => {
    const cliente = docSnap.data();
    const opt = document.createElement("option");
    opt.value = cliente.nome;
    opt.textContent = cliente.nome;
    select.appendChild(opt);
  });
}

// Adicionar tarefa
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

// Carregar tarefas
async function carregarTarefas() {
  const querySnapshot = await getDocs(collection(db, "tarefas"));
  const tabela = document.getElementById("tabela-tarefas");
  tabela.innerHTML = "<tr><th>Título</th><th>Data</th><th>Status</th><th>Ações</th></tr>";
  querySnapshot.forEach(docSnap => {
    const tarefa = docSnap.data();
    const row = tabela.insertRow();
    row.innerHTML = `
      <td>${tarefa.titulo}</td>
      <td>${tarefa.data}</td>
      <td>${tarefa.status}</td>
      <td><button class="btn-delete" onclick="deletarTarefa('${docSnap.id}')">Excluir</button></td>
    `;
  });
}

// Deletar tarefa
window.deletarTarefa = async function(id) {
  await deleteDoc(doc(db, "tarefas", id));
  await carregarTarefas();
  mostrarToast("Tarefa removida!");
}

// Adicionar projeto
window.addProjeto = async function () {
  const nome = document.getElementById("nomeProjeto").value;
  const cliente = document.getElementById("clienteProjeto").value;
  const etapas = document.getElementById("etapasProjeto").value;
  if (!nome || !cliente || !etapas) return alert("Preencha todos os campos do projeto!");
  await addDoc(collection(db, "projetos"), { nome, cliente, etapas });
  document.getElementById("nomeProjeto").value = "";
  document.getElementById("clienteProjeto").value = "";
  document.getElementById("etapasProjeto").value = "";
  await carregarProjetos();
  mostrarToast("Projeto adicionado com sucesso!");
};

// Carregar projetos
async function carregarProjetos() {
  const querySnapshot = await getDocs(collection(db, "projetos"));
  const tabela = document.getElementById("tabela-projetos");
  tabela.innerHTML = "<tr><th>Projeto</th><th>Cliente</th><th>Etapas</th><th>Ações</th></tr>";
  querySnapshot.forEach(docSnap => {
    const projeto = docSnap.data();
    const row = tabela.insertRow();
    row.innerHTML = `
      <td>${projeto.nome}</td>
      <td>${projeto.cliente}</td>
      <td>${projeto.etapas}</td>
      <td><button class="btn-delete" onclick="deletarProjeto('${docSnap.id}')">Excluir</button></td>
    `;
  });
}

// Deletar projeto
window.deletarProjeto = async function(id) {
  await deleteDoc(doc(db, "projetos", id));
  await carregarProjetos();
  mostrarToast("Projeto removido!");
}

// Adicionar financeiro
window.addFinanceiro = async function () {
  const cliente = document.getElementById("clienteFinanceiro").value;
  const valor = document.getElementById("valorFinanceiro").value;
  const data = document.getElementById("dataFinanceiro").value;
  const status = document.getElementById("statusFinanceiro").value;
  if (!cliente || !valor || !data || !status) return alert("Preencha todos os campos financeiros!");
  await addDoc(collection(db, "financeiro"), { cliente, valor, data, status });
  document.getElementById("clienteFinanceiro").value = "";
  document.getElementById("valorFinanceiro").value = "";
  document.getElementById("dataFinanceiro").value = "";
  document.getElementById("statusFinanceiro").value = "pendente";
  await carregarFinanceiro();
  mostrarToast("Pagamento adicionado com sucesso!");
};

// Carregar financeiro
async function carregarFinanceiro() {
  const querySnapshot = await getDocs(collection(db, "financeiro"));
  const tabela = document.getElementById("tabela-financeiro");
  tabela.innerHTML = "<tr><th>Cliente</th><th>Valor</th><th>Data</th><th>Status</th><th>Ações</th></tr>";
  querySnapshot.forEach(docSnap => {
    const fin = docSnap.data();
    const row = tabela.insertRow();
    row.innerHTML = `
      <td>${fin.cliente}</td>
      <td>${fin.valor}</td>
      <td>${fin.data}</td>
      <td>${fin.status}</td>
      <td><button class="btn-delete" onclick="deletarFinanceiro('${docSnap.id}')">Excluir</button></td>
    `;
  });
}

// Deletar financeiro
window.deletarFinanceiro = async function(id) {
  await deleteDoc(doc(db, "financeiro", id));
  await carregarFinanceiro();
  mostrarToast("Registro financeiro removido!");
}

// Carregamento inicial
document.addEventListener("DOMContentLoaded", async () => {
  await carregarClientes();
  await carregarTarefas();
  await carregarProjetos();
  await carregarFinanceiro();
  await carregarClientesSelect("clienteFinanceiro");
  await carregarClientesSelect("clienteProjeto");
});
