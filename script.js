// Variáveis Globais
let currentDate = new Date();
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let cards = JSON.parse(localStorage.getItem('cards')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || [];
let investments = JSON.parse(localStorage.getItem('investments')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDashboardViews();
    initializeAllForms();
    setupCharts();
    updateAllViews();
});

// Navegação Principal
function initializeNavigation() {
    const menuItems = document.querySelectorAll('.sidebar li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const pageId = this.getAttribute('data-page');
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId)?.classList.add('active');

            // Atualiza views específicas
            if (pageId === 'cards') updateCardsView();
            if (pageId === 'goals') updateGoalsView();
            if (pageId === 'investments') updateInvestmentsView();
        });
    });
}

// Funções de Modal
function openTransactionModal(type = 'expense') {
    const modal = document.getElementById('transactionModal');
    document.getElementById('type').value = type;
    modal.style.display = 'flex';
}

function closeTransactionModal() {
    document.getElementById('transactionModal').style.display = 'none';
    document.getElementById('transactionForm').reset();
}

function openCreditCardExpenseModal() {
    const modal = document.getElementById('creditCardExpenseModal');
    if (cards.length === 0) {
        showNotification('Adicione um cartão primeiro!', 'warning');
        return;
    }
    
    const select = document.getElementById('creditCardSelect');
    select.innerHTML = cards.map(card => 
        `<option value="${card.id}">${card.name}</option>`
    ).join('');
    
    modal.style.display = 'flex';
}

function closeCreditCardExpenseModal() {
    document.getElementById('creditCardExpenseModal').style.display = 'none';
    document.getElementById('creditCardExpenseForm').reset();
}

function openCardModal() {
    document.getElementById('cardModal').style.display = 'flex';
}

function closeCardModal() {
    document.getElementById('cardModal').style.display = 'none';
    document.getElementById('cardForm').reset();
}

function openInvestmentModal() {
    const modal = document.getElementById('investmentModal');
    document.getElementById('investmentDate').valueAsDate = new Date();
    modal.style.display = 'flex';
}

function closeInvestmentModal() {
    document.getElementById('investmentModal').style.display = 'none';
    document.getElementById('investmentForm').reset();
}

function openGoalModal() {
    document.getElementById('goalModal').style.display = 'flex';
}

function closeGoalModal() {
    document.getElementById('goalModal').style.display = 'none';
    document.getElementById('goalForm').reset();
}

// Handlers de Formulário
function handleTransactionSubmit(e) {
    e.preventDefault();
    const transaction = {
        id: Date.now().toString(),
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateAllViews();
    closeTransactionModal();
    showNotification('Transação adicionada com sucesso!', 'success');
}

function handleCreditCardExpenseSubmit(e) {
    e.preventDefault();
    const cardId = document.getElementById('creditCardSelect').value;
    const card = cards.find(c => c.id === cardId);
    const amount = parseFloat(document.getElementById('ccExpenseAmount').value);
    const installments = parseInt(document.getElementById('ccInstallments').value);
    const installmentAmount = amount / installments;

    const expense = {
        id: Date.now().toString(),
        description: document.getElementById('ccExpenseDescription').value,
        amount: amount,
        installmentAmount: installmentAmount,
        totalInstallments: installments,
        currentInstallment: 1,
        category: document.getElementById('ccExpenseCategory').value,
        date: new Date().toISOString()
    };

    card.purchases = card.purchases || [];
    card.purchases.push(expense);
    localStorage.setItem('cards', JSON.stringify(cards));

    closeCreditCardExpenseModal();
    updateCardsView();
    showNotification('Despesa no cartão adicionada com sucesso!', 'success');
}

function handleCardSubmit(e) {
    e.preventDefault();
    const card = {
        id: Date.now().toString(),
        name: document.getElementById('cardName').value,
        limit: parseFloat(document.getElementById('cardLimit').value),
        closingDay: parseInt(document.getElementById('closingDay').value),
        purchases: []
    };

    cards.push(card);
    localStorage.setItem('cards', JSON.stringify(cards));
    
    closeCardModal();
    updateCardsView();
    showNotification('Cartão adicionado com sucesso!', 'success');
}

function handleInvestmentSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('investmentAmount').value);
    
    // Verifica se há saldo suficiente
    const currentBalance = calculateAvailableBalance();
    if (amount > currentBalance) {
        showNotification('Saldo insuficiente para realizar este investimento!', 'error');
        return;
    }

    const investment = {
        id: Date.now().toString(),
        type: document.getElementById('investmentType').value,
        name: document.getElementById('investmentName').value,
        amount: amount,
        date: document.getElementById('investmentDate').value,
        rate: parseFloat(document.getElementById('investmentRate').value),
        maturity: document.getElementById('investmentMaturity').value
    };

    investments.push(investment);
    localStorage.setItem('investments', JSON.stringify(investments));

    // Registra a transação correspondente
    const transaction = {
        id: Date.now().toString() + '_inv',
        description: `Investimento: ${investment.name}`,
        amount: amount,
        type: 'investment',
        category: 'investment',
        date: new Date().toISOString()
    };
    
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    closeInvestmentModal();
    updateAllViews();
    showNotification('Investimento realizado com sucesso!', 'success');
}

