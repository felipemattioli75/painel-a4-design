import { db } from './firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { mostrarToast } from './ui.js';

export async function addFinanceiro() {
  const cliente = document.getElementById("clienteFinanceiro").value;
  const valor = document.getElementById("valorFinanceiro").value;
  const data = document.getElementById("dataFinanceiro").value;
  const status = document.getElementById("statusFinanceiro").value;

  if (!cliente || !valor || !data || !status)
    return alert("Preencha todos os campos financeiros!");

  await addDoc(collection(db, "financeiro"), { cliente, valor, data, status });

  resetForm();
  await carregarFinanceiro();
  mostrarToast("Pagamento adicionado com sucesso!");
}

export async function carregarFinanceiro() {
  const querySnapshot = await getDocs(collection(db, "financeiro"));
  const tabela = document.getElementById("tabela-financeiro");
  tabela.innerHTML = "<tr><th>Cliente</th><th>Valor</th><th>Data</th><th>Status</th><th>Ações</th></tr>";

  let totalPago = 0;
  let totalPendente = 0;

  querySnapshot.forEach(docSnap => {
    const fin = docSnap.data();
    const row = tabela.insertRow();

    const valor = parseFloat(fin.valor.replace(',', '.')) || 0;
    if (fin.status === "pago") totalPago += valor;
    else totalPendente += valor;

    row.innerHTML = `
      <td>${fin.cliente}</td>
      <td>${fin.valor}</td>
      <td>${fin.data}</td>
      <td>${fin.status}</td>
      <td>
        <button class="btn-delete" onclick="deletarFinanceiro('${docSnap.id}')">Excluir</button>
        <button class="btn-edit" onclick="editarFinanceiro('${docSnap.id}')">Editar</button>
      </td>
    `;
  });

  document.getElementById("totalPago").textContent = totalPago.toFixed(2).replace('.', ',');
  document.getElementById("totalPendente").textContent = totalPendente.toFixed(2).replace('.', ',');
}

export async function deletarFinanceiro(id) {
  await deleteDoc(doc(db, "financeiro", id));
  await carregarFinanceiro();
  mostrarToast("Registro financeiro removido!");
}

export async function editarFinanceiro(id) {
  const docRef = doc(db, "financeiro", id);
  const querySnapshot = await getDocs(collection(db, "financeiro"));

  let docData;
  querySnapshot.forEach(docSnap => {
    if (docSnap.id === id) docData = docSnap.data();
  });

  if (!docData) return alert("Erro ao encontrar o registro.");

  // Preenche os campos do formulário
  document.getElementById("clienteFinanceiro").value = docData.cliente;
  document.getElementById("valorFinanceiro").value = docData.valor;
  document.getElementById("dataFinanceiro").value = docData.data;
  document.getElementById("statusFinanceiro").value = docData.status;

  const btn = document.querySelector('.btn-add');
  btn.textContent = "Salvar Alterações";
  btn.style.background = "#ffaa00";

  btn.onclick = async () => {
    const cliente = document.getElementById("clienteFinanceiro").value;
    const valor = document.getElementBy
