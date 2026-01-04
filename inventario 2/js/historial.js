// Variables para el historial
let movements = [];
let currentHistoryPage = 1;
const historyItemsPerPage = 10;
let filteredMovements = [];

// Inicializar página de historial
document.addEventListener('DOMContentLoaded', function() {
    // Cargar movimientos desde localStorage
    loadMovements();
    
    // Configurar eventos
    setupHistoryEvents();
    
    // Cargar tabla de historial
    renderHistoryTable();
    
    // Actualizar fecha
    updateCurrentDate();
});

// Cargar movimientos
function loadMovements() {
    const storedMovements = localStorage.getItem('movements');
    movements = storedMovements ? JSON.parse(storedMovements) : [];
    
    // Si no hay movimientos, cargar algunos de ejemplo
    if (movements.length === 0) {
        movements = getSampleMovements();
        localStorage.setItem('movements', JSON.stringify(movements));
    }
    
    filteredMovements = [...movements];
    
    // Actualizar contadores
    updateHistoryCounters();
}

// Obtener movimientos de ejemplo
function getSampleMovements() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const sampleProducts = products.length > 0 ? products : getSampleProducts();
    
    const sampleMovements = [];
    const movementTypes = ['entrada', 'salida', 'ajuste'];
    const reasons = [
        'Compra proveedor',
        'Venta a cliente',
        'Ajuste de inventario',
        'Devolución',
        'Pérdida',
        'Transferencia'
    ];
    
    const users = ['Administrador', 'Usuario Demo', 'Carlos Rodríguez', 'Ana García'];
    
    // Crear 20 movimientos de ejemplo
    for (let i = 1; i <= 20; i++) {
        const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        const movementType = movementTypes[Math.floor(Math.random() * movementTypes.length)];
        const quantity = Math.floor(Math.random() * 50) + 1;
        const previousStock = Math.floor(Math.random() * 100);
        let newStock;
        
        if (movementType === 'entrada') {
            newStock = previousStock + quantity;
        } else if (movementType === 'salida') {
            newStock = Math.max(0, previousStock - quantity);
        } else {
            newStock = quantity;
        }
        
        const movementDate = new Date();
        movementDate.setDate(movementDate.getDate() - Math.floor(Math.random() * 30));
        
        sampleMovements.push({
            id: i,
            productId: product.id,
            productName: product.name,
            type: movementType,
            quantity: quantity,
            previousStock: previousStock,
            newStock: newStock,
            reason: reasons[Math.floor(Math.random() * reasons.length)],
            date: movementDate.toISOString(),
            user: users[Math.floor(Math.random() * users.length)]
        });
    }
    
    // Ordenar por fecha (más reciente primero)
    sampleMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return sampleMovements;
}

// Configurar eventos del historial
function setupHistoryEvents() {
    // Botón para generar reporte
    const generateReportBtn = document.getElementById('generateReport');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', () => showReportModal());
    }
    
    // Búsqueda
    const searchHistoryInput = document.getElementById('searchHistoryInput');
    if (searchHistoryInput) {
        searchHistoryInput.addEventListener('input', filterMovements);
    }
    
    // Filtros
    const movementTypeFilter = document.getElementById('movementTypeFilter');
    if (movementTypeFilter) {
        movementTypeFilter.addEventListener('change', filterMovements);
    }
    
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', filterMovements);
    }
    
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) {
        startDateInput.addEventListener('change', filterMovements);
    }
    
    if (endDateInput) {
        endDateInput.addEventListener('change', filterMovements);
    }
    
    // Limpiar filtros
    const clearHistoryFiltersBtn = document.getElementById('clearHistoryFilters');
    if (clearHistoryFiltersBtn) {
        clearHistoryFiltersBtn.addEventListener('click', clearHistoryFilters);
    }
    
    // Paginación
    const prevHistoryPageBtn = document.getElementById('prevHistoryPage');
    const nextHistoryPageBtn = document.getElementById('nextHistoryPage');
    
    if (prevHistoryPageBtn) {
        prevHistoryPageBtn.addEventListener('click', () => {
            if (currentHistoryPage > 1) {
                currentHistoryPage--;
                renderHistoryTable();
            }
        });
    }
    
    if (nextHistoryPageBtn) {
        nextHistoryPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredMovements.length / historyItemsPerPage);
            if (currentHistoryPage < totalPages) {
                currentHistoryPage++;
                renderHistoryTable();
            }
        });
    }
    
    // Generar reporte
    const generateReportBtnModal = document.getElementById('generateReportBtn');
    if (generateReportBtnModal) {
        generateReportBtnModal.addEventListener('click', generateReport);
    }
}