function handleGoalSubmit(e) {
    e.preventDefault();
    const goal = {
        id: Date.now().toString(),
        description: document.getElementById('goalDescription').value,
        amount: parseFloat(document.getElementById('goalAmount').value),
        date: document.getElementById('goalDate').value,
        category: document.getElementById('goalCategory').value,
        current: 0
    };

    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
    
    closeGoalModal();
    updateGoalsView();
    showNotification('Meta adicionada com sucesso!', 'success');
}

// Handlers de Formulário
function handleTransactionSubmit(e) {
    e.preventDefault();
    const transaction = {
        id: Date.now().toString(),
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateAllViews();
    closeTransactionModal();
    showNotification('Transação adicionada com sucesso!', 'success');
}

function handleCreditCardExpenseSubmit(e) {
    e.preventDefault();
    const cardId = document.getElementById('creditCardSelect').value;
    const card = cards.find(c => c.id === cardId);
    const amount = parseFloat(document.getElementById('ccExpenseAmount').value);
    const installments = parseInt(document.getElementById('ccInstallments').value);
    const installmentAmount = amount / installments;

    const expense = {
        id: Date.now().toString(),
        description: document.getElementById('ccExpenseDescription').value,
        amount: amount,
        installmentAmount: installmentAmount,
        totalInstallments: installments,
        currentInstallment: 1,
        category: document.getElementById('ccExpenseCategory').value,
        date: new Date().toISOString()
    };

    card.purchases = card.purchases || [];
    card.purchases.push(expense);
    localStorage.setItem('cards', JSON.stringify(cards));

    closeCreditCardExpenseModal();
    updateCardsView();
    showNotification('Despesa no cartão adicionada com sucesso!', 'success');
}

function handleCardSubmit(e) {
    e.preventDefault();
    const card = {
        id: Date.now().toString(),
        name: document.getElementById('cardName').value,
        limit: parseFloat(document.getElementById('cardLimit').value),
        closingDay: parseInt(document.getElementById('closingDay').value),
        purchases: []
    };

    cards.push(card);
    localStorage.setItem('cards', JSON.stringify(cards));
    
    closeCardModal();
    updateCardsView();
    showNotification('Cartão adicionado com sucesso!', 'success');
}

function handleInvestmentSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('investmentAmount').value);
    
    // Verifica se há saldo suficiente
    const currentBalance = calculateAvailableBalance();
    if (amount > currentBalance) {
        showNotification('Saldo insuficiente para realizar este investimento!', 'error');
        return;
    }

    const investment = {
        id: Date.now().toString(),
        type: document.getElementById('investmentType').value,
        name: document.getElementById('investmentName').value,
        amount: amount,
        date: document.getElementById('investmentDate').value,
        rate: parseFloat(document.getElementById('investmentRate').value),
        maturity: document.getElementById('investmentMaturity').value
    };

    investments.push(investment);
    localStorage.setItem('investments', JSON.stringify(investments));

    // Registra a transação correspondente
    const transaction = {
        id: Date.now().toString() + '_inv',
        description: `Investimento: ${investment.name}`,
        amount: amount,
        type: 'investment',
        category: 'investment',
        date: new Date().toISOString()
    };
    
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    closeInvestmentModal();
    updateAllViews();
    showNotification('Investimento realizado com sucesso!', 'success');
}

function handleGoalSubmit(e) {
    e.preventDefault();
    const goal = {
        id: Date.now().toString(),
        description: document.getElementById('goalDescription').value,
        amount: parseFloat(document.getElementById('goalAmount').value),
        date: document.getElementById('goalDate').value,
        category: document.getElementById('goalCategory').value,
        current: 0
    };

    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
    
    closeGoalModal();
    updateGoalsView();
    showNotification('Meta adicionada com sucesso!', 'success');
}
// Funções de Cálculo
function calculateTotal(type, transactionList = transactions) {
    return transactionList
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
}

function calculateInvestmentsTotal() {
    return investments.reduce((total, inv) => {
        const currentValue = calculateInvestmentValue(inv);
        return total + currentValue;
    }, 0);
}

function calculateInvestmentValue(investment) {
    const startDate = new Date(investment.date);
    const today = new Date();
    const daysInvested = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const yearlyRate = investment.rate / 100;
    const dailyRate = Math.pow(1 + yearlyRate, 1/365) - 1;
    
    return investment.amount * Math.pow(1 + dailyRate, daysInvested);
}

