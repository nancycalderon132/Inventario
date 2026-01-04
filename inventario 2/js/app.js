// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación en páginas protegidas
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('productos.html') || 
        window.location.pathname.includes('historial.html')) {
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        // Mostrar información del usuario
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = currentUser.name || 'Usuario';
        }
        if (document.getElementById('userRole')) {
            document.getElementById('userRole').textContent = currentUser.role === 'admin' ? 'Administrador' : 'Usuario';
        }
        
        // Controlar acceso según rol
        if (currentUser.role !== 'admin') {
            const adminOnlyElements = document.querySelectorAll('.admin-only');
            adminOnlyElements.forEach(el => {
                el.style.display = 'none';
            });
        }
    }
    
    // Actualizar fecha actual
    updateCurrentDate();
    
    // Inicializar funcionalidades específicas de cada página
    const path = window.location.pathname;
    if (path.includes('dashboard.html')) {
        initDashboard();
    }
    
    // Configurar eventos de modales
    setupModalEvents();
    
    // Configurar logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLogoutModal();
        });
    }
    
    // Confirmar logout
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});

// Actualizar fecha actual
function updateCurrentDate() {
    const dateElements = document.querySelectorAll('#currentDate');
    if (dateElements.length > 0) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = now.toLocaleDateString('es-ES', options);
        
        dateElements.forEach(element => {
            element.textContent = formattedDate;
        });
    }
}

// Configurar eventos de modales
function setupModalEvents() {
    // Cerrar modales al hacer clic en la X
    const closeButtons = document.querySelectorAll('.close, .close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Cerrar modales al hacer clic fuera del contenido
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
}

// Mostrar modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Cerrar modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Mostrar modal de logout
function showLogoutModal() {
    showModal('logoutModal');
}

// Inicializar dashboard
function initDashboard() {
    // Cargar datos del dashboard
    loadDashboardData();
    
    // Inicializar gráfico
    initChart();
    
    // Cargar movimientos recientes
    loadRecentMovements();
}

// Cargar datos del dashboard
function loadDashboardData() {
    // Simular datos desde localStorage o API
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const movements = JSON.parse(localStorage.getItem('movements')) || [];
    
    // Actualizar contadores
    if (document.getElementById('totalProducts')) {
        document.getElementById('totalProducts').textContent = products.length;
    }
    
    if (document.getElementById('lowStockProducts')) {
        const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
        document.getElementById('lowStockProducts').textContent = lowStockCount;
    }
    
    if (document.getElementById('totalEntries')) {
        const currentMonth = new Date().getMonth();
        const monthlyEntries = movements.filter(m => 
            m.type === 'entrada' && new Date(m.date).getMonth() === currentMonth
        ).length;
        document.getElementById('totalEntries').textContent = monthlyEntries;
    }
    
    if (document.getElementById('totalExits')) {
        const currentMonth = new Date().getMonth();
        const monthlyExits = movements.filter(m => 
            m.type === 'salida' && new Date(m.date).getMonth() === currentMonth
        ).length;
        document.getElementById('totalExits').textContent = monthlyExits;
    }
}

// Inicializar gráfico
function initChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    // Datos de ejemplo
    const data = {
        labels: ['Lápices', 'Cuadernos', 'Borradores', 'Reglas', 'Tijeras', 'Pegamento'],
        datasets: [{
            label: 'Unidades Vendidas',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: [
                'rgba(106, 17, 203, 0.7)',
                'rgba(37, 117, 252, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
                'rgb(106, 17, 203)',
                'rgb(37, 117, 252)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 159, 64)',
                'rgb(153, 102, 255)'
            ],
            borderWidth: 1
        }]
    };
    
    const config = {
        type: 'bar',
        data: data,
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
    };
    
    new Chart(ctx, config);
    
    // Filtrar datos del gráfico
    const chartFilter = document.getElementById('chartFilter');
    if (chartFilter) {
        chartFilter.addEventListener('change', function() {
            // Aquí se actualizarían los datos según el filtro
            console.log('Filtro de gráfico cambiado a:', this.value);
        });
    }
}

// Cargar movimientos recientes
function loadRecentMovements() {
    const tbody = document.getElementById('recentMovements');
    if (!tbody) return;
    
    // Obtener movimientos desde localStorage
    const movements = JSON.parse(localStorage.getItem('movements')) || [];
    
    // Ordenar por fecha (más reciente primero)
    movements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Tomar los primeros 5 movimientos
    const recentMovements = movements.slice(0, 5);
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Si no hay movimientos
    if (recentMovements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay movimientos recientes</td>
            </tr>
        `;
        return;
    }
    
    // Agregar movimientos a la tabla
    recentMovements.forEach(movement => {
        const row = document.createElement('tr');
        
        // Obtener nombre del producto
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === movement.productId);
        const productName = product ? product.name : 'Producto desconocido';
        
        // Determinar color según tipo
        let typeClass = '';
        let typeText = '';
        
        switch(movement.type) {
            case 'entrada':
                typeClass = 'badge-success';
                typeText = 'Entrada';
                break;
            case 'salida':
                typeClass = 'badge-danger';
                typeText = 'Salida';
                break;
            case 'ajuste':
                typeClass = 'badge-warning';
                typeText = 'Ajuste';
                break;
        }
        
        row.innerHTML = `
            <td>${productName}</td>
            <td><span class="badge ${typeClass}">${typeText}</span></td>
            <td>${movement.quantity}</td>
            <td>${formatDate(movement.date)}</td>
            <td>${movement.user || 'Sistema'}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 500px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Agregar estilos CSS para la animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: inherit;
        }
    `;
    document.head.appendChild(style);
    
    // Agregar al documento
    document.body.appendChild(notification);
    
    // Configurar cierre automático
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Cerrar automáticamente después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}