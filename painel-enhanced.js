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
  const email = document.getElementById("emailCliente").value;
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!nome || !telefone || !email) return alert("Preencha todos os campos!");
  if (!emailRegex.test(email)) return alert("E-mail inválido!");
  await addDoc(collection(db, "clientes"), { nome, telefone, email });
  document.getElementById("nomeCliente").value = "";
  document.getElementById("telCliente").value = "";
  document.getElementById("emailCliente").value = "";
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

window.addFinanceiro = async function () {
  const cliente = document.getElementById("clienteFinanceiro").value;
  const valor = document.getElementById("valorFinanceiro").value;
  const data = document.getElementById("dataFinanceiro").value;
  const status = document.getElementById("statusFinanceiro").value;
  if (!cliente || !valor || !data || !status) return alert("Preencha todos os campos!");
  if (isNaN(parseFloat(valor))) return alert("Digite um valor numérico!");
  await addDoc(collection(db, "financeiro"), { cliente, valor, data, status });
  document.getElementById("clienteFinanceiro").value = "";
  document.getElementById("valorFinanceiro").value = "";
  document.getElementById("dataFinanceiro").value = "";
  document.getElementById("statusFinanceiro").value = "pendente";
  await carregarFinanceiro();
  mostrarToast("Pagamento adicionado com sucesso!");
};

async function carregarClientes() {
  const tabela = document.getElementById("tabela-clientes");
  tabela.innerHTML = "<tr><th>Nome</th><th>Telefone</th><th>E-mail</th><th>Ações</th></tr>";
  const querySnapshot = await getDocs(collection(db, "clientes"));
  querySnapshot.forEach((docSnap) => {
    const d = docSnap.data();
    tabela.innerHTML += `
      <tr>
        <td data-label="Nome">${d.nome}</td>
        <td data-label="Telefone">${d.telefone}</td>
        <td data-label="E-mail">${d.email}</td>
        <td data-label="Ações"><button class='btn-delete' onclick="deletarCliente('${docSnap.id}')">Excluir</button></td>
      </tr>
    `;
  });
}

async function carregarClientesSelect(id) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Selecione o cliente</option>';
  const querySnapshot = await getDocs(collection(db, "clientes"));
  querySnapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const option = document.createElement("option");
    option.value = d.nome;
    option.textContent = d.nome;
    select.appendChild(option);
  });
}

async function carregarTarefas() {
  const tabela = document.getElementById("tabela-tarefas");
  tabela.innerHTML = "<tr><th>Título</th><th>Data</th><th>Status</th><th>Ações</th></tr>";
  const querySnapshot = await getDocs(collection(db, "tarefas"));
  querySnapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const corStatus = d.status === "pendente" ? "orange" : "limegreen";
    tabela.innerHTML += `
      <tr>
        <td data-label="Título">${d.titulo}</td>
        <td data-label="Data">${d.data}</td>
        <td data-label="Status" style="color:${corStatus}; font-weight:bold;">${d.status}</td>
        <td data-label="Ações"><button class='btn-delete' onclick="deletarTarefa('${docSnap.id}')">Excluir</button></td>
      </tr>
    `;
  });
}

async function carregarProjetos() {
  const tabela = document.getElementById("tabela-projetos");
  tabela.innerHTML = "<tr><th>Projeto</th><th>Cliente</th><th>Etapas</th><th>Ações</th></tr>";
  const querySnapshot = await getDocs(collection(db, "projetos"));
  querySnapshot.forEach((docSnap) => {
    const d = docSnap.data();
    tabela.innerHTML += `
      <tr>
        <td data-label="Projeto">${d.nome}</td>
        <td data-label="Cliente">${d.cliente}</td>
        <td data-label="Etapas">${d.etapas}</td>
        <td data-label="Ações"><button class='btn-delete' onclick="deletarProjeto('${docSnap.id}')">Excluir</button></td>
      </tr>
    `;
  });
}

async function carregarFinanceiro() {
  const tabela = document.getElementById("tabela-financeiro");
  tabela.innerHTML = "<tr><th>Cliente</th><th>Valor</th><th>Data</th><th>Status</th><th>Ações</th></tr>";
  const querySnapshot = await getDocs(collection(db, "financeiro"));
  querySnapshot.forEach((docSnap) => {
    const d = docSnap.data();
    const corStatus = d.status === "pendente" ? "orange" : "limegreen";
    tabela.innerHTML += `
      <tr>
        <td data-label="Cliente">${d.cliente}</td>
        <td data-label="Valor">${d.valor}</td>
        <td data-label="Data">${d.data}</td>
        <td data-label="Status" style="color:${corStatus}; font-weight:bold;">${d.status}</td>
        <td data-label="Ações"><button class='btn-delete' onclick="deletarFinanceiro('${docSnap.id}')">Excluir</button></td>
      </tr>
    `;
  });
}

window.deletarCliente = async function (id) {
  if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
  await deleteDoc(doc(db, "clientes", id));
  await carregarClientes();
  await carregarClientesSelect("clienteFinanceiro");
  await carregarClientesSelect("clienteProjeto");
};

window.deletarTarefa = async function (id) {
  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
  await deleteDoc(doc(db, "tarefas", id));
  await carregarTarefas();
};

window.deletarProjeto = async function (id) {
  if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
  await deleteDoc(doc(db, "projetos", id));
  await carregarProjetos();
};

window.deletarFinanceiro = async function (id) {
  if (!confirm("Tem certeza que deseja excluir este pagamento?")) return;
  await deleteDoc(doc(db, "financeiro", id));
  await carregarFinanceiro();
};

// Inicialização
carregarClientes();
carregarTarefas();
carregarProjetos();
carregarFinanceiro();
carregarClientesSelect("clienteFinanceiro");
carregarClientesSelect("clienteProjeto");
