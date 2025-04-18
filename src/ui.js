// src/ui.js

/**
 * Exibe uma mensagem temporária no canto da tela.
 * Serve pra avisar o usuário que ele fez algo certo. Ou errado. A vida é assim.
 */
export function mostrarToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

/**
 * Mostra uma seção específica e esconde as outras.
 * Porque interface limpa é melhor do que bagunça visual.
 */
export function showSection(id) {
  document.querySelectorAll("section").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/**
 * Filtra os resultados de uma tabela com base em um termo digitado.
 * Traduzindo: faz parecer que seu sistema tem busca inteligente (mas é só um `includes()`).
 */
export function filtrarTabela(idTabela, termo) {
  const linhas = document.querySelectorAll(`#${idTabela} tr:not(:first-child)`);
  termo = termo.toLowerCase();
  linhas.forEach((linha) => {
    const texto = linha.innerText.toLowerCase();
    linha.style.display = texto.includes(termo) ? "" : "none";
  });
}
