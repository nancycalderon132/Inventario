// Variables globales
let products = [];
let currentPage = 1;
const itemsPerPage = 10;
let filteredProducts = [];

// Inicializar página de productos
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos desde localStorage
    loadProducts();
    
    // Configurar eventos
    setupProductEvents();
    
    // Cargar tabla de productos
    renderProductsTable();
    
    // Actualizar fecha
    updateCurrentDate();
});

// Cargar productos
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    products = storedProducts ? JSON.parse(storedProducts) : [];
    
    // Si no hay productos, cargar algunos de ejemplo
    if (products.length === 0) {
        products = getSampleProducts();
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    filteredProducts = [...products];
}

// Obtener productos de ejemplo
function getSampleProducts() {
    return [
        {
            id: 1,
            code: 'UT-001',
            name: 'Cuaderno Profesional 100 hojas',
            category: 'papeleria',
            description: 'Cuaderno profesional con espiral, 100 hojas rayadas',
            stock: 45,
            minStock: 20,
            price: 8.50,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            code: 'UT-002',
            name: 'Lápices HB paquete x12',
            category: 'escritura',
            description: 'Paquete de 12 lápices de grafito HB',
            stock: 15,
            minStock: 30,
            price: 4.20,
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            code: 'UT-003',
            name: 'Bolígrafo azul punta fina',
            category: 'escritura',
            description: 'Bolígrafo de tinta azul, punta fina 0.7mm',
            stock: 120,
            minStock: 50,
            price: 1.20,
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            code: 'UT-004',
            name: 'Borrador blanco',
            category: 'escritura',
            description: 'Borrador blanco para lápiz',
            stock: 85,
            minStock: 40,
            price: 0.80,
            createdAt: new Date().toISOString()
        },
        {
            id: 5,
            code: 'UT-005',
            name: 'Regla de 30 cm',
            category: 'organizacion',
            description: 'Regla de plástico transparente 30 cm',
            stock: 60,
            minStock: 25,
            price: 2.50,
            createdAt: new Date().toISOString()
        },
        {
            id: 6,
            code: 'UT-006',
            name: 'Tijeras escolares punta roma',
            category: 'organizacion',
            description: 'Tijeras de acero inoxidable, punta roma para seguridad',
            stock: 35,
            minStock: 15,
            price: 5.80,
            createdAt: new Date().toISOString()
        },
        {
            id: 7,
            code: 'UT-007',
            name: 'Pegamento en barra 40g',
            category: 'arte',
            description: 'Pegamento en barra sólido, no tóxico',
            stock: 10,
            minStock: 25,
            price: 3.20,
            createdAt: new Date().toISOString()
        },
        {
            id: 8,
            code: 'UT-008',
            name: 'Mochila escolar antirrobo',
            category: 'mochilas',
            description: 'Mochila con múltiples compartimentos y sistema antirrobo',
            stock: 18,
            minStock: 10,
            price: 45.90,
            createdAt: new Date().toISOString()
        },
        {
            id: 9,
            code: 'UT-009',
            name: 'Cartuchera con cierre',
            category: 'organizacion',
            description: 'Cartuchera de tela con cierre y múltiples bolsillos',
            stock: 42,
            minStock: 20,
            price: 12.50,
            createdAt: new Date().toISOString()
        },
        {
            id: 10,
            code: 'UT-010',
            name: 'Marcadores fluorescentes x6',
            category: 'arte',
            description: 'Set de 6 marcadores fluorescentes de diferentes colores',
            stock: 28,
            minStock: 15,
            price: 7.80,
            createdAt: new Date().toISOString()
        }
    ];
}

// Configurar eventos
function setupProductEvents() {
    // Botón para agregar producto
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => showProductModal());
    }
    
    // Guardar producto
    const saveProductBtn = document.getElementById('saveProduct');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveProduct);
    }
    
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    // Filtros
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    const stockFilter = document.getElementById('stockFilter');
    if (stockFilter) {
        stockFilter.addEventListener('change', filterProducts);
    }
    
    // Limpiar filtros
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    // Paginación
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProductsTable();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProductsTable();
            }
        });
    }
}

