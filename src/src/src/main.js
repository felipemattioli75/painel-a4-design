// src/main.js
import { showSection, mostrarToast, filtrarTabela } from './ui.js';
import { addCliente, carregarClientes, deletarCliente, carregarClientesSelect } from './clientes.js';
// Importar os outros módulos depois

// Disponibiliza globalmente pra onclicks (sim, eu odeio isso, mas html velho exige)
window.showSection = showSection;
window.filtrarTabela = filtrarTabela;
window.addCliente = addCliente;
window.deletarCliente = deletarCliente;

// Carrega tudo ao abrir
document.addEventListener("DOMContentLoaded", async () => {
  await carregarClientes();
  await carregarClientesSelect("clienteFinanceiro");
  await carregarClientesSelect("clienteProjeto");
});
