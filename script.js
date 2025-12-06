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
const TRANSACTIONS_TABLE_BODY = document.getElementById('transaction-table__body');
const FORM = document.getElementById("main-form");
const SEARCH_INPUT = document.getElementById("transaction-table__search-input");
const SELECT_INPUT = document.getElementById("transaction-table__select-input");

// ---
// FUNÇÕES AUXILIARES 
// ---

/**
 * Formata uma string de data (YYYY-MM-DD) para o padrão brasileiro (DD/MM/YYYY).
 * @param {string} dateString - A data no formato ISO.
 * @returns {string} A data formatada.
 */
function formatDate(dateString) {
    let date;

    if (!dateString.includes('T')) {
        // Ex: "2025-12-05"
        const [y, m, d] = dateString.split('-').map(Number);
        date = new Date(y, m - 1, d);
    } else {
        // Ex: "2025-12-05T00:00:00.000Z"
        date = new Date(dateString);
    }

    return date.toLocaleDateString('pt-BR');
}

/**
 * Formata um número para o padrão de dinheiro brasileiro (R$X.XXX,XX).
 * @param {string|number} currencyNumber - O número a formatar.
 * @returns {string} O número formatado.
 */
function formatCurrency(currencyNumber) {
    currencyNumber = Number(currencyNumber);
    return currencyNumber.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

/**
 * Transforma a informação do formulário num objeto de JavaScript.
 * @param {FormData} formData As informações do formulário preenchidas.
 * @returns {Object} Objeto seguindo os padrões/tipos de transactions.js.
 */
function formatFormData(formData) {
    return {
        id: transactions.length + 1,
        description: formData.get('description'),
        amount: Number(formData.get('amount')),
        date: formData.get('date'),
        type: formData.get('type'),
    }
}

/**
 * Coloca uma transação na tabela de transações (tela principal).
 * @param {Object} transaction - A transação com propriedades preenchidas.
 */
function renderRow(transaction) {
    const { amount, date, type, description } = transaction;
    const tr = document.createElement('tr');

    if (type === 'income' || type === 'expense')
        tr.classList.add(type);

    // Célula de Valor
    const amountTd = document.createElement('td');
    amountTd.dataset.col = 'amount';
    amountTd.textContent = formatCurrency(type === 'income' ? amount : -amount);

    // Célula de Data
    const dateTd = document.createElement('td');
    dateTd.dataset.col = 'date';
    dateTd.textContent = formatDate(date);

    // Célula de Descrição
    const descriptionTd = document.createElement('td');
    descriptionTd.dataset.col = 'description';
    descriptionTd.textContent = description;

    // Coloca as células na linha
    tr.appendChild(amountTd);
    tr.appendChild(dateTd);
    tr.appendChild(descriptionTd);

    TRANSACTIONS_TABLE_BODY.appendChild(tr);
}

/**
 * Ordena as linhas de ```transactions``` usando a escolha atual do usuário.
 */
function sortRows() {
    const selected = SELECT_INPUT.value;
    
    if (selected === 'value-desc')
        transactions.sort((t1, t2) => {
            const amountT1 = t1.amount * (t1.type === 'income'? 1 : -1);
            const amountT2 = t2.amount * (t2.type === 'income'? 1 : -1);
            return amountT2 - amountT1;
        });
    else if (selected === 'date-desc')
        transactions.sort((t1, t2) => t2.date.localeCompare(t1.date));
}

/**
 * Renderiza as linhas da tabela ordenadas.
 */
const renderRows = () => {
    TRANSACTIONS_TABLE_BODY.innerHTML = '';
    sortRows();
    transactions.forEach(renderRow);
}

// ---
// MANIPULADORES DE EVENTOS
// ---

/**
 * Lida com o clique no botão de trocar o tema (Light/Dark).
 */
THEME_SWITCHER.addEventListener('click', () => {
    ROOT.dataset.theme = ROOT.dataset.theme === 'dark' ? 'light' : 'dark';
});

/**
 * Adiciona novas transações à tabela de transações.
 */
FORM.addEventListener('submit', (event) => {
    // Página não recarrega
    event.preventDefault();
    const formData = new FormData(FORM);
    const transaction = formatFormData(formData);
    
    transactions.push(transaction);
    renderRows();
});

/**
 * Lida com a filtragem das linhas da tabela.
 */
SEARCH_INPUT.addEventListener('input', () => {
    const query = SEARCH_INPUT.value.toLowerCase().trim();
    const rows = TRANSACTIONS_TABLE_BODY.querySelectorAll("tr");

    rows.forEach(row => {
        const cell = row.querySelector('[data-col="description"]');
        const cellText = cell.textContent.toLowerCase();
        const matches = cellText.includes(query);

        row.classList.toggle('hidden', !matches);
    });
});

/**
 * Lida com a ordenação das linhas na tabela.
 */
SELECT_INPUT.addEventListener('change', renderRows);

/**
 * Função de inicialização da aplicação. A "main"
 */
function init() {
    renderRows();
}

// Inicia a aplicação
init();
