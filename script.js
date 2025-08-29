document.addEventListener('DOMContentLoaded', function() {
    // Navegação
    const menuItems = document.querySelectorAll('.sidebar li');
    const pages = document.querySelectorAll('.page');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const pageId = this.getAttribute('data-page');
            pages.forEach(page => page.classList.remove('active'));
            
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });

    // Inicialização dos gráficos
    initializeCharts();
});

function initializeCharts() {
    // Gráfico de Evolução do Saldo
    const balanceCtx = document.getElementById('balanceChart');
    if (balanceCtx) {
        new Chart(balanceCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Saldo',
                    data: [0, 1000, 800, 1500, 2000, 1800],
                    borderColor: '#2563eb',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Gráfico de Distribuição de Gastos
    const expensesCtx = document.getElementById('expensesChart');
    if (expensesCtx) {
        new Chart(expensesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Outros'],
                datasets: [{
                    data: [30, 20, 15, 10, 25],
                    backgroundColor: [
                        '#2563eb',
                        '#7c3aed',
                        '#db2777',
                        '[MAC_ADDRESS]',
                        '[MAC_ADDRESS]'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
}