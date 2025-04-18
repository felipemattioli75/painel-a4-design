// Mock de dados iniciais
let pagamentos = [
  {
    cliente: "Dra. Luciana",
    valor: "300,00",
    data: "Todo dia 05",
    status: "pago",
  },
  {
    cliente: "Dra. Ielsy",
    valor: "250,00",
    data: "Todo dia 20",
    status: "pendente",
  },
  {
    cliente: "Denis Nutricionista",
    valor: "170,00",
    data: "Todo dia 05",
    status: "pago",
  },
  {
    cliente: "Tendas SP",
    valor: "250,00",
    data: "Todo dia 05",
    status: "pendente",
  },
];

export function carregarFinanceiro() {
  renderTabela();
}

export function addFinanceiro() {
  const cliente = document.getElementById("clienteFinanceiro").value;
  const valor = document.getElementById("valorFinanceiro").value;
  const data = document.getElementById("dataFinanceiro").value;
  const status = document.getElementById("statusFinanceiro").value;

  if (!cliente || !valor || !data) {
    alert("Preencha todos os campos!");
    return;
  }

  pagamentos.push({ cliente, valor, data, status });
  renderTabela();

  // Limpar campos
  document.getElementById("clienteFinanceiro").value = "";
  document.getElementById("valorFinanceiro").value = "";
  document.getElementById("dataFinanceiro").value = "";
  document.getElementById("statusFinanceiro").value = "pendente";
}

export function deletarFinanceiro(index) {
  if (confirm("Tem certeza que deseja excluir esse pagamento?")) {
    pagamentos.splice(index, 1);
    renderTabela();
  }
}

export function editarFinanceiro(botao, index) {
  const linha = botao.closest("tr");
  const celulas = linha.querySelectorAll("td");

  const cliente = celulas[0].innerText;
  const valor = celulas[1].innerText;
  const data = celulas[2].innerText;
  const status = celulas[3].innerText;

  celulas[0].innerHTML = `<input value="${cliente}" />`;
  celulas[1].innerHTML = `<input value="${valor}" />`;
  celulas[2].innerHTML = `<input value="${data}" />`;
  celulas[3].innerHTML = `
    <select>
      <option value="pago" ${status === "pago" ? "selected" : ""}>pago</option>
      <option value="pendente" ${status === "pendente" ? "selected" : ""}>pendente</option>
    </select>
  `;

  botao.textContent = "Salvar";
  botao.onclick = function () {
    salvarEdicao(linha, botao, index);
  };
}

function salvarEdicao(linha, botao, index) {
  const inputs = linha.querySelectorAll("input, select");
  const novoCliente = inputs[0].value;
  const novoValor = inputs[1].value;
  const novaData = inputs[2].value;
  const novoStatus = inputs[3].value;

  pagamentos[index] = {
    cliente: novoCliente,
    valor: novoValor,
    data: novaData,
    status
