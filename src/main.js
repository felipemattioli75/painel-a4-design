import { showSection, mostrarToast, filtrarTabela } from './ui.js';
import {
  addCliente,
  carregarClientes,
  deletarCliente,
  carregarClientesSelect
} from './clientes.js';

import {
  addTarefa,
  carregarTarefas,
  deletarTarefa
} from './tarefas.js';

import {
  addProjeto,
  carregarProjetos,
  deletarProjeto
} from './projetos.js';

import {
  addFinanceiro,
  carregarFinanceiro,
  deletarFinanceiro,
  editarFinanceiro
} from './financeiro.js';

// Expor funções globalmente pra funcionar com onclick no HTML
window.showSection = showSection;
window.filtrarTabela = filtrarTabela;

// Clientes
window.addCliente = addCliente;
window.deletarCliente = deletarCliente;

// Tarefas
window.addTarefa = addTarefa;
window.deletarTarefa = deletarTarefa;

// Projetos
window.addProjeto = addProjeto;
window.deletarProjeto = deletarProjeto;

// Financeiro
window.addFinanceiro = addFinanceiro;
window.deletarFinanceiro = deletarFinanceiro;
window.editarFinanceiro = editarFinanceiro;

document.addEventListener("DOMContentLoaded", async () => {
  await carregarClientes();
  await carregarClientesSelect("clienteFinanceiro");
  await carregarClientesSelect("clienteProjeto");
  await carregarTarefas();
  await carregarProjetos();
  await carregarFinanceiro();
});
