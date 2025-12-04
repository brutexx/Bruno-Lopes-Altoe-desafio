import { mockData } from './mock/transactions.js';

// ---
// ESTADO GLOBAL
// ---
let transactions = [...mockData];
let currentTheme = 'light';

// ---
// SELETORES DO DOM (Constantes - Padrão UPPER_SNAKE_CASE)
// ---
const THEME_SWITCHER = document.getElementById('theme-switcher');
const ROOT = document.documentElement;
const TRANSACTIONS_TABLE = document.getElementById('body-transaction-table');

// ---
// FUNÇÕES AUXILIARES 
// ---

/**
 * Formata uma string de data (YYYY-MM-DD) para o padrão brasileiro (DD/MM/YYYY).
 * @param {string} dateString - A data no formato ISO.
 * @returns {string} A data formatada.
 */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("pt-BR");
}

/**
 * Formata um número para o padrão de dinheiro brasileiro (R$X.XXX,XX).
 * @param {number} currencyNumber - O número a formatar.
 * @returns {string} O número formatado.
 */
function formatCurrency(currencyNumber) {
    return currencyNumber.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

/**
 * Coloca uma transação na tabela de transações (tela principal).
 * @param {Object} transaction - A transação com propriedades preenchidas.
 */
function renderRow(transaction) {
    const tr = document.createElement("tr");

    if (transaction.type === "income" || transaction.type === "expense")
        tr.classList.add(transaction.type);

    // Célula de Valor
    const amountTd = document.createElement("td");
    amountTd.textContent = formatCurrency(transaction.amount);

    // Célula de Data
    const dateTd = document.createElement("td");
    dateTd.textContent = formatDate(transaction.date);

    // Célula de Tipo
   const typeTd = document.createElement("td");
    typeTd.textContent = transaction.type;

    // Coloca as células na tabela
    tr.appendChild(amountTd);
    tr.appendChild(dateTd);
    tr.appendChild(typeTd);

    TRANSACTIONS_TABLE.appendChild(tr);
}

// ---
// MANIPULADORES DE EVENTOS
// ---

/**
 * Lida com o clique no botão de trocar o tema (Light/Dark).
 */
THEME_SWITCHER.addEventListener('click', () => {
    ROOT.dataset.theme = ROOT.dataset.theme === "dark" ? "light" : "dark";
});

/**
 * Função de inicialização da aplicação. A "main"
 */
function init() {
    transactions.forEach(renderRow);
}

// Inicia a aplicação
init();
