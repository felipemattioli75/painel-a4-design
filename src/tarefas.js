// src/tarefas.js
import { db } from './firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { mostrarToast } from './ui.js';

export async function addTarefa() {
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
}

export async function carregarTarefas() {
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

export async function deletarTarefa(id) {
  await deleteDoc(doc(db, "tarefas", id));
  await carregarTarefas();
  mostrarToast("Tarefa removida!");
}
