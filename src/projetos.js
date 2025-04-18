// src/projetos.js
import { db } from './firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { mostrarToast } from './ui.js';

export async function addProjeto() {
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
}

export async function carregarProjetos() {
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

export async function deletarProjeto(id) {
  await deleteDoc(doc(db, "projetos", id));
  await carregarProjetos();
  mostrarToast("Projeto removido!");
}
