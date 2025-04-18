// src/main.js
import { showSection, mostrarToast, filtrarTabela } from './ui.js';
import {
  addCliente, carregarClientes, deletarCliente, carregarClientesSelect
} from './clientes.js';
import {
  addTarefa, carregarTarefas, deletarTarefa
} from './tarefas.js';
import {
  addProjeto, carregarProjetos, deletarProjeto
} from './projetos.js';
import {
  addFinanceiro, carregarFinanceiro, deletarFinanceiro
} from './financeiro.js';

// Deixa as funções disponíveis pro HTML
window.showSection = showSection;
window.filtrarTabela = filtrarTabela;

window.addCliente = addCliente;
window.deletarCliente = deletarCliente;

window.addTarefa = addTarefa;
window.deletarTarefa = deletarTarefa;

window.addProjeto = addProjeto;
window.deletarProjeto = deletarProjeto;

window.addFinanceiro = addFinanceiro;
window.deletarFinanceiro = deletarFinanceiro;

// Init
document.addEventListener("DOMContentLoaded", async () => {
  await carregarClientes();
  await carregarClientesSelect("clienteFinanceiro");
  await carregarClientesSelect("clienteProjeto");
  await carregarTarefas();
  await carregarProjetos();
  await carregarFinanceiro();
});