// Renderizar tabla de historial
function renderHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;
    
    // Calcular índices para paginación
    const startIndex = (currentHistoryPage - 1) * historyItemsPerPage;
    const endIndex = startIndex + historyItemsPerPage;
    const paginatedMovements = filteredMovements.slice(startIndex, endIndex);
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Si no hay movimientos
    if (paginatedMovements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No se encontraron movimientos</td>
            </tr>
        `;
        updateHistoryPaginationInfo();
        return;
    }
    
    // Agregar movimientos a la tabla
    paginatedMovements.forEach(movement => {
        const row = document.createElement('tr');
        
        // Determinar clase según tipo
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
        
        // Formatear fecha
        const movementDate = new Date(movement.date);
        const formattedDate = movementDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${movement.productName}</td>
            <td><span class="badge ${typeClass}">${typeText}</span></td>
            <td>${movement.quantity}</td>
            <td>${movement.previousStock}</td>
            <td>${movement.newStock}</td>
            <td>${movement.user}</td>
            <td>${movement.reason}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Actualizar información de paginación
    updateHistoryPaginationInfo();
}

// Filtrar movimientos
function filterMovements() {
    const searchTerm = document.getElementById('searchHistoryInput').value.toLowerCase();
    const movementType = document.getElementById('movementTypeFilter').value;
    const dateFilterValue = document.getElementById('dateFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const now = new Date();
    let startDateFilter, endDateFilter;
    
    // Configurar filtros de fecha según selección
    if (dateFilterValue === 'today') {
        startDateFilter = new Date(now.setHours(0, 0, 0, 0));
        endDateFilter = new Date(now.setHours(23, 59, 59, 999));
    } else if (dateFilterValue === 'week') {
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startDateFilter = new Date(now.setDate(diff));
        startDateFilter.setHours(0, 0, 0, 0);
        endDateFilter = new Date(startDateFilter);
        endDateFilter.setDate(startDateFilter.getDate() + 6);
        endDateFilter.setHours(23, 59, 59, 999);
    } else if (dateFilterValue === 'month') {
        startDateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        endDateFilter = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDateFilter.setHours(23, 59, 59, 999);
    } else if (dateFilterValue === 'year') {
        startDateFilter = new Date(now.getFullYear(), 0, 1);
        endDateFilter = new Date(now.getFullYear(), 11, 31);
        endDateFilter.setHours(23, 59, 59, 999);
    }
    
    filteredMovements = movements.filter(movement => {
        // Filtrar por búsqueda
        const matchesSearch = !searchTerm || 
            movement.productName.toLowerCase().includes(searchTerm) ||
            movement.reason.toLowerCase().includes(searchTerm) ||
            movement.user.toLowerCase().includes(searchTerm);
        
        // Filtrar por tipo
        const matchesType = !movementType || movement.type === movementType;
        
        // Filtrar por fecha
        let matchesDate = true;
        const movementDate = new Date(movement.date);
        
        if (dateFilterValue) {
            matchesDate = movementDate >= startDateFilter && movementDate <= endDateFilter;
        }
        
        // Filtrar por rango de fechas personalizado
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            matchesDate = matchesDate && movementDate >= start;
        }
        
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchesDate = matchesDate && movementDate <= end;
        }
        
        return matchesSearch && matchesType && matchesDate;
    });
    
    // Volver a la primera página
    currentHistoryPage = 1;
    
    // Renderizar tabla
    renderHistoryTable();
    
    // Actualizar contadores
    updateHistoryCounters();
}

// Limpiar filtros del historial
function clearHistoryFilters() {
    document.getElementById('searchHistoryInput').value = '';
    document.getElementById('movementTypeFilter').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    
    filteredMovements = [...movements];
    currentHistoryPage = 1;
    renderHistoryTable();
    updateHistoryCounters();
}

// Actualizar contadores del historial
function updateHistoryCounters() {
    const totalEntries = filteredMovements.filter(m => m.type === 'entrada').length;
    const totalExits = filteredMovements.filter(m => m.type === 'salida').length;
    const totalAdjustments = filteredMovements.filter(m => m.type === 'ajuste').length;
    const totalMovements = filteredMovements.length;
    
    const totalEntriesElement = document.getElementById('totalEntriesCount');
    const totalExitsElement = document.getElementById('totalExitsCount');
    const totalAdjustmentsElement = document.getElementById('totalAdjustmentsCount');
    const totalMovementsElement = document.getElementById('totalMovementsCount');
    
    if (totalEntriesElement) totalEntriesElement.textContent = totalEntries;
    if (totalExitsElement) totalExitsElement.textContent = totalExits;
    if (totalAdjustmentsElement) totalAdjustmentsElement.textContent = totalAdjustments;
    if (totalMovementsElement) totalMovementsElement.textContent = totalMovements;
}

// Actualizar información de paginación del historial
function updateHistoryPaginationInfo() {
    const pageInfo = document.getElementById('historyPageInfo');
    const prevPageBtn = document.getElementById('prevHistoryPage');
    const nextPageBtn = document.getElementById('nextHistoryPage');
    
    if (!pageInfo) return;
    
    const totalPages = Math.ceil(filteredMovements.length / historyItemsPerPage);
    pageInfo.textContent = `Página ${currentHistoryPage} de ${totalPages}`;
    
    // Habilitar/deshabilitar botones
    if (prevPageBtn) {
        prevPageBtn.disabled = currentHistoryPage === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentHistoryPage === totalPages || totalPages === 0;
    }
}

// Mostrar modal de reporte
function showReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Generar reporte
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportFormat = document.getElementById('reportFormat').value;
    const reportStartDate = document.getElementById('reportStartDate').value;
    const reportEndDate = document.getElementById('reportEndDate').value;
    
    // Validaciones
    if (!reportType) {
        alert('Por favor, seleccione un tipo de reporte');
        return;
    }
    
    if (!reportFormat) {
        alert('Por favor, seleccione un formato de reporte');
        return;
    }
    
    // Filtrar datos según fechas
    let reportData = [];
    if (reportType === 'movimientos') {
        reportData = filteredMovements;
    } else if (reportType === 'stock') {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        reportData = products.map(product => ({
            Código: product.code,
            Producto: product.name,
            Categoría: product.category,
            Stock: product.stock,
            'Stock Mínimo': product.minStock,
            Precio: product.price,
            Estado: product.stock <= product.minStock ? 'Bajo Stock' : 'Normal'
        }));
    } else if (reportType === 'productos') {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        reportData = products;
    } else if (reportType === 'bajo_stock') {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        reportData = products.filter(p => p.stock <= p.minStock);
    }
    
    // Filtrar por fechas si están especificadas
    if (reportStartDate || reportEndDate) {
        if (reportType === 'movimientos') {
            reportData = reportData.filter(movement => {
                const movementDate = new Date(movement.date);
                
                if (reportStartDate) {
                    const start = new Date(reportStartDate);
                    start.setHours(0, 0, 0, 0);
                    if (movementDate < start) return false;
                }
                
                if (reportEndDate) {
                    const end = new Date(reportEndDate);
                    end.setHours(23, 59, 59, 999);
                    if (movementDate > end) return false;
                }
                
                return true;
            });
        }
    }
    
    // Generar reporte según formato
    if (reportFormat === 'csv') {
        generateCSVReport(reportData, reportType);
    } else if (reportFormat === 'excel') {
        generateExcelReport(reportData, reportType);
    } else {
        generatePDFReport(reportData, reportType);
    }
    
    // Cerrar modal
    closeModal(document.getElementById('reportModal'));
    
    // Mostrar notificación
    showNotification(`Reporte generado correctamente en formato ${reportFormat.toUpperCase()}`, 'success');
}

// Generar reporte CSV (simplificado)
function generateCSVReport(data, reportType) {
    if (data.length === 0) {
        alert('No hay datos para generar el reporte');
        return;
    }
    
    // Crear contenido CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
        Object.values(item).map(value => 
            typeof value === 'string' ? `"${value}"` : value
        ).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    // Limpiar
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Generar reporte Excel (simplificado - realmente genera CSV)
function generateExcelReport(data, reportType) {
    // En una implementación real, aquí se usaría una biblioteca como SheetJS
    // Por ahora, generamos un CSV con extensión .xls
    if (data.length === 0) {
        alert('No hay datos para generar el reporte');
        return;
    }
    
    // Crear contenido similar a CSV
    const headers = Object.keys(data[0]).join('\t');
    const rows = data.map(item => 
        Object.values(item).join('\t')
    );
    
    const excelContent = [headers, ...rows].join('\n');
    
    // Crear y descargar archivo
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    
    // Limpiar
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Generar reporte PDF (simplificado)
function generatePDFReport(data, reportType) {
    // En una implementación real, aquí se usaría una biblioteca como jsPDF
    // Por ahora, mostramos los datos en una nueva ventana
    if (data.length === 0) {
        alert('No hay datos para generar el reporte');
        return;
    }
    
    // Crear tabla HTML para mostrar
    const headers = Object.keys(data[0]);
    let tableHTML = `
        <html>
        <head>
            <title>Reporte ${reportType}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <h1>Reporte: ${reportType}</h1>
            <p>Generado: ${new Date().toLocaleString()}</p>
            <p>Total registros: ${data.length}</p>
            <table>
                <thead>
                    <tr>
    `;
    
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    
    tableHTML += `</tr></thead><tbody>`;
    
    data.forEach(item => {
        tableHTML += `<tr>`;
        headers.forEach(header => {
            tableHTML += `<td>${item[header]}</td>`;
        });
        tableHTML += `</tr>`;
    });
    
    tableHTML += `</tbody></table></body></html>`;
    
    // Abrir en nueva ventana para "imprimir como PDF"
    const newWindow = window.open();
    newWindow.document.write(tableHTML);
    newWindow.document.close();
    
    // Dar opción de imprimir
    setTimeout(() => {
        newWindow.print();
    }, 500);
}

// Función auxiliar para cerrar modal
function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Actualizar fecha actual
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('es-ES', options);
    }
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    // Implementación similar a la función en app.js
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(message); // Simplificación para este ejemplo
}

// Función auxiliar para obtener productos de ejemplo
function getSampleProducts() {
    // Esta función está definida en productos.js, aquí la replicamos brevemente
    return [
        {
            id: 1,
            code: 'UT-001',
            name: 'Cuaderno Profesional 100 hojas',
            category: 'papeleria',
            stock: 45,
            minStock: 20,
            price: 8.50
        },
        {
            id: 2,
            code: 'UT-002',
            name: 'Lápices HB paquete x12',
            category: 'escritura',
            stock: 15,
            minStock: 30,
            price: 4.20
        }
    ];
}