// Renderizar tabla de productos
function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    // Calcular índices para paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Si no hay productos
    if (paginatedProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No se encontraron productos</td>
            </tr>
        `;
        updatePaginationInfo();
        return;
    }
    
    // Agregar productos a la tabla
    paginatedProducts.forEach(product => {
        const row = document.createElement('tr');
        
        // Determinar estado del stock
        let stockStatus = '';
        let stockClass = '';
        
        if (product.stock <= product.minStock) {
            stockStatus = 'Bajo Stock';
            stockClass = 'badge-danger';
        } else if (product.stock <= product.minStock * 2) {
            stockStatus = 'Stock Normal';
            stockClass = 'badge-warning';
        } else {
            stockStatus = 'Stock Alto';
            stockClass = 'badge-success';
        }
        
        // Determinar nombre de categoría
        const categoryNames = {
            'papeleria': 'Papelería',
            'escritura': 'Escritura',
            'mochilas': 'Mochilas',
            'organizacion': 'Organización',
            'arte': 'Arte',
            'otros': 'Otros'
        };
        
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${categoryNames[product.category] || product.category}</td>
            <td>${product.stock}</td>
            <td>${product.minStock}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="badge ${stockClass}">${stockStatus}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" data-id="${product.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-movement" data-id="${product.id}" data-name="${product.name}" data-stock="${product.stock}" title="Movimiento">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                    <button class="btn-action btn-delete" data-id="${product.id}" data-name="${product.name}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Configurar eventos de botones de acción
    setupActionButtons();
    
    // Actualizar información de paginación
    updatePaginationInfo();
}

// Configurar botones de acción
function setupActionButtons() {
    // Botones de editar
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    // Botones de movimiento
    const movementButtons = document.querySelectorAll('.btn-movement');
    movementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const productName = this.getAttribute('data-name');
            const currentStock = parseInt(this.getAttribute('data-stock'));
            showStockModal(productId, productName, currentStock);
        });
    });
    
    // Botones de eliminar
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const productName = this.getAttribute('data-name');
            showDeleteModal(productId, productName);
        });
    });
}

// Mostrar modal de producto
function showProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const productForm = document.getElementById('productForm');
    
    if (!modal || !modalTitle || !productForm) return;
    
    // Limpiar formulario
    productForm.reset();
    
    if (product) {
        // Modo edición
        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Producto';
        
        document.getElementById('productId').value = product.id;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productName').value = product.name;
        document.getElementById('category').value = product.category;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        document.getElementById('minStock').value = product.minStock;
        document.getElementById('description').value = product.description || '';
    } else {
        // Modo creación
        modalTitle.innerHTML = '<i class="fas fa-box"></i> Nuevo Producto';
        document.getElementById('productId').value = '';
        
        // Generar código automático
        const lastProduct = products[products.length - 1];
        let nextCode = 'UT-001';
        
        if (lastProduct && lastProduct.code) {
            const lastCodeNum = parseInt(lastProduct.code.split('-')[1]);
            if (!isNaN(lastCodeNum)) {
                nextCode = `UT-${(lastCodeNum + 1).toString().padStart(3, '0')}`;
            }
        }
        
        document.getElementById('productCode').value = nextCode;
    }
    
    // Mostrar modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Guardar producto
function saveProduct() {
    // Obtener valores del formulario
    const productId = document.getElementById('productId').value;
    const code = document.getElementById('productCode').value;
    const name = document.getElementById('productName').value;
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const minStock = parseInt(document.getElementById('minStock').value);
    const description = document.getElementById('description').value;
    
    // Validaciones
    if (!code || !name || !category || isNaN(price) || isNaN(stock) || isNaN(minStock)) {
        alert('Por favor, complete todos los campos requeridos correctamente');
        return;
    }
    
    if (stock < 0 || minStock < 0 || price < 0) {
        alert('Los valores de stock y precio no pueden ser negativos');
        return;
    }
    
    if (productId) {
        // Editar producto existente
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                code,
                name,
                category,
                price,
                stock,
                minStock,
                description,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Crear nuevo producto
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            code,
            name,
            category,
            description,
            stock,
            minStock,
            price,
            createdAt: new Date().toISOString()
        };
        
        products.push(newProduct);
    }
    
    // Guardar en localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Actualizar productos filtrados
    filteredProducts = [...products];
    
    // Cerrar modal
    closeModal(document.getElementById('productModal'));
    
    // Recargar tabla
    renderProductsTable();
    
    // Mostrar notificación
    showNotification(productId ? 'Producto actualizado correctamente' : 'Producto creado correctamente', 'success');
}

// Editar producto
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showProductModal(product);
    }
}

// Mostrar modal de movimiento de stock
function showStockModal(productId, productName, currentStock) {
    const modal = document.getElementById('stockModal');
    const productDisplay = document.getElementById('stockProductDisplay');
    const currentStockDisplay = document.getElementById('currentStockDisplay');
    
    if (!modal || !productDisplay || !currentStockDisplay) return;
    
    // Configurar valores
    document.getElementById('stockProductId').value = productId;
    document.getElementById('stockProductName').value = productName;
    
    productDisplay.textContent = productName;
    currentStockDisplay.textContent = currentStock;
    
    // Limpiar formulario
    document.getElementById('stockForm').reset();
    
    // Mostrar modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Configurar evento para guardar movimiento
    const saveMovementBtn = document.getElementById('saveStockMovement');
    if (saveMovementBtn) {
        saveMovementBtn.onclick = () => saveStockMovement(productId, productName, currentStock);
    }
}

// Guardar movimiento de stock
function saveStockMovement(productId, productName, currentStock) {
    const movementType = document.getElementById('movementType').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const reason = document.getElementById('reason').value;
    
    // Validaciones
    if (!movementType || !quantity || quantity <= 0) {
        alert('Por favor, complete todos los campos requeridos correctamente');
        return;
    }
    
    // Encontrar producto
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        alert('Producto no encontrado');
        return;
    }
    
    // Calcular nuevo stock
    let newStock = currentStock;
    if (movementType === 'entrada') {
        newStock += quantity;
    } else if (movementType === 'salida') {
        if (quantity > currentStock) {
            alert('No hay suficiente stock para realizar esta salida');
            return;
        }
        newStock -= quantity;
    } else if (movementType === 'ajuste') {
        newStock = quantity;
    }
    
    // Actualizar stock del producto
    products[productIndex].stock = newStock;
    
    // Guardar productos actualizados
    localStorage.setItem('products', JSON.stringify(products));
    
    // Registrar movimiento en el historial
    const movement = {
        id: Date.now(),
        productId,
        productName,
        type: movementType,
        quantity,
        previousStock: currentStock,
        newStock,
        reason,
        date: new Date().toISOString(),
        user: JSON.parse(localStorage.getItem('currentUser')).name || 'Sistema'
    };
    
    // Guardar movimiento
    const movements = JSON.parse(localStorage.getItem('movements')) || [];
    movements.push(movement);
    localStorage.setItem('movements', JSON.stringify(movements));
    
    // Cerrar modal
    closeModal(document.getElementById('stockModal'));
    
    // Recargar tabla
    renderProductsTable();
    
    // Mostrar notificación
    showNotification('Movimiento de stock registrado correctamente', 'success');
}

// Mostrar modal de eliminación
function showDeleteModal(productId, productName) {
    const modal = document.getElementById('deleteModal');
    const deleteProductName = document.getElementById('deleteProductName');
    
    if (!modal || !deleteProductName) return;
    
    deleteProductName.textContent = productName;
    
    // Mostrar modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Configurar evento para confirmar eliminación
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.onclick = () => deleteProduct(productId);
    }
}

// Eliminar producto
function deleteProduct(productId) {
    // Filtrar productos
    products = products.filter(p => p.id !== productId);
    
    // Guardar en localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Actualizar productos filtrados
    filteredProducts = filteredProducts.filter(p => p.id !== productId);
    
    // Cerrar modal
    closeModal(document.getElementById('deleteModal'));
    
    // Recargar tabla
    renderProductsTable();
    
    // Mostrar notificación
    showNotification('Producto eliminado correctamente', 'success');
}

// Filtrar productos
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const stockFilterValue = document.getElementById('stockFilter').value;
    
    filteredProducts = products.filter(product => {
        // Filtrar por búsqueda
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.code.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm));
        
        // Filtrar por categoría
        const matchesCategory = !category || product.category === category;
        
        // Filtrar por stock
        let matchesStock = true;
        if (stockFilterValue === 'low') {
            matchesStock = product.stock <= product.minStock;
        } else if (stockFilterValue === 'normal') {
            matchesStock = product.stock > product.minStock && product.stock <= product.minStock * 2;
        } else if (stockFilterValue === 'high') {
            matchesStock = product.stock > product.minStock * 2;
        }
        
        return matchesSearch && matchesCategory && matchesStock;
    });
    
    // Volver a la primera página
    currentPage = 1;
    
    // Renderizar tabla
    renderProductsTable();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('stockFilter').value = '';
    
    filteredProducts = [...products];
    currentPage = 1;
    renderProductsTable();
}

// Actualizar información de paginación
function updatePaginationInfo() {
    const pageInfo = document.getElementById('pageInfo');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (!pageInfo) return;
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    
    // Habilitar/deshabilitar botones
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
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