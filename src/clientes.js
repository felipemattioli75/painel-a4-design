// src/clientes.js
import { db } from './firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { mostrarToast } from './ui.js';

export async function addCliente() {
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
}

export async function carregarClientes() {
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

export async function deletarCliente(id) {
  await deleteDoc(doc(db, "clientes", id));
  await carregarClientes();
  await carregarClientesSelect("clienteFinanceiro");
  await carregarClientesSelect("clienteProjeto");
  mostrarToast("Cliente removido!");
}

export async function carregarClientesSelect(idSelect) {
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
