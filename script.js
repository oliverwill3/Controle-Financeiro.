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

// Navegação do Dashboard
function initializeDashboardViews() {
    const viewButtons = document.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const viewId = this.getAttribute('data-view');
            document.querySelectorAll('.dashboard-view').forEach(view => {
                view.classList.remove('active');
            });
            document.getElementById(viewId)?.classList.add('active');
        });
    });
}

// Inicialização de Formulários
function initializeAllForms() {
    document.getElementById('transactionForm')?.addEventListener('submit', handleTransactionSubmit);
    document.getElementById('cardForm')?.addEventListener('submit', handleCardSubmit);
    document.getElementById('goalForm')?.addEventListener('submit', handleGoalSubmit);
    document.getElementById('investmentForm')?.addEventListener('submit', handleInvestmentSubmit);
    document.getElementById('creditCardExpenseForm')?.addEventListener('submit', handleCreditCardExpenseSubmit);

}

// Funções do Modal
function openTransactionModal(type = 'expense') {
    document.getElementById('transactionModal').style.display = 'flex';
    document.getElementById('type').value = type;
}
// Funções de Modal
function openTransactionModal(type = 'expense') {
    const modal = document.getElementById('transactionModal');
    document.getElementById('type').value = type;
    modal.style.display = 'flex';
}

function openInvestmentModal() {
    const modal = document.getElementById('investmentModal');
    document.getElementById('investmentDate').valueAsDate = new Date();
    modal.style.display = 'flex';
}

function openGoalModal() {
    const modal = document.getElementById('goalModal');
    modal.style.display = 'flex';
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

// Função para mostrar notificações
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function closeTransactionModal() {
    document.getElementById('transactionModal').style.display = 'none';
    document.getElementById('transactionForm').reset();
}

function openInvestmentModal() {
    document.getElementById('investmentModal').style.display = 'flex';
    // Preenche a data atual como padrão
    document.getElementById('investmentDate').valueAsDate = new Date();
}

function closeInvestmentModal() {
    document.getElementById('investmentModal').style.display = 'none';
    document.getElementById('investmentForm').reset();
}

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

// Navegação do Dashboard
function initializeDashboardViews() {
    const viewButtons = document.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const viewId = this.getAttribute('data-view');
            document.querySelectorAll('.dashboard-view').forEach(view => {
                view.classList.remove('active');
            });
            document.getElementById(viewId)?.classList.add('active');
        });
    });
}

// Inicialização de Formulários
function initializeAllForms() {
    document.getElementById('transactionForm')?.addEventListener('submit', handleTransactionSubmit);
    document.getElementById('cardForm')?.addEventListener('submit', handleCardSubmit);
    document.getElementById('goalForm')?.addEventListener('submit', handleGoalSubmit);
    document.getElementById('investmentForm')?.addEventListener('submit', handleInvestmentSubmit);
}

// Funções do Modal
function openTransactionModal(type = 'expense') {
    document.getElementById('transactionModal').style.display = 'flex';
    document.getElementById('type').value = type;
}

function closeTransactionModal() {
    document.getElementById('transactionModal').style.display = 'none';
    document.getElementById('transactionForm').reset();
}

function openInvestmentModal() {
    document.getElementById('investmentModal').style.display = 'flex';
    // Preenche a data atual como padrão
    document.getElementById('investmentDate').valueAsDate = new Date();
}

function closeInvestmentModal() {
    document.getElementById('investmentModal').style.display = 'none';
    document.getElementById('investmentForm').reset();
}

// Funções de Atualização de Views
function updateAllViews() {
    updateOverview();
    updateDailyView();
    updateMonthlyView();
    updateCardsView();
    updateGoalsView();
    updateInvestmentsView();
}

function updateOverview() {
    const income = calculateTotal('income');
    const expenses = calculateTotal('expense');
    const investmentsTotal = calculateInvestmentsTotal();
    const totalPatrimony = income - expenses + investmentsTotal;

    document.querySelector('#overview .balance').textContent = formatCurrency(totalPatrimony);
    document.querySelector('#overview .income').textContent = formatCurrency(income);
    document.querySelector('#overview .expenses').textContent = formatCurrency(expenses);
    document.querySelector('#overview .investments').textContent = formatCurrency(investmentsTotal);

    const investmentReturn = calculateTotalInvestmentReturn();
    const investmentTrend = document.querySelector('.investments-trend');
    if (investmentTrend) {
        investmentTrend.textContent = `${investmentReturn > 0 ? '+' : ''}${investmentReturn.toFixed(2)}% total`;
        investmentTrend.className = `trend ${investmentReturn >= 0 ? 'positive' : 'negative'}`;
    }

    updateCharts();
}