function calculateAvailableBalance() {
    const income = calculateTotal('income');
    const expenses = calculateTotal('expense');
    return income - expenses;
}

// Funções de Gráfico
function updateCharts() {
    updateBalanceChart();
    updateExpensesChart();
}

function updateBalanceChart() {
    const ctx = document.getElementById('balanceChart')?.getContext('2d');
    if (!ctx) return;

    const months = Array.from({length: 6}, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return d.toLocaleDateString('pt-BR', { month: 'short' });
    });

    const data = months.map((_, index) => {
        const monthData = getMonthlyBalance(index);
        return monthData.income - monthData.expenses;
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Saldo',
                data: data,
                borderColor: '#2563eb',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateExpensesChart() {
    const ctx = document.getElementById('expensesChart')?.getContext('2d');
    if (!ctx) return;

    const categories = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#2563eb',
                    '#dc2626',
                    '#059669',
                    '#d97706',
                    '#[MAC_ADDRESS]'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Funções de Data
function getMonthlyBalance(monthsAgo = 0) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
    });

    return {
        income: calculateTotal('income', monthTransactions),
        expenses: calculateTotal('expense', monthTransactions)
    };
}

// Funções de Formatação
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

// Sistema de Notificações
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fadeOut');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Funções Auxiliares para Metas
function addProgressToGoal(goalId) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const amount = prompt('Quanto você quer adicionar ao progresso?');
    if (!amount || isNaN(amount)) return;

    const value = parseFloat(amount);
    if (value <= 0) {
        showNotification('Por favor, insira um valor válido', 'error');
        return;
    }

    goal.current += value;
    if (goal.current >= goal.amount) {
        showNotification('Parabéns! Você atingiu sua meta!', 'success');
    }

    localStorage.setItem('goals', JSON.stringify(goals));
    updateGoalsView();
}

// Inicialização de Formulários
function initializeAllForms() {
    document.getElementById('transactionForm')?.addEventListener('submit', handleTransactionSubmit);
    document.getElementById('cardForm')?.addEventListener('submit', handleCardSubmit);
    document.getElementById('goalForm')?.addEventListener('submit', handleGoalSubmit);
    document.getElementById('investmentForm')?.addEventListener('submit', handleInvestmentSubmit);
    document.getElementById('creditCardExpenseForm')?.addEventListener('submit', handleCreditCardExpenseSubmit);
}

// Event Listeners Globais
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Atualização Automática
setInterval(updateAllViews, 60000); // Atualiza a cada minuto

// Funções de Investimentos
function updateInvestmentsTable() {
    const tableBody = document.querySelector('#investmentsTable');
    if (!tableBody) return;

    tableBody.innerHTML = investments.map(inv => {
        const currentValue = calculateInvestmentValue(inv);
        const profit = currentValue - inv.amount;
        const profitPercentage = ((currentValue / inv.amount) - 1) * 100;
        
        return `
            <tr>
                <td>${inv.name}</td>
                <td>${inv.type}</td>
                <td>${formatCurrency(currentValue)}</td>
                <td>${inv.rate}% a.a.</td>
                <td>${formatDate(inv.maturity)}</td>
                <td>
                    <button class="action-btn" onclick="showInvestmentDetails('${inv.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="redeemInvestment('${inv.id}')">
                        <i class="fas fa-money-bill-wave"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function showInvestmentDetails(id) {
    const investment = investments.find(inv => inv.id === id);
    if (!investment) return;

    const currentValue = calculateInvestmentValue(investment);
    const profit = currentValue - investment.amount;
    
    alert(`
        Detalhes do Investimento:
        Nome: ${investment.name}
        Tipo: ${investment.type}
        Valor Inicial: ${formatCurrency(investment.amount)}
        Valor Atual: ${formatCurrency(currentValue)}
        Lucro: ${formatCurrency(profit)}
        Taxa: ${investment.rate}% a.a.
        Data de Vencimento: ${formatDate(investment.maturity)}
    `);
}

function redeemInvestment(id) {
    if (!confirm('Tem certeza que deseja resgatar este investimento?')) return;

    const investment = investments.find(inv => inv.id === id);
    if (!investment) return;

    const currentValue = calculateInvestmentValue(investment);
    
    // Registra o resgate como uma transação
    transactions.push({
        id: Date.now().toString(),
        description: `Resgate: ${investment.name}`,
        amount: currentValue,
        type: 'income',
        category: 'investment_redemption',
        date: new Date().toISOString()
    });

    // Remove o investimento
    investments = investments.filter(inv => inv.id !== id);

    // Atualiza localStorage
    localStorage.setItem('investments', JSON.stringify(investments));
    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateAllViews();
    showNotification('Investimento resgatado com sucesso!', 'success');
}
