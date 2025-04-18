// src/financeiro.js
import { db } from './firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { mostrarToast } from './ui.js';

export async function addFinanceiro() {
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
}

export async function carregarFinanceiro() {
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

export async function deletarFinanceiro(id) {
  await deleteDoc(doc(db, "financeiro", id));
  await carregarFinanceiro();
  mostrarToast("Registro financeiro removido!");
}