function updateInvestmentsView() {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const currentTotal = calculateInvestmentsTotal();
    const totalReturn = ((currentTotal - totalInvested) / totalInvested) * 100 || 0;
    
    document.getElementById('totalInvested').textContent = formatCurrency(currentTotal);
    document.getElementById('totalReturn').textContent = totalReturn.toFixed(2) + '%';
    
    // Calcula rendimentos do mês atual
    const monthlyReturn = calculateMonthlyReturns();
    document.getElementById('monthlyReturn').textContent = formatCurrency(monthlyReturn);
    
    // Calcula vencimentos próximos
    const upcomingCount = countUpcomingMaturities();
    document.getElementById('upcomingMaturity').textContent = upcomingCount;

    updateInvestmentsTable();
}

function updateInvestmentsTable() {
    const tableBody = document.getElementById('investmentsTable');
    if (!tableBody) return;

    tableBody.innerHTML = investments.map(inv => {
        const currentValue = calculateCurrentValue(inv);
        const returnRate = ((currentValue - inv.amount) / inv.amount) * 100;
        
        return `
            <tr>
                <td>${inv.name}</td>
                <td>${formatInvestmentType(inv.type)}</td>
                <td>${formatCurrency(currentValue)}</td>
                <td>${inv.rate}% a.a.</td>
                <td>${new Date(inv.maturity).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn" onclick="showInvestmentDetails('${inv.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="redeemInvestment('${inv.id}')">
                        <i class="fas fa-money-bill-wave"></i>
                    </button>
                    <button class="action-btn" onclick="deleteInvestment('${inv.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateDailyView() {
    

    const income = calculateTotal('income', dailyTransactions);
    const expenses = calculateTotal('expense', dailyTransactions);
    const balance = income - expenses;

    document.getElementById('dailyIncome').textContent = formatCurrency(income);
    document.getElementById('dailyExpenses').textContent = formatCurrency(expenses);
    document.getElementById('dailyBalance').textContent = formatCurrency(balance);

    updateDailyTransactionsTable(dailyTransactions);
}

function updateMonthlyView() {
  
    
    
    const income = calculateTotal('income', monthlyTransactions);
    const expenses = calculateTotal('expense', monthlyTransactions);
    const balance = income - expenses;

    document.getElementById('monthlyIncome').textContent = formatCurrency(income);
    document.getElementById('monthlyExpenses').textContent = formatCurrency(expenses);
    document.getElementById('monthlyTotal').textContent = formatCurrency(balance);
}

// Funções de Navegação Temporal
function previousDay() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDailyView();
}

function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDailyView();
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateMonthlyView();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthlyView();
}

// Funções de Investimento
function redeemInvestment(id) {
    const investment = investments.find(inv => inv.id === id);
    if (!investment) return;

    const currentValue = calculateCurrentValue(investment);
    const today = new Date();
    const investmentDate = new Date(investment.date);
    const maturityDate = new Date(investment.maturity);

    // Verifica condições de resgate
    if (investment.liquidity === 'maturity' && today < maturityDate) {
        showNotification('Este investimento só pode ser resgatado no vencimento!', 'error');
        return;
    }

    if (investment.liquidity === 'custom') {
        const graceDays = parseInt(investment.gracePeriod);
        const daysInvested = Math.floor((today - investmentDate) / (1000 * 60 * 60 * 24));
        if (daysInvested < graceDays) {
            showNotification(`Período de carência de ${graceDays} dias não atingido!`, 'error');
            return;
        }
    }

    if (confirm(`Deseja resgatar ${formatCurrency(currentValue)}?`)) {
        // Registra o resgate como uma transação
        const transaction = {
            id: Date.now().toString() + '_red',
            description: `Resgate: ${investment.name}`,
            amount: currentValue,
            type: 'income',
            category: 'investment_redemption',
            date: new Date().toISOString()
        };

        transactions.push(transaction);
        investments = investments.filter(inv => inv.id !== id);
        
        localStorage.setItem('investments', JSON.stringify(investments));
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        updateAllViews();
        showNotification('Investimento resgatado com sucesso!', 'success');
    }
}

function deleteInvestment(id) {
    if (confirm('Tem certeza que deseja excluir este investimento?')) {
        investments = investments.filter(inv => inv.id !== id);
        localStorage.setItem('investments', JSON.stringify(investments));
        updateAllViews();
        showNotification('Investimento excluído com sucesso!', 'success');
    }
}

// Configuração dos Gráficos
function setupCharts() {
    setupBalanceChart();
    setupExpensesChart();
}

function setupBalanceChart() {
    const ctx = document.getElementById('balanceChart')?.getContext('2d');
    if (!ctx) return;

    const labels = Array.from({length: 6}, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return d.toLocaleDateString('pt-BR', { month: 'short' });
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Patrimônio Total',
                data: calculateMonthlyPatrimony(),
                borderColor: '#2563eb',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function setupExpensesChart() {
    const ctx = document.getElementById('expensesChart')?.getContext('2d');
    if (!ctx) return;

    const expensesByCategory = calculateExpensesByCategory();

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(expensesByCategory),
            datasets: [{
                data: Object.values(expensesByCategory),
                backgroundColor: [
                    '#059669',
                    '#d97706',
                    '#dc2626',
                    '#2563eb',
                    '[MAC_ADDRESS]'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function calculateMonthlyPatrimony() {
    const months = Array.from({length: 6}, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return date;
    });

    return months.map(date => {
        const monthTransactions = getMonthlyTransactions(date);
        const income = calculateTotal('income', monthTransactions);
        const expenses = calculateTotal('expense', monthTransactions);
        return income - expenses;
    });
}

function calculateExpensesByCategory() {
    const categories = {};
    const monthTransactions = getMonthlyTransactions(new Date());
    
    monthTransactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
    
    return categories;
}

// Sistema de Notificações
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners Globais
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Atualiza campos do investimento baseado no tipo
function updateInvestmentFields() {
    const type = document.getElementById('investmentType').value;
    const customGracePeriod = document.getElementById('customGracePeriod');
    const liquiditySelect = document.getElementById('investmentLiquidity');
    
    if (type === 'poupanca') {
        liquiditySelect.value = 'daily';
        document.getElementById('investmentRate').value = '6.17'; // Taxa atual aproximada
        customGracePeriod.style.display = 'none';
    } else {
        customGracePeriod.style.display = 
            liquiditySelect.value === 'custom' ? 'block' : 'none';
    }
}

// Funções do Modal de Cartão de Crédito
function openCreditCardExpenseModal() {
    const modal = document.getElementById('creditCardExpenseModal');
    const select = document.getElementById('creditCardSelect');
    
    // Preenche o select com os cartões disponíveis
    select.innerHTML = cards.map(card => 
        `<option value="${card.id}">${card.name}</option>`
    ).join('');
    
    if (cards.length === 0) {
        showNotification('Adicione um cartão primeiro!', 'warning');
        return;
    }
    
    modal.style.display = 'flex';
}

function closeCreditCardExpenseModal() {
    document.getElementById('creditCardExpenseModal').style.display = 'none';
    document.getElementById('creditCardExpenseForm').reset();
}

// Handler para despesas no cartão
document.getElementById('creditCardExpenseForm')?.addEventListener('submit', function(e) {
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
        date: new Date().toISOString(),
        cardId: cardId
    };
    
    // Adiciona a despesa ao cartão
    card.purchases = card.purchases || [];
    card.purchases.push(expense);
    
    // Atualiza o localStorage
    localStorage.setItem('cards', JSON.stringify(cards));
    
    closeCreditCardExpenseModal();
    updateCardsView();
    showNotification('Despesa no cartão adicionada com sucesso!', 'success');
});

// Atualiza a exibição dos cartões
function updateCardsView() {
    const cardsContainer = document.getElementById('cardsList');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = cards.map(card => {
        const totalPurchases = card.purchases?.reduce((total, p) => total + p.amount, 0) || 0;
        const availableLimit = card.limit - totalPurchases;
        
        return `
            <div class="card">
                <h3>${card.name}</h3>
                <p class="balance">Limite: ${formatCurrency(card.limit)}</p>
                <p class="expenses">Utilizado: ${formatCurrency(totalPurchases)}</p>
                <p class="available">Disponível: ${formatCurrency(availableLimit)}</p>
                <small>Fecha dia ${card.closingDay}</small>
                
                <div class="card-purchases">
                    <h4>Compras Recentes</h4>
                    ${card.purchases ? card.purchases.slice(-3).map(p => `
                        <div class="purchase-item">
                            <span>${p.description}</span>
                            <span>${formatCurrency(p.amount)}</span>
                            ${p.totalInstallments > 1 ? 
                                `<small class="installment-info">${p.currentInstallment}/${p.totalInstallments}x de ${formatCurrency(p.installmentAmount)}</small>` 
                                : ''}
                        </div>
                    `).join('') : 'Nenhuma compra recente'}
                </div>
                
                <div class="card-actions">
                    <button class="action-btn" onclick="showCardDetails('${card.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="deleteCard('${card.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Função para mostrar detalhes do cartão
function showCardDetails(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    // Aqui você pode implementar uma visualização detalhada do cartão
    // Por exemplo, abrindo um novo modal com todas as compras
    alert(`Detalhes do cartão ${card.name}\nEm breve: visualização detalhada`);
